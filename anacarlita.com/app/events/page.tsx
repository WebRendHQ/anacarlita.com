'use client';

import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { firestore } from '../../../app/utils/firebase';
import { Event } from '../types';
import EventCalendar from '../components/EventCalendar';
import styles from './events.module.scss';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const notificationEmail = process.env.NOTIFICATION_EMAIL || '';

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsCollection = collection(firestore, 'events');
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsList = eventsSnapshot.docs.map(doc => {
          const data = doc.data() as Omit<Event, 'id'>;
          return {
            id: doc.id,
            ...data
          };
        });

        setEvents(eventsList);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Function to add a new event
  const handleAddEvent = async (event: Event) => {
    try {
      const eventsCollection = collection(firestore, 'events');
      const { id, ...eventData } = event;
      const docRef = await addDoc(eventsCollection, eventData);
      
      // Add the new event to the state with the Firestore ID
      setEvents(prevEvents => [
        ...prevEvents,
        { ...event, id: docRef.id }
      ]);
      
      return docRef.id;
    } catch (err) {
      console.error('Error adding event:', err);
      throw err;
    }
  };

  return (
    <div className={styles.eventsPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Events Calendar</h1>
          <p>View upcoming events or add a new event to our calendar</p>
        </div>
        
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading events...</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <div className={styles.calendarWrapper}>
            <EventCalendar 
              events={events} 
              notificationEmail={notificationEmail}
              onAddEvent={handleAddEvent}
            />
          </div>
        )}
        
        <div className={styles.infoSection}>
          <h2>About Our Events</h2>
          <p>
            AnaCarLita hosts and caters a variety of events throughout the year. 
            From wedding receptions to corporate gatherings, our team ensures every 
            detail is perfect for your special occasion.
          </p>
          <p>
            Browse our calendar to see upcoming events or add your own event to request
            our catering and event planning services. Click on any date to see what's
            happening or to schedule a new event.
          </p>
          <div className={styles.contactInfo}>
            <h3>Need More Information?</h3>
            <p>
              For detailed information about our event services or to discuss your 
              specific requirements, please contact our events team:
            </p>
            <ul>
              <li>
                <strong>Phone:</strong> (123) 456-7890
              </li>
              <li>
                <strong>Email:</strong> <a href="mailto:events@anacarlita.com">events@anacarlita.com</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 