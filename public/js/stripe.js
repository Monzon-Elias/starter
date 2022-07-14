/* eslint-disable */
const stripe = Stripe(
  'pk_test_51LJOYVFWrHRdbOhj5tDN2lL3cZX8ajMqojgBb7vawT0WFe2TDg4kzL0Kz6WCjj9osvewbntEUlRbi2rRVudWX7ob00OklUErJY'
);
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    //1. Get checkout session from API
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    //2. Create checkout from + change credit card
    await stripe.redirectToCheckout({ sessionId: session.data.session.id });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
