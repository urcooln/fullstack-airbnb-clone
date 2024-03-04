module Api
  class PropertiesController < ApplicationController


    def index
      @properties = Property.order(created_at: :desc).page(params[:page]).per(6)
      return render json: { error: 'not_found' }, status: :not_found if @properties.blank?

      render 'api/properties/index', status: :ok
    end

    def show
      @property = Property.find_by(id: params[:id])
      return render json: { error: 'not_found' }, status: :not_found if @property.blank?

      render 'api/properties/show', status: :ok
    end
    
    def destroy
      property = Property.find(params[:id])
      property.destroy
      head :no_content
    end

    def create
      user = User.find_by(username: params[:property][:user])
      @property = user.properties.build(property_params)
      if @property.save
        render json: @property, status: :created
      else
        render json: { errors: @property.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      property = Property.find(params[:id])
    
      if property.update(property_params)
        render json: property, status: :ok
      else
        render json: { error: property.errors.full_messages }, status: :unprocessable_entity
      end
    end
    
    def properties_by_user
      user = User.find_by(username: params[:username])
      if user
        properties = user.properties.map do |property|
          {
            id: property.id,
            title: property.title,
            description: property.description,
            city: property.city,
            country: property.country,
            property_type: property.property_type,
            price_per_night: property.price_per_night,
            max_guests: property.max_guests,
            bedrooms: property.bedrooms,
            beds: property.beds,
            baths: property.baths,
            image_url: property.image.attached? ? url_for(property.image) : nil, # Get the image URL if attached
            user_id: property.user_id,
            created_at: property.created_at,
            updated_at: property.updated_at
          }
        end
        render json: properties, status: :ok
      else
        render json: { error: 'User not found' }, status: :not_found
      end
    end
    

    private

    def property_params
      params.require(:property).permit(:title, :description, :city, :country, :property_type, :price_per_night, :max_guests, :bedrooms, :beds, :baths, :image)
    end
  end
end
