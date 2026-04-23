// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PaystackButton } from 'react-paystack';
import { db } from '../firebase';
import { ref, push, runTransaction, get } from 'firebase/database';

const PaymentPage = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for expandable features
  const [expandedFeatures, setExpandedFeatures] = useState(false);
  
  // Get ticket data from navigation state or localStorage
  const [ticketData, setTicketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  
  // IMPORTANT: Replace this with your actual Paystack public key from your dashboard
  // Get test key from: https://dashboard.paystack.com/#/settings/developer
  const publicKey = "pk_live_5a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b";
  
  useEffect(() => {
    // Check if data was passed via navigation state
    if (location.state && location.state.ticket) {
      setTicketData(location.state);
      setLoading(false);
    } else {
      // Fallback to localStorage
      const savedData = localStorage.getItem('pendingTicketPurchase');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setTicketData({
          ticket: parsed.ticket,
          attendee: parsed.attendee,
          amount: parsed.ticket.price,
          email: parsed.attendee.email,
          fullName: parsed.attendee.fullName
        });
      }
      setLoading(false);
    }
  }, [location]);
  
  // Fetch wallet balance if user is logged in
  useEffect(() => {
    if (user && user.uid) {
      const walletRef = ref(db, `users/${user.uid}/walletBalance`);
      get(walletRef).then((snapshot) => {
        if (snapshot.exists()) {
          setWalletBalance(snapshot.val());
        }
      }).catch((error) => {
        console.error("Error fetching wallet balance:", error);
      });
    }
  }, [user]);
  
  const updateWallet = async (amount) => {
    if (!user || !user.uid) return;
    
    const walletRef = ref(db, `users/${user.uid}/walletBalance`);
    try {
      await runTransaction(walletRef, (currentBalance) => {
        return (currentBalance || 0) + amount / 100;
      });
      console.log("Wallet updated successfully!");
    } catch (error) {
      console.error("Error updating wallet:", error);
    }
  };
  
  const logPayment = async (reference, ticketData) => {
    if (!user || !user.uid) {
      // If user is not logged in, just store in localStorage for now
      const pendingPayment = {
        ticket: ticketData.ticket,
        attendee: ticketData.attendee,
        reference: reference.reference,
        amount: ticketData.amount,
        date: new Date().toISOString()
      };
      localStorage.setItem('pendingPayment', JSON.stringify(pendingPayment));
      console.log("Payment saved to localStorage (user not logged in)");
      
      // Navigate to confirmation
      navigate('/tickets/confirmation', {
        state: {
          ticket: ticketData.ticket,
          attendee: ticketData.attendee,
          reference: reference.reference
        }
      });
      return;
    }
    
    try {
      const paymentsRef = ref(db, `users/${user.uid}/payments`);
      await push(paymentsRef, {
        email: ticketData.email,
        amount: ticketData.amount / 100,
        reference: reference.reference,
        date: new Date().toISOString(),
        status: "success",
        ticketType: ticketData.ticket.name,
        attendeeName: ticketData.attendee.fullName,
        phone: ticketData.attendee.phone,
        country: ticketData.attendee.country,
        city: ticketData.attendee.city
      });
      console.log("Payment record saved successfully!");
      await updateWallet(ticketData.amount);
      
      // Clear saved data
      localStorage.removeItem('pendingTicketPurchase');
      
      // Navigate to confirmation
      navigate('/tickets/confirmation', {
        state: {
          ticket: ticketData.ticket,
          attendee: ticketData.attendee,
          reference: reference.reference
        }
      });
    } catch (error) {
      console.error("Error saving payment record:", error);
    }
  };
  
  const handlePaymentSuccess = async (reference) => {
    setProcessing(true);
    console.log(`Payment successful! Reference: ${reference.reference}`);
    await logPayment(reference, ticketData);
    setProcessing(false);
  };
  
  const handlePaymentClose = () => {
    console.log("Payment window closed");
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fa]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c3aed] mx-auto mb-4"></div>
          <p className="text-[#86868b]">Loading payment details...</p>
        </div>
      </div>
    );
  }
  
  if (!ticketData || !ticketData.ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8fa]">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="font-serif text-2xl text-[#1d1d1f] mb-2">No Ticket Selected</h2>
          <p className="text-[#86868b] mb-6">Please select a ticket before proceeding to payment.</p>
          <button
            onClick={() => navigate('/tickets')}
            className="px-6 py-3 bg-[#7c3aed] text-white rounded-lg text-sm font-semibold hover:bg-[#6d28d9] transition-all cursor-pointer"
          >
            Browse Tickets
          </button>
        </div>
      </div>
    );
  }
  
  const amountInKobo = parseInt(ticketData.ticket.price) * 100;
  
  // Get initial features (first 4) and remaining features
  const initialFeatures = ticketData.ticket.fullFeatures?.slice(0, 4) || [];
  const remainingFeatures = ticketData.ticket.fullFeatures?.slice(4) || [];
  const hasMoreFeatures = remainingFeatures.length > 0;
  
  const componentProps = {
    email: ticketData.email,
    amount: amountInKobo,
    publicKey: publicKey,
    text: `Pay ${ticketData.ticket.formattedPrice} Securely`,
    onSuccess: handlePaymentSuccess,
    onClose: handlePaymentClose,
    metadata: {
      custom_fields: [
        {
          display_name: "Ticket Type",
          variable_name: "ticket_type",
          value: ticketData.ticket.name
        },
        {
          display_name: "Attendee Name",
          variable_name: "attendee_name",
          value: ticketData.attendee.fullName
        },
        {
          display_name: "Event",
          variable_name: "event",
          value: "SORMS Lagos 2026"
        }
      ]
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f8fa] to-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-[#7c3aed] text-xs uppercase tracking-wider font-semibold mb-5 bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-4 py-2 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse"></span>
            Secure Checkout
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#1d1d1f] mb-2">
            Secure Payment
          </h1>
          <p className="text-[#86868b]">Complete your ticket purchase for SORMS Lagos 2026</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Order Summary Card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-black/5 bg-gradient-to-r from-[#7c3aed]/5 to-transparent">
              <h2 className="font-serif text-xl font-normal text-[#1d1d1f]">Order Summary</h2>
            </div>
            
            <div className="p-6">
              {/* Ticket Details */}
              <div className="mb-6 pb-6 border-b border-black/5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-[#1d1d1f]">{ticketData.ticket.name}</h3>
                    <p className="text-xs text-[#86868b] mt-1">SORMS Lagos 2026</p>
                    <p className="text-xs text-[#86868b]">July 24–25, 2026 · Lagos, Nigeria</p>
                  </div>
                  <div className="text-right">
                    <p className="font-serif text-xl text-[#7c3aed]">{ticketData.ticket.formattedPrice}</p>
                  </div>
                </div>
                
                {/* Features Section with Expand/Collapse */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-[#86868b] mb-2">Includes:</p>
                  <ul className="space-y-2">
                    {/* Initial Features */}
                    {initialFeatures.map((feature, idx) => (
                      <li key={`initial-${idx}`} className="text-xs text-[#48484a] flex items-start gap-2">
                        <span className="text-[#7c3aed] flex-shrink-0 mt-0.5">✓</span>
                        <span className="text-left">{feature}</span>
                      </li>
                    ))}
                    
                    {/* Expanded Features */}
                    {expandedFeatures && hasMoreFeatures && (
                      <div className="mt-2 space-y-2 animate-fadeIn">
                        {remainingFeatures.map((feature, idx) => (
                          <li key={`remaining-${idx}`} className="text-xs text-[#48484a] flex items-start gap-2">
                            <span className="text-[#7c3aed] flex-shrink-0 mt-0.5">✓</span>
                            <span className="text-left">{feature}</span>
                          </li>
                        ))}
                      </div>
                    )}
                  </ul>
                  
                  {/* Expand/Collapse Button */}
                  {hasMoreFeatures && (
                    <button
                      onClick={() => setExpandedFeatures(!expandedFeatures)}
                      className="mt-3 text-xs font-medium transition-all inline-flex items-center gap-1 text-[#7c3aed] hover:text-[#6d28d9]"
                    >
                      {expandedFeatures ? (
                        <>
                          <span>Show less</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>+{remainingFeatures.length} more benefits</span>
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
              
              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <p className="font-semibold text-[#1d1d1f]">Total Amount</p>
                <div className="text-right">
                  <p className="font-serif text-2xl text-[#7c3aed]">{ticketData.ticket.formattedPrice}</p>
                  <p className="text-xs text-[#86868b]">Inclusive of all taxes and fees</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Card */}
          <div className="bg-white rounded-2xl border border-black/5 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-black/5 bg-gradient-to-r from-[#7c3aed]/5 to-transparent">
              <h2 className="font-serif text-xl font-normal text-[#1d1d1f]">Payment Details</h2>
            </div>
            
            <div className="p-6">
              {/* Attendee Info */}
              <div className="mb-6 p-4 bg-[#f8f8fa] rounded-xl">
                <p className="text-xs text-[#86868b] mb-2">Paying as</p>
                <p className="font-medium text-[#1d1d1f]">{ticketData.attendee.fullName}</p>
                <p className="text-sm text-[#86868b]">{ticketData.email}</p>
                <p className="text-sm text-[#86868b]">{ticketData.attendee.phone}</p>
              </div>
              
              {/* Payment Method Info with Improved Images */}
              <div className="mb-6">
                <p className="text-sm font-medium text-[#1d1d1f] mb-3">Payment Method</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  {/* Visa Card */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-lg hover:border-[#7c3aed] transition-all">
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="20" rx="4" fill="#1434CB"/>
                      <path d="M12.5 14L14 6H16.5L15 14H12.5Z" fill="white"/>
                      <path d="M20.5 6.5C19.8 6.2 19 6 18.1 6C15.6 6 13.8 7.3 13.8 9.1C13.8 10.5 15 11.2 15.9 11.6C16.8 12 17.1 12.2 17.1 12.5C17.1 13 16.5 13.2 15.9 13.2C14.9 13.2 14.4 13 13.5 12.6L13 14.5C13.8 14.9 14.9 15.1 16 15.1C18.6 15.1 20.4 13.8 20.4 11.9C20.4 10.4 19.3 9.5 18.2 9C17.3 8.6 17 8.3 17 7.9C17 7.5 17.4 7.2 18.1 7.2C18.9 7.2 19.5 7.4 20 7.6L20.5 6.5Z" fill="white"/>
                      <path d="M26.5 6L24 14H21.5L24 6H26.5Z" fill="white"/>
                    </svg>
                    <span className="text-xs font-medium text-[#1d1d1f]">Visa</span>
                  </div>
                  
                  {/* Mastercard */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-lg hover:border-[#7c3aed] transition-all">
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="20" rx="4" fill="#F79F1A"/>
                      <circle cx="12" cy="10" r="4" fill="#F79F1A" stroke="#EB001B" strokeWidth="1"/>
                      <circle cx="20" cy="10" r="4" fill="#F79F1A" stroke="#F79F1A" strokeWidth="1"/>
                      <path d="M16 13C17.5 11.5 17.5 8.5 16 7" stroke="#FF5F00" strokeWidth="1" fill="none"/>
                    </svg>
                    <span className="text-xs font-medium text-[#1d1d1f]">Mastercard</span>
                  </div>
                  
                  {/* Verve */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-lg hover:border-[#7c3aed] transition-all">
                    <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="32" height="20" rx="4" fill="#0066B3"/>
                      <path d="M8 7L12 13L16 7" stroke="white" strokeWidth="1.5" fill="none"/>
                      <circle cx="20" cy="10" r="3" stroke="white" strokeWidth="1.5" fill="none"/>
                    </svg>
                    <span className="text-xs font-medium text-[#1d1d1f]">Verve</span>
                  </div>
                  
                  {/* Bank Transfer */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-white border border-black/10 rounded-lg hover:border-[#7c3aed] transition-all">
                    <svg className="w-5 h-5 text-[#86868b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-xs font-medium text-[#1d1d1f]">Bank Transfer</span>
                  </div>
                </div>
                <p className="text-xs text-[#86868b]">
                  Secure payment powered by Paystack. We accept all major cards, bank transfers, and mobile money.
                </p>
              </div>
              
              {/* Wallet Balance (if logged in) */}
              {user && user.uid && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#7c3aed]/5 to-[#a78bfa]/5 rounded-xl border border-[#7c3aed]/20">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-[#86868b]">Your Wallet Balance</p>
                    <span className="text-[0.55rem] px-2 py-0.5 bg-[#7c3aed]/10 text-[#7c3aed] rounded-full">Available</span>
                  </div>
                  <p className="font-serif text-2xl text-[#7c3aed]">₦{walletBalance.toFixed(2)}</p>
                  <p className="text-xs text-[#86868b] mt-1">You can top up your wallet at any time</p>
                  <button className="mt-2 text-xs text-[#7c3aed] font-medium hover:text-[#6d28d9] transition-all">
                    Top up wallet →
                  </button>
                </div>
              )}
              
              {/* Paystack Button */}
              <PaystackButton 
                {...componentProps} 
                className="w-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] hover:from-[#6d28d9] hover:to-[#5b21b6] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Pay {ticketData.ticket.formattedPrice} Securely
                  </>
                )}
              </PaystackButton>
              
              <p className="text-center text-xs text-[#86868b] mt-4">
                By completing this payment, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
        
        {/* Secure Badge */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 text-xs text-[#86868b] bg-white px-4 py-2 rounded-full shadow-sm">
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>256-bit SSL Encrypted</span>
            <span className="w-px h-3 bg-[#e5e7eb]"></span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>PCI DSS Compliant</span>
            <span className="w-px h-3 bg-[#e5e7eb]"></span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>3D Secure Ready</span>
          </div>
        </div>
        
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;