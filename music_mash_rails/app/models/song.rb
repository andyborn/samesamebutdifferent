class Song < ActiveRecord::Base
  attr_accessible :artist_name, :song_name, :deezer_url


  validate :ensure_artist_name_is_not_error 

  def get_similar_songs
    artist_name = self.artist_name
    song_name = self.song_name
    
    similar_songs_json = similar_songs_grabber(artist_name, song_name, 20)
      
      unless similar_songs_json['error']
        similar_songs_json = similar_songs_json['similartracks']['track']
        similar_songs_json = deezer_grabber(similar_songs_json) unless similar_songs_json.is_a?(String)
      end

    similar_songs_json
  end  

  # methods to fetch last.fm song recommendations and deezer tracks matching last.fm similartracks titles.  check returned track artist name against last.fm artist name.  
  # if they match, return first song that matches.

  # need to rewrite deezer method so that it doesnt just grab last matching song... somehow break the 'if loop'

  def lastfm_params_normalizer
    unless self.artist_name.blank? || self.artist_name.blank? 
      artist = self.artist_name
      song = self.song_name
      lastfm_return = HTTParty.get("http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=d3efa10c1b792c94cbe21ae756ae44ae&artist=#{encodeURIComponent(artist)}&track=#{encodeURIComponent(song)}&format=json")    
      if lastfm_return['error']
        self.artist_name = "error"
        self.song_name = "error"
      else  
        self.artist_name = lastfm_return['track']['artist']['name']
        self.song_name = lastfm_return['track']['name']
      end
    end  
  end

  def url_is_invalid?
    self.deezer_url[/\d+/] == nil
  end

  def similar_songs_grabber(artist, song, limit)
    HTTParty.get("http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=#{encodeURIComponent(artist)}&track=#{encodeURIComponent(song)}&limit=#{limit}&autocorrect=0&api_key=d3efa10c1b792c94cbe21ae756ae44ae&format=json")
  end 

  def deezer_grabber(similar_songs_hash)
    similar_songs_hash.each do |similarsong|
      deezer_json = HTTParty.get("http://api.deezer.com/search/autocomplete?q=#{encodeURIComponent(similarsong['name'])}")
      similarsong[:deezer] = deezer_json['tracks']['data'].detect { |deezertrack| deezertrack['artist']['name'] == similarsong['artist']['name'] }
    end
  end

  def deezer_track_grabber(deezer_songs_hash)
    deezer_songs_hash['data'].each do |favsong|
      get_url = "http://api.deezer.com/track/" + favsong['id']
      deezer_song_info_json = HTTParty.get(get_url)
      favsong[:song_info] = deezer_song_info_json
    end
  end    

  def deezer_url_grabber
    # gets track id from end of normal track url and appends to deezer api search url
    get_url = "http://api.deezer.com/track/" + self.deezer_url[/\d+/]
    deezer_song_info_json = HTTParty.get(get_url)
    
    unless deezer_song_info_json == {"error"=>{"type"=>"DataException", "message"=>"no data", "code"=>800}}
      self.song_name = deezer_song_info_json['title']
      self.artist_name = deezer_song_info_json['artist']['name']
    end
  end  


  # methods to format text input variables into URI syntax

  def symbols
    ' !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~' # symbols.length === 33
  end


  def gsub(input, replace)
    search = Regexp.new(replace.keys.map{|x| "(?:#{Regexp.quote(x)})"}.join('|'))
    input.gsub(search, replace)
  end

  def encodeURIComponent(value)
    # encodeURIComponent(symbols) === "%20   ! %22 %23 %24 %25 %26   '   (   )   * %2B %2C - . %2F %3A %3B %3C %3D %3E %3F %40 %5B %5C %5D %5E _ %60 %7B %7C %7D   ~"
    # CGI.escape(symbols)         === "  + %21 %22 %23 %24 %25 %26 %27 %28 %29 %2A %2B %2C - . %2F %3A %3B %3C %3D %3E %3F %40 %5B %5C %5D %5E _ %60 %7B %7C %7D %7E"
    gsub(CGI.escape(value.to_s),
        '+'   => '%20',  '%21' => '!',  '%27' => "'",  '%28' => '(',  '%29' => ')',  '%2A' => '*',
        '%7E' => '~'
    )
  end

  def ensure_artist_name_is_not_error
    errors.add :artist_name, "cannot be `error`" if artist_name == 'error'
    errors.add :artist_name, "cannot be `blank`" if artist_name == ''
    errors.add :song_name, "cannot be `blank`" if song_name == ''
  end






end
