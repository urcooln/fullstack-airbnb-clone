module Api
  class BookingsController < ApplicationController
    def create
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized if !session

      property = Property.find_by(id: params[:booking][:property_id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      begin
        @booking = Booking.create({ user_id: session.user.id, property_id: property.id, start_date: params[:booking][:start_date], end_date: params[:booking][:end_date]})
        render 'api/bookings/create', status: :created
      rescue ArgumentError => e
        render json: { error: e.message }, status: :bad_request
      end
    end

    def get_property_bookings
      property = Property.find_by(id: params[:id])
      return render json: { error: 'cannot find property' }, status: :not_found if !property

      @bookings = property.bookings.where("end_date > ? ", Date.today)
      render 'api/bookings/index'
    end



    def user_bookings
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized unless session
    
      user = session.user
    
      bookings_data = user.bookings.map do |booking|
        property = booking.property
        image_url = property.image.attached? ? url_for(property.image) : nil
      
        {
          id: booking.id,
          property_id: booking.property_id,
          start_date: booking.start_date,
          end_date: booking.end_date,
          property: {
            id: property.id,
            name: property.title,
            image_url: image_url
          },
          is_paid?: booking.is_paid?,
          checkout_session_id: booking.checkout_session_id 
        }
      end
      
      render json: bookings_data
    end

    def user_owned_property_bookings
      token = cookies.signed[:airbnb_session_token]
      session = Session.find_by(token: token)
      return render json: { error: 'user not logged in' }, status: :unauthorized unless session
    
      user = session.user
      owned_properties = user.properties
      bookings_data = []
    
      # Loop through each property owned by the user
      owned_properties.each do |property|
        # Retrieve bookings associated with the property
        property.bookings.each do |booking|
          image_url = property.image.attached? ? url_for(property.image) : nil
    
          # Include user's information who made the booking
          booking_user = booking.user
    
          # Format booking data including user's information
          booking_data = {
            id: booking.id,
            property_id: booking.property_id,
            start_date: booking.start_date,
            end_date: booking.end_date,
            property: {
              id: property.id,
              name: property.title,
              image_url: image_url
            },
            user: {
              id: booking_user.id,
              username: booking_user.username, # Adjust to the actual attribute name of the user's name
              email: booking_user.email # Adjust to the actual attribute name of the user's email
              # Add any other user information you want to include
            },
            is_paid?: booking.is_paid?,
            checkout_session_id: booking.checkout_session_id
          }
    
          bookings_data << booking_data
        end
      end
    
      render json: bookings_data
    end
      
    

    private

    def booking_params
      params.require(:booking).permit(:property_id, :start_date, :end_date)
    end
  end
end