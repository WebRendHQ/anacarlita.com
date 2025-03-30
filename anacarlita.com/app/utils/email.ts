import nodemailer from 'nodemailer';
import { Event, Booking, ContactFormData, EventRequestFormData } from '../../../anacarlita.com/app/types';

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE as string,
    auth: {
      user: process.env.EMAIL_USERNAME as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });
};

/**
 * Send an email notification for a new event
 */
export const sendEventNotification = async (event: Event): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Event: ${event.title}`,
      html: `
        <h1>New Event Added to Calendar</h1>
        <p><strong>Title:</strong> ${event.title}</p>
        <p><strong>Date:</strong> ${event.date}</p>
        ${event.time ? `<p><strong>Time:</strong> ${event.time}</p>` : ''}
        ${event.description ? `<p><strong>Description:</strong> ${event.description}</p>` : ''}
        ${event.location ? `<p><strong>Location:</strong> ${event.location}</p>` : ''}
        ${event.organizer ? `<p><strong>Organizer:</strong> ${event.organizer}</p>` : ''}
        ${event.contactEmail ? `<p><strong>Contact Email:</strong> ${event.contactEmail}</p>` : ''}
        ${event.contactPhone ? `<p><strong>Contact Phone:</strong> ${event.contactPhone}</p>` : ''}
      `,
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending event notification email:', error);
    throw error;
  }
};

/**
 * Send a booking confirmation email
 */
export const sendBookingConfirmation = async (booking: Booking, recipientEmail: string): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: recipientEmail,
      subject: 'Booking Confirmation',
      html: `
        <h1>Your Booking is Confirmed!</h1>
        <p>Thank you for your booking with AnaCarLita Events & Rentals.</p>
        <p><strong>Booking ID:</strong> ${booking.id}</p>
        <p><strong>Start Date:</strong> ${booking.startDate}</p>
        <p><strong>End Date:</strong> ${booking.endDate}</p>
        <p><strong>Total Price:</strong> $${booking.totalPrice.toFixed(2)}</p>
        ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
};

/**
 * Send contact form notification
 */
export const sendContactFormNotification = async (formData: ContactFormData): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Contact Form: ${formData.subject}`,
      html: `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message}</p>
      `,
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending contact form notification email:', error);
    throw error;
  }
};

/**
 * Send event request notification
 */
export const sendEventRequestNotification = async (formData: EventRequestFormData): Promise<void> => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Event Request: ${formData.eventType}`,
      html: `
        <h1>New Event Request</h1>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Event Type:</strong> ${formData.eventType}</p>
        <p><strong>Event Date:</strong> ${formData.eventDate}</p>
        <p><strong>Event Time:</strong> ${formData.eventTime}</p>
        <p><strong>Guest Count:</strong> ${formData.guestCount}</p>
        ${formData.location ? `<p><strong>Location:</strong> ${formData.location}</p>` : ''}
        ${formData.additionalNotes ? `<p><strong>Additional Notes:</strong> ${formData.additionalNotes}</p>` : ''}
      `,
    };
    
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending event request notification email:', error);
    throw error;
  }
}; 