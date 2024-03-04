import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { safeCredentialsForm, handleErrors } from '@utils/fetchHelper';
import '@src/home.scss';
import { loadStripe } from '@stripe/stripe-js';



class BookingSuccessPage extends React.Component {
  render() {
    return (
      <Layout>
        <div className="container mt-4">
          <h1>Booking Processing</h1>
          <p>Your booking is currently being processed Check Bookings Tab for more information.</p>
        </div>
      </Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <BookingSuccessPage />,
    document.body.appendChild(document.createElement('div')),
  );
});
