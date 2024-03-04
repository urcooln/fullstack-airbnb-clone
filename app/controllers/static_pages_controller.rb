class StaticPagesController < ApplicationController
  def home
    render 'home'
  end

  def property
    @data = { property_id: params[:id] }.to_json
    render 'property'
  end
  
  def login
    render 'login'
  end

  def user_properties
    render 'userProperties'
  end
  
  def create_properties
    render 'createProperties'
  end

  def edit_properties
    @data = { property_id: params[:id] }.to_json
    render 'editProperties'
  end

  def bookings
  end

  def booking_success
    render 'bookingSuccess'
  end

   
end