import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { safeCredentialsForm, handleErrors } from '@utils/fetchHelper';
import '@src/home.scss';
import { loadStripe } from '@stripe/stripe-js';





class BookingsPage extends React.Component {
  state = {
    userBookings: [],
    loading: true,
  }

  componentDidMount() {
    this.loadUserBookings();
  }

  loadUserBookings() {
    fetch('/api/user_bookings')
      .then(handleErrors)
      .then(data => {
        this.setState({
          userBookings: data,
          loading: false,
        });
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching user bookings:', error);
        this.setState({ loading: false });
      });
  }

    redirectToCheckout = async (checkoutSessionId) => {
        const stripe = await loadStripe(`${process.env.STRIPE_PUBLISHABLE_KEY}`);
      
    stripe.redirectToCheckout({
      sessionId: checkoutSessionId
    }).then(function (result) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      if (result.error) {
        alert(result.error.message);
      }
    });
  }
  

  render() {
    const { userBookings, loading } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    return (
<Layout>
  <div className="my-4">
    <h1 className="mb-4">User Bookings</h1>
    {userBookings.length > 0 ? (
      <div className="list-group">
        {userBookings.map(booking => (
          <div key={booking.id} className="list-group-item">
            <h5 className="mb-1">Property Name: {booking.property.name} 🏠</h5>
            {booking.property.image_url && (
              <img src={booking.property.image_url} alt="Property" className="property-image img-fluid" style={{ height: "200px", objectFit: "cover" }} />
            )}
            <p className="mb-1">Check-in Date: {booking.start_date} 📥</p>
            <p className="mb-1">Check-out Date: {booking.end_date} 📤</p>
            <p className="mb-1">Paid: {booking['is_paid?'] ? 'Yes' : 'No'}</p>
            {!booking['is_paid?'] && (
              <button className="btn btn-primary" onClick={() => this.redirectToCheckout(booking.checkout_session_id)}>Pay Now</button>
            )}
          </div>
        ))}
      </div>
    ) : (
      <p>No bookings found for this user. 😕</p>
    )}
  </div>
</Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BookingsPage />,
    document.body.appendChild(document.createElement('div')),
  );
});
