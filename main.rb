require 'pry-byebug'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'pg'
require 'httparty'
require 'json'

get '/' do 
  @song_name = params[:song_name].to_s
  @artist_name = params[:artist_name].to_s
  
  if params != {}
    @similar_songs_json = similar_songs_grabber(@artist_name, @song_name, 10)

    unless @similar_songs_json['error'] != nil  
      @similar_songs_hash = @similar_songs_json['similartracks']['track']
      unless @similar_songs_hash.is_a?(String)
        deezer_grabber(@similar_songs_hash)
      end
    end
  end

  
  erb :lastfm_getter
end

# methods to fetch last.fm song recommendations and deezer tracks matching last.fm similartracks titles.  check returned track artist name against last.fm artist name.  
# if they match, return first song that matches.

# need to rewrite deezer method so that it doesnt just grab last matching song... somehow break the 'if loop'

def similar_songs_grabber(artist, song, limit)
  HTTParty.get("http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=#{encodeURIComponent(artist)}&track=#{encodeURIComponent(song)}&limit=#{limit}&autocorrect=0&api_key=d3efa10c1b792c94cbe21ae756ae44ae&format=json")
end 

def deezer_grabber(similar_songs_hash)

  similar_songs_hash.each do |similarsong|
    @deezer_json = HTTParty.get("http://api.deezer.com/search/autocomplete?q=#{encodeURIComponent(similarsong['name'])}")
    @deezer_json['tracks']['data'].each do |deezertrack|
      if deezertrack['artist']['name'] == similarsong['artist']['name']
        similarsong[:deezer] = deezertrack
      end 
    end
  end
  return @similar_songs_with_deezer = similar_songs_hash
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