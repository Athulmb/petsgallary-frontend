import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import API_BASE_URL from '../utils/api'; // Adjust the import based on your project structure
// import { api } from '../utils/api'; 



const CheckoutPage = () => {
  const { state } = useLocation();
  const orderItems = state?.cartItems || [];
  const quantities = state?.quantities || {};
  const total = state?.total || 0;  // ✅ access total from state

  const [paymentMethod, setPaymentMethod] = useState('card');

  // const orderPrice = orderItems.reduce((sum, item) => {
  //   const qty = quantities[item.id] || 1;
  //   return sum + item.price * qty;
  // }, 0);
  // const gstRate = 0.18;
  // const gst = Math.round(orderPrice * gstRate);
  // const orderTotal = orderPrice + gst;

  // const orderTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // const gst = 15;
  // const finalAmount = orderTotal + gst;


  // const handlePayment = async () => {
  //   console.log('REACT_APP_STRIPE_KEY:', process.env.REACT_APP_STRIPE_KEY);
  //   try {
  //     const response = await 
  //     axios.post('http://127.0.0.1:8000/api/stripe/checkout', {

  //     api.post('/stripe/checkout', {
  //       items: orderItems.map(item => ({
  //         id: item.id,
  //         name: item.name,
  //         totalAmount: total,
  //         quantity: quantities[item.id] || 1,
  //       })),
  //     });

  //     const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY);
  //     await stripe.redirectToCheckout({
  //       sessionId: response.data.id,
  //     });
  //   } catch (error) {
  //     console.error('Payment error:', error);
  //   }
  // };

  const handlePayment = async () => {
    const payload = {
      items: orderItems.map(item => ({
        id: item.id,
        name: item.name,
        totalAmount: total,
        quantity: quantities[item.id] || 1,
      })),
    };
    console.log('Payload sent to API:', payload);
    try {
      const response = await
        axios.post('https://backend.petsgallerydubai.com/api/stripe/checkout', payload);
      // api.post('/stripe/checkout', payload);
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_KEY, {
        // locale: 'ar', 
      });
      await stripe.redirectToCheckout({
        sessionId: response.data.id,
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] px-[98px] py-6">
      <div className="mb-6">
        <Link to="/cart" className="text-gray-600 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
      </div>

      <h1 className="text-5xl font-semibold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <section>
            <h2 className="text-2xl font-medium mb-4">Delivery address</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="City"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500 placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Street"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Country"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <input
                type="text"
                placeholder="House/Flat/Floor No"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500"
              />
              <input
                type="text"
                placeholder="Zip Code"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500"
              />
            </div>
          </section>

          {/* Contact Info */}
          <section>
            <h2 className="text-2xl font-medium mb-6">Contact Info</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Name"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="bg-[#F5F6ED] p-3 rounded-2xl placeholder-gray-500"
              />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-6">Payment Method</h2>
            <label className="flex items-center space-x-2 mb-4">
              <input
                type="radio"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                className="w-4 h-4 accent-[#FF9B6A]"
              />
              <span>Pay Online (Stripe)</span>
            </label>

            {paymentMethod === 'card' && (
              <button
                onClick={handlePayment}
                className="w-full bg-[#FF9B57] text-white py-3 rounded-full mt-4"
              >
                Proceed to Payment
              </button>
            )}

            <label className="flex items-center space-x-2 mt-4">
              <input
                type="radio"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="w-4 h-4 accent-[#FF9B6A]"
              />
              <span>Cash on Delivery</span>
            </label>
          </section>
        </div>

        {/* Right */}
        <div className="bg-[#F5F6ED] p-6 rounded">
          <h2 className="text-2xl font-semibold mb-6 border-b border-gray-500 pb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {orderItems.map((item, i) => (
              <div key={i} className="flex justify-between border-b border-gray-300 pb-4">
                <div>
                  <p className="text-sm">{item.name}</p>

                </div>
                <div className="text-sm text-right">
                  <div>Qty: {quantities[item.id] || 1}</div>
                  <div>DH {item.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>DH {orderPrice}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="text-gray-500">GST</span>
              <span>DH {gst}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span>DH {total}</span>
            </div>
          </div> */}
          <div className="space-y-2 text-sm">
            {/* <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span>DH {orderTotal}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 pb-2">
              <span className="text-gray-500">GST</span>
              <span>DH {gst}</span>
            </div> */}
            <div className="flex justify-between font-semibold pt-2">
              <span>Total</span>
              <span>DH {total}</span>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
