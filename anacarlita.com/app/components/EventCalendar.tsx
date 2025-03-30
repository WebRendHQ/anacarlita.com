'use client';

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Event } from '../types';
import { formatDate } from '../../../app/utils/format';
import { sendEventNotification } from '../../../app/utils/email';
import styles from './EventCalendar.module.scss';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface EventCalendarProps {
  events?: Event[];
  notificationEmail?: string;
  onAddEvent?: (event: Event) => void;
  readOnly?: boolean;
}

const EventCalendar: React.FC<EventCalendarProps> = ({
  events = [],
  notificationEmail,
  onAddEvent,
  readOnly = false,
}) => {
  const [date, setDate] = useState<Value>(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventContactEmail, setEventContactEmail] = useState('');
  const [eventContactPhone, setEventContactPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Function to check if a date has events
  const hasEvents = (date: Date) => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Function to get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Handle date click
  const handleDateClick = (value: Value) => {
    if (Array.isArray(value) || !value || readOnly) return;
    
    setDate(value);
    setShowEventForm(true);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!eventTitle) {
      setFormError('Event title is required');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    
    try {
      // Create event object
      const selectedDate = date instanceof Date ? date : new Date();
      const newEvent: Event = {
        id: `event_${Date.now()}`,
        title: eventTitle,
        description: eventDescription,
        date: selectedDate.toISOString(),
        time: eventTime,
        location: eventLocation,
        contactEmail: eventContactEmail,
        contactPhone: eventContactPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Send notification if email is provided
      if (notificationEmail) {
        await sendEventNotification(newEvent);
      }
      
      // Add event if callback is provided
      if (onAddEvent) {
        onAddEvent(newEvent);
      }
      
      // Reset form
      setEventTitle('');
      setEventDescription('');
      setEventTime('');
      setEventLocation('');
      setEventContactEmail('');
      setEventContactPhone('');
      setShowEventForm(false);
      setFormSuccess('Event added successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    } catch (error) {
      console.error('Error adding event:', error);
      setFormError('Failed to add event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tile content for calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return null;
    
    const hasEvent = hasEvents(date);
    
    return hasEvent ? (
      <div className={styles.eventMarker}></div>
    ) : null;
  };

  // Tile class name for calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== 'month') return '';
    
    return hasEvents(date) ? styles.hasEvent : '';
  };

  return (
    <div className={styles.eventCalendar}>
      <div className={styles.calendarContainer}>
        <Calendar
          onChange={handleDateClick}
          value={date}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className={styles.calendar}
          nextLabel=">"
          prevLabel="<"
          next2Label={null}
          prev2Label={null}
        />
      </div>
      
      {!readOnly && showEventForm && (
        <div className={styles.eventForm}>
          <h3>Add New Event</h3>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="eventTitle">Event Title*</label>
              <input
                type="text"
                id="eventTitle"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title"
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="eventDescription">Description</label>
              <textarea
                id="eventDescription"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Enter event description"
                rows={3}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="eventDate">Date</label>
                <input
                  type="text"
                  id="eventDate"
                  value={date instanceof Date ? formatDate(date.toISOString()) : ''}
                  readOnly
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="eventTime">Time</label>
                <input
                  type="time"
                  id="eventTime"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="eventLocation">Location</label>
              <input
                type="text"
                id="eventLocation"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Enter event location"
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="eventContactEmail">Contact Email</label>
                <input
                  type="email"
                  id="eventContactEmail"
                  value={eventContactEmail}
                  onChange={(e) => setEventContactEmail(e.target.value)}
                  placeholder="Enter contact email"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="eventContactPhone">Contact Phone</label>
                <input
                  type="tel"
                  id="eventContactPhone"
                  value={eventContactPhone}
                  onChange={(e) => setEventContactPhone(e.target.value)}
                  placeholder="Enter contact phone"
                />
              </div>
            </div>
            
            {formError && <div className={styles.formError}>{formError}</div>}
            
            <div className={styles.formButtons}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => setShowEventForm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Event'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {formSuccess && <div className={styles.formSuccess}>{formSuccess}</div>}
      
      {date instanceof Date && !showEventForm && (
        <div className={styles.eventList}>
          <h3>Events on {formatDate(date.toISOString())}</h3>
          
          {getEventsForDate(date).length > 0 ? (
            <ul>
              {getEventsForDate(date).map((event) => (
                <li key={event.id} className={styles.eventItem}>
                  <div className={styles.eventItemHeader}>
                    <h4>{event.title}</h4>
                    {event.time && <span>{event.time}</span>}
                  </div>
                  
                  {event.description && <p>{event.description}</p>}
                  
                  {event.location && (
                    <div className={styles.eventItemDetail}>
                      <strong>Location:</strong> {event.location}
                    </div>
                  )}
                  
                  {(event.contactEmail || event.contactPhone) && (
                    <div className={styles.eventItemDetail}>
                      <strong>Contact:</strong>{' '}
                      {event.contactEmail && (
                        <a href={`mailto:${event.contactEmail}`}>
                          {event.contactEmail}
                        </a>
                      )}
                      {event.contactEmail && event.contactPhone && ' | '}
                      {event.contactPhone && (
                        <a href={`tel:${event.contactPhone}`}>
                          {event.contactPhone}
                        </a>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.noEvents}>No events scheduled for this date.</p>
          )}
          
          {!readOnly && (
            <button
              className={styles.addEventButton}
              onClick={() => setShowEventForm(true)}
            >
              Add Event
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCalendar; 