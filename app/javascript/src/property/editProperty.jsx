import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { safeCredentialsForm, handleErrors } from '@utils/fetchHelper';
import '@src/home.scss';

class EditForm extends React.Component {
  state = {
    property: {},
    username: null,
    success:  false,
  };

  componentDidMount() {
    // Fetch existing property data
    fetch(`/api/properties/${this.props.property_id}`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          property: data.property,
        });
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching property data:', error);
      });

    // Fetch authenticated user data
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        this.setState({
          authenticated: data.authenticated,
          username: data.username,
        });
      })
      .catch(error => {
        console.error('Error fetching authenticated status:', error);
      });
  }


  handleSubmit = (event) => {
    event.preventDefault();

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

    // Send PUT request to update the property
    fetch(`/api/properties/${this.props.property_id}`, safeCredentialsForm({
      method: 'PUT',
      body: formData,
    }))
      .then(handleErrors)
      .then(response => {
        console.log('Property updated successfully:', response);
        this.setState({ success: true })
      })
      .catch(error => {
        console.error('Error updating property:', error);
      });
  };
  
  render() {
    const { property, success, username } = this.state;
    const isOwner = property.user && username && property.user.username === username;


    if (success) {
      // Redirect to the property page after successful update
      window.location.href = `/property/${property.id}`;
    }


    return (
      <Layout>
        <div className="container mt-4">
          <h1 className="mb-4">Edit Property Page</h1>
          {isOwner ? ( // Render form if user is the owner
<form onSubmit={this.handleSubmit}>
<div className="mb-3">
  <label htmlFor="title" className="form-label">Title:</label>
  <input type="text" className="form-control" id="title" name="title" defaultValue={property.title} />
</div>
<div className="mb-3">
  <label htmlFor="description" className="form-label">Description:</label>
  <textarea className="form-control" id="description" name="description" defaultValue={property.description} />
</div>
<div className="mb-3">
  <label htmlFor="city" className="form-label">City:</label>
  <input type="text" className="form-control" id="city" name="city" defaultValue={property.city} />
</div>
<div className="mb-3">
  <label htmlFor="country" className="form-label">Country:</label>
  <input type="text" className="form-control" id="country" name="country" defaultValue={property.country}/>
</div>
<div className="mb-3">
  <label htmlFor="propertyType" className="form-label">Property Type:</label>
  <input type="text" className="form-control" id="property_type" name="property_type" defaultValue={property.property_type}/>
</div>
<div className="mb-3">
  <label htmlFor="pricePerNight" className="form-label">Price Per Night:</label>
  <input type="number" className="form-control" id="price_per_night" name="price_per_night" defaultValue={property.price_per_night}/>
</div>
<div className="mb-3">
  <label htmlFor="maxGuest" className="form-label">Max Guest:</label>
  <input type="number" className="form-control" id="max_guests" name="max_guests" defaultValue={property.max_guests} />
</div>
<div className="mb-3">
  <label htmlFor="bedrooms" className="form-label">Bedrooms:</label>
  <input type="number" className="form-control" id="bedrooms" name="bedrooms" defaultValue={property.bedrooms}/>
</div>
<div className="mb-3">
  <label htmlFor="beds" className="form-label">Beds:</label>
  <input type="number" className="form-control" id="beds" name="beds" defaultValue={property.beds}/>
</div>
<div className="mb-3">
  <label htmlFor="baths" className="form-label">Baths:</label>
  <input type="number" className="form-control" id="baths" name="baths" defaultValue={property.baths}/>
</div>
<div className="mb-3">
  <label htmlFor="image" className="form-label">Image:</label>
  <input type="file" className="form-control" id="image" accept="image/*" name="image" />
</div>
<button type="submit" className="btn btn-primary">Submit</button>
</form>              
          ) : (
            <p>You do not have permission to edit this property.</p>
          )}
        </div>
      </Layout>

    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.getElementById('params');
  const data = JSON.parse(node.getAttribute('data-params'));

  ReactDOM.render(
    <EditForm property_id={data.property_id} />,
    document.body.appendChild(document.createElement('div')),
  );
});
