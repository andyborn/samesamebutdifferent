require 'pry-byebug'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'pg'
require 'httparty'
require 'json'

get '/' do 
  @song_name = params[:song_name].to_s
  @artist_name = params[:artist_name].to_s
  @songs = HTTParty.get("http://ws.audioscrobbler.com/2.0/?method=track.getsimilar&artist=#{encodeURIComponent(@artist_name)}&track=#{encodeURIComponent(@song_name)}&limit=5&autocorrect=1&api_key=d3efa10c1b792c94cbe21ae756ae44ae&format=json")
  # @songs = JSON(@songs)
  @songs_hash = @songs['similartracks']['track']
  @songs_hash_first = @songs['similartracks']['track'][0]

  @deezer = HTTParty.get("http://api.deezer.com/search/autocomplete?q=#{encodeURIComponent(@songs_hash_first['name'])}")

  binding.pry
  erb :lastfm_getter
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