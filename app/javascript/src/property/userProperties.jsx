// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';


import '@src/home.scss'
import { safeCredentials } from '../utils/fetchHelper';


class UserProperties extends React.Component {
  state = {
    properties: [
    ],
    propertyBookings:[],
    loading: true,
    authenticated: false,
    username: null,
    userHasProperty: false
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
          this.userPropertyCheck(this.state.username);
        });
      })
      .catch(error => {
        console.error('Error fetching authenticated status:', error);
      });

      fetch('/api/bookings/user_owned_property_bookings')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle the data received from the backend
        this.setState({
          propertyBookings: data
        })
        console.log('Bookings data:', data);
        // Process the data further or update your frontend UI
      })
      .catch(error => {
        // Handle errors that occur during the fetch request
        console.error('Fetch error:', error);
      });
    
    
  }
  
  userPropertyCheck(username) {
    //username = "Tommy";
    fetch(`/api/${username}/properties`)
      .then(handleErrors)
      .then(data => {
        console.log('Response data:', data);
        if (Array.isArray(data) && data.length > 0) {
          this.setState({
            properties: data,
            userHasProperty: true
          });
        } else {
          this.setState({
            properties: [],
            userHasProperty: false
          });
        }
      })
  }

  handleDelete = (propertyId) => {

  
    fetch(`/api/properties/${propertyId}`, safeCredentials ( {
      method: 'DELETE',
    }))
    .then(response => {
      if (response.ok) {
        // Optionally, navigate to a different page or show a success message
        window.location.reload();
      } else {
        // Handle error
      }
    })
    .catch(error => {
      console.error('Error deleting property:', error);
    });
  };
  
  

  





  render() {
    const { properties, userHasProperty, username, propertyBookings} = this.state;
    const baseUrl = 'http://localhost:3000/'; // Update with your base URL
  
    return (
<Layout>
  <div>
    {/* Conditional rendering based on userHasProperties flag */}
    {userHasProperty ? (
      // Render content for user with properties
      <div className="container pt-4">
        <h1 className="mb-4">{username}'s Properties</h1>
        {/* Existing code for rendering properties */}
        <div className="row">
          {/* Render user's properties */}
          {properties.map(property => (
            <div key={property.id} className="col-6 col-lg-4 mb-4 property">
              {/* Property details */}
              <a href={`/property/${property.id}`} className="text-body text-decoration-none">
                <div className="property-image mb-1 rounded" style={{ backgroundImage: `url(${property.image_url})` }} />
                <p className="text-uppercase mb-0 text-secondary"><small><b>{property.city}</b></small></p>
                <h6 className="mb-0">{property.title}</h6>
                <p className="mb-0"><small>${property.price_per_night} USD/night</small></p>
              </a>
              {/* Edit and delete buttons */}
              <div className="mb-2">
                <a href={`/properties/edit/${property.id}`}>
                  <button className="btn btn-warning">Edit Property</button>
                </a>
              </div>
              <div>
                <button className="btn btn-danger" onClick={() => this.handleDelete(property.id)}>Delete Property</button>
              </div>
            </div>
          ))}
        </div>
        {/* Section for property bookings */}
        <div className="container pt-4">
          <h1 className="mb-4">Your Property Bookings</h1>
          <div className="list-group">
            {propertyBookings.map(booking => (
              <div key={booking.id} className="list-group-item">
                <h5 className="mb-1">Property Name: {booking.property.name}</h5>
                <p className="mb-1">Start Date: {booking.start_date}</p>
                <p className="mb-1">End Date: {booking.end_date}</p>
                <p className="mb-1">Paid: {booking['is_paid?'] ? 'Yes' : 'No'}</p>
                <p className="mb-1">Booked by: {booking.user.username}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Link to create a new property */}
        <div className='pt-3 pb-3'>
          <h3>Create New Property?</h3>
          <a href="/properties/create" className="btn btn-primary">Create</a>
        </div>
      </div>
    ) : (
      // Render content for user without properties
      <div>
        <h1>No Properties Found</h1>
        <p>You don't have any properties yet.</p>
        <a href="/properties/create" className="btn btn-primary">Create</a>
      </div>
    )}
  </div>
</Layout>
    );
  }
  
  
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <UserProperties />,
    document.body.appendChild(document.createElement('div')),
  )
})