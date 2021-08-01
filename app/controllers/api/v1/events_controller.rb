class Api::V1::EventsController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => :create

  def index
    if (params[:page] && params[:per_page])
      @events = Event.all.paginate(:page => params[:page], :per_page => params[:per_page]).order('home_state ASC')
    else
      # @events = Event.order('home_state DESC').last(200)  #all.order('home_state ASC')
      @events = Event.all.order('home_state ASC')
    end

    puts @events.length

    respond_to do |format|
      format.json { @events }
    end
  end

  def show
    render json: @event
  end
end
