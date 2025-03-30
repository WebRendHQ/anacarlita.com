'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
import { useAuth } from '../../../context/AuthContext';
import { getStripe, createCheckoutSession } from '../../../utils/stripe';
import { formatCurrency, formatDate, calculateTotalPrice } from '../../../utils/format';
import { RentalItem, Booking } from '../../../types';
import Calendar from 'react-calendar';
import styles from './rental-detail.module.scss';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

export default function RentalDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [item, setItem] = useState<RentalItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingDates, setBookingDates] = useState<Value>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [processingBooking, setProcessingBooking] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Fetch rental item data
  useEffect(() => {
    const fetchRentalItem = async () => {
      try {
        setLoading(true);
        const itemDoc = await getDoc(doc(firestore, 'rentalItems', id as string));
        
        if (!itemDoc.exists()) {
          setError('Rental item not found');
          return;
        }
        
        const itemData = itemDoc.data() as Omit<RentalItem, 'id'>;
        setItem({
          id: itemDoc.id,
          ...itemData
        });
      } catch (err) {
        console.error('Error fetching rental item:', err);
        setError('Failed to load rental item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRentalItem();
    }
  }, [id]);

  // Handle date selection in the calendar
  const handleDateChange = (value: Value) => {
    if (!Array.isArray(value) || !value[0] || !value[1]) {
      setBookingDates(null);
      setTotalPrice(0);
      return;
    }
    
    setBookingDates(value);
    
    // Calculate total price
    if (item) {
      const totalPrice = calculateTotalPrice(
        item.pricePerDay,
        value[0].toISOString(),
        value[1].toISOString()
      );
      setTotalPrice(totalPrice);
    }
  };

  // Handle booking button click
  const handleBooking = async () => {
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!item || !Array.isArray(bookingDates) || !bookingDates[0] || !bookingDates[1]) {
      return;
    }
    
    try {
      setProcessingBooking(true);
      
      // Create a checkout session
      const { sessionId } = await createCheckoutSession(
        item.id,
        item.stripePriceId || '',
        bookingDates[0].toISOString(),
        bookingDates[1].toISOString(),
        totalPrice,
        user.email
      );
      
      // Redirect to Stripe checkout
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        
        if (error) {
          console.error('Stripe checkout error:', error);
          throw new Error(error.message);
        }
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError('Failed to process booking. Please try again.');
    } finally {
      setProcessingBooking(false);
    }
  };

  // Check if a date is available for booking
  const isDateAvailable = (date: Date) => {
    if (!item || !item.availability) return false;
    
    const availabilityStart = new Date(item.availability.start);
    const availabilityEnd = new Date(item.availability.end);
    
    const isWithinAvailabilityRange = 
      date >= availabilityStart && 
      date <= availabilityEnd;
    
    // Check if date is in excluded dates
    const isExcluded = item.availability.excludedDates?.some(excludedDate => {
      const excluded = new Date(excludedDate);
      return (
        date.getDate() === excluded.getDate() &&
        date.getMonth() === excluded.getMonth() &&
        date.getFullYear() === excluded.getFullYear()
      );
    });
    
    return isWithinAvailabilityRange && !isExcluded;
  };

  // Change the active image
  const handleImageChange = (index: number) => {
    setActiveImageIndex(index);
  };

  // Tile class name for calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    return isDateAvailable(date) ? styles.availableDate : styles.unavailableDate;
  };

  // Disable dates that are not available
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return false;
    
    return !isDateAvailable(date);
  };

  if (loading) {
    return (
      <div className={styles.rentalDetailPage}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading rental details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className={styles.rentalDetailPage}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h1>Error</h1>
            <p>{error || 'Failed to load rental item'}</p>
            <button onClick={() => router.push('/rentals')}>
              Back to Rentals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rentalDetailPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <button onClick={() => router.push('/rentals')} className={styles.backButton}>
            ← Back to Rentals
          </button>
        </div>
        
        <div className={styles.rentalDetail}>
          <div className={styles.imageSection}>
            <div className={styles.mainImage}>
              {item.images && item.images.length > 0 ? (
                <img 
                  src={item.images[activeImageIndex]} 
                  alt={item.title}
                />
              ) : (
                <div className={styles.noImage}>
                  <span>No Image Available</span>
                </div>
              )}
            </div>
            
            {item.images && item.images.length > 1 && (
              <div className={styles.thumbnails}>
                {item.images.map((image, index) => (
                  <div 
                    key={index}
                    className={`${styles.thumbnail} ${index === activeImageIndex ? styles.active : ''}`}
                    onClick={() => handleImageChange(index)}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className={styles.infoSection}>
            <div className={styles.header}>
              <h1>{item.title}</h1>
              <div className={styles.meta}>
                <span className={styles.category}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </span>
                <span className={styles.location}>{item.location}</span>
              </div>
              <div className={styles.price}>
                {formatCurrency(item.pricePerDay)} / day
              </div>
            </div>
            
            <div className={styles.description}>
              <h2>Description</h2>
              <p>{item.description}</p>
            </div>
            
            {item.features && item.features.length > 0 && (
              <div className={styles.features}>
                <h2>Features</h2>
                <ul>
                  {item.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className={styles.availability}>
              <h2>Availability</h2>
              <p>
                Available from {formatDate(item.availability.start)} to {formatDate(item.availability.end)}
              </p>
            </div>
            
            <div className={styles.bookingSection}>
              <h2>Book This Item</h2>
              
              <div className={styles.calendarContainer}>
                <Calendar
                  onChange={handleDateChange}
                  value={bookingDates}
                  selectRange={true}
                  tileClassName={tileClassName}
                  tileDisabled={tileDisabled}
                  minDate={new Date()}
                  className={styles.calendar}
                  nextLabel=">"
                  prevLabel="<"
                  next2Label={null}
                  prev2Label={null}
                />
              </div>
              
              {Array.isArray(bookingDates) && bookingDates[0] && bookingDates[1] && (
                <div className={styles.bookingSummary}>
                  <h3>Booking Summary</h3>
                  <div className={styles.bookingDetails}>
                    <div className={styles.bookingDates}>
                      <div>
                        <strong>From:</strong> {formatDate(bookingDates[0].toISOString())}
                      </div>
                      <div>
                        <strong>To:</strong> {formatDate(bookingDates[1].toISOString())}
                      </div>
                    </div>
                    <div className={styles.bookingTotal}>
                      <div>
                        <strong>Total:</strong> {formatCurrency(totalPrice)}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleBooking}
                    disabled={processingBooking}
                    className={styles.bookButton}
                  >
                    {processingBooking ? 'Processing...' : 'Book Now'}
                  </button>
                </div>
              )}
              
              {showLoginPrompt && (
                <div className={styles.loginPrompt}>
                  <p>You need to be logged in to book this item.</p>
                  <div className={styles.loginButtons}>
                    <button 
                      onClick={() => router.push(`/login?callback=/rentals/${item.id}`)}
                      className={styles.loginButton}
                    >
                      Log In
                    </button>
                    <button 
                      onClick={() => setShowLoginPrompt(false)}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 