// User types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

// Rental item types
export interface RentalItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  pricePerDay: number;
  images: string[];
  category: string;
  location: string;
  availability: {
    start: string;
    end: string;
    excludedDates?: string[];
  };
  features: string[];
  status: 'available' | 'unavailable' | 'pending';
  stripeProductId: string;
  createdAt: string;
  updatedAt: string;
}

// Booking types
export interface Booking {
  id: string;
  rentalItemId: string;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  stripePaymentIntentId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Event types (for calendar)
export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  location?: string;
  organizer?: string;
  contactEmail?: string;
  contactPhone?: string;
  maxAttendees?: number;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: 'booking' | 'event' | 'system';
  relatedId?: string;
  createdAt: string;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject: string;
}

export interface EventRequestFormData {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  location?: string;
  additionalNotes?: string;
}

export interface RentalListingFormData {
  title: string;
  description: string;
  pricePerDay: number;
  images: File[];
  category: string;
  location: string;
  availabilityStart: string;
  availabilityEnd: string;
  features: string[];
} 