import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { safeCredentialsForm, handleErrors } from '@utils/fetchHelper';
import '@src/home.scss';

class PropertyForm extends React.Component {

    state = {
        username: null,
        success: false,
      }

    componentDidMount() {
        fetch('/api/authenticated')
          .then(handleErrors)
          .then(data => {
            this.setState({
              authenticated: data.authenticated,
              username: data.username,
            }, () => {
              // Call userPropertyCheck after state has been updated
            });
          })
          .catch(error => {
            console.error('Error fetching authenticated status:', error);
          });
      }
    
    handleSubmit = (event) => {
        // Prevent default form submission
        event.preventDefault();
      
        // Get form data
        const formData = new FormData();
      
        // Append the property data to formData
        formData.append('property[title]', event.target.title.value);
        formData.append('property[description]', event.target.description.value);
        formData.append('property[city]', event.target.city.value);
        formData.append('property[country]', event.target.country.value);
        formData.append('property[property_type]', event.target.property_type.value);
        formData.append('property[price_per_night]', event.target.price_per_night.value);
        formData.append('property[max_guests]', event.target.max_guests.value);
        formData.append('property[bedrooms]', event.target.bedrooms.value);
        formData.append('property[beds]', event.target.beds.value);
        formData.append('property[baths]', event.target.baths.value);
      
        // Append the image file to formData under the 'image' key
        const fileInputElement = document.getElementById('image');
        if (fileInputElement.files.length > 0) {
          formData.append('property[image]', fileInputElement.files[0]);
        }

          // Add username to formData
        const { username } = this.state; // Assuming username is available in state
        formData.append('property[user]', username);

      
        // Send POST request to the backend
        fetch('/api/properties', safeCredentialsForm({
          method: 'POST',
          body: formData,
        }))
          .then(handleErrors)
          .then(response => {
            // Handle success (e.g., show success message)
            console.log('Property created successfully:', response);
            this.setState({ success: true })
          })
          .catch(error => {
            console.error('Error creating property:', error);
            // Handle error (e.g., display error message to the user)
          });
      };
      
      
      
    
    
      

  render() {

    const { success } = this.state;

    if (success) {
      // Redirect to the property page after successful update
      window.location.href = `/properties`;
    }

    return (
      <Layout>
        <div className="container mt-4">
          <h1 className="mb-4">Create Property Page</h1>
          <form onSubmit={this.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title:</label>
              <input type="text" className="form-control" id="title" name="title" />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description:</label>
              <textarea className="form-control" id="description" name="description" />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">City:</label>
              <input type="text" className="form-control" id="city" name="city" />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country:</label>
              <input type="text" className="form-control" id="country" name="country" />
            </div>
            <div className="mb-3">
              <label htmlFor="propertyType" className="form-label">Property Type:</label>
              <input type="text" className="form-control" id="property_type" name="property_type" />
            </div>
            <div className="mb-3">
              <label htmlFor="pricePerNight" className="form-label">Price Per Night:</label>
              <input type="number" className="form-control" id="price_per_night" name="price_per_night" />
            </div>
            <div className="mb-3">
              <label htmlFor="maxGuest" className="form-label">Max Guest:</label>
              <input type="number" className="form-control" id="max_guests" name="max_guests" />
            </div>
            <div className="mb-3">
              <label htmlFor="bedrooms" className="form-label">Bedrooms:</label>
              <input type="number" className="form-control" id="bedrooms" name="bedrooms" />
            </div>
            <div className="mb-3">
              <label htmlFor="beds" className="form-label">Beds:</label>
              <input type="number" className="form-control" id="beds" name="beds" />
            </div>
            <div className="mb-3">
              <label htmlFor="baths" className="form-label">Baths:</label>
              <input type="number" className="form-control" id="baths" name="baths" />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Image:</label>
              <input type="file" className="form-control" id="image" accept="image/*" name="image" />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <PropertyForm />,
    document.body.appendChild(document.createElement('div')),
  );
});
