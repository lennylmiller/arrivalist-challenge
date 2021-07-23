class EventsController < ApplicationController
  skip_before_action :verify_authenticity_token, :only => :create

  def index
    if params[:page] and params[:per_page]
      render json: Event.all.paginate(:page => params[:page], :per_page => params[:per_page]) #.order('created_at ASC')
    else
      render json: Event.all
    end
  end

  def show
    render json: @event
  end
end
