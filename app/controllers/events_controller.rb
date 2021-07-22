class EventsController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => :create

  def index
    @events = Event.all.paginate(:page => params[:page], :per_page => params[:per_page]) #.order('created_at ASC')
    respond_to do |format|
      format.html
      format.json { @projects }
    end
  end

  def show
    render json: @event
  end
end
