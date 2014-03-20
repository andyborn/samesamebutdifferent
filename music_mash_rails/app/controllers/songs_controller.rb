class SongsController < ApplicationController

  before_filter :load

  def load
  end  

  # GET /songs
  # GET /songs.json
  def index
    @song = Song.new
    
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @songs }
    end
  end

  # GET /songs/1
  # GET /songs/1.json
  
  def new
    @song = Song.new(params[:song])
  end  

  # GET /songs/1/edit
  def edit
    @song = Song.find(params[:id])
  end

  # POST /songs
  # POST /songs.json
  def create
    @song = Song.new(params[:song])
    @song.lastfm_params_normalizer if @song.deezer_url.blank? 
      
    
    unless (@song.deezer_url.blank? || @song.url_is_invalid?) 
      @song.deezer_url_grabber 
      @song.lastfm_params_normalizer
    end
    respond_to do |format|
      if @song.save
        format.html { redirect_to @song, notice: 'Song was successfully created.' }
        format.json { render json: @song, status: :created, location: @song }
      else
        format.html { render action: "index" }
        format.json { render json: @song.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    @song = Song.find(params[:id])
    @similar_songs_json = @song.get_similar_songs
    
 
  end

  # PUT /songs/1
  # PUT /songs/1.json
  def update
    @song = Song.find(params[:id])

    respond_to do |format|
      if @song.update_attributes(params[:song])
        format.html { redirect_to @song, notice: 'Song was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @song.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /songs/1
  # DELETE /songs/1.json
  def destroy
    @song = Song.find(params[:id])
    @song.destroy

    respond_to do |format|
      format.html { redirect_to songs_url }
      format.json { head :no_content }
    end
  end
end
