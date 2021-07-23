module Api
  module V1
    class EventsController < ApplicationController
      skip_before_action :verify_authenticity_token, :only => :create

      def index
        if (params[:page] && params[:per_page])
          @events = Event.all.paginate(:page => params[:page], :per_page => params[:per_page]) #.order('created_at ASC')
        else
          @events = event.all
        end

        respond_to do |format|
          format.json { @events }
        end
      end

      def show
        render json: @event
      end
    end
  end
end