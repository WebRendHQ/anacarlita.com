# AnaCarLita Catering & Events

A full-featured catering and event planning website built with Next.js. The site provides information about services, event planning, and includes a rental marketplace for event equipment.

## Features

- Beautiful responsive design with warm white color theme
- Services and event information pages
- Interactive event calendar with email notifications
- Rental marketplace with Stripe integration
- User authentication with Firebase
- Equipment listing creation for authenticated users
- Booking system with calendar selection and Stripe checkout

## Tech Stack

- **Frontend**: Next.js, React, SCSS
- **Authentication**: Firebase Authentication
- **Database**: Firestore
- **Storage**: Firebase Storage
- **Payments**: Stripe
- **Email**: Nodemailer
- **Form Validation**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Firebase account
- Stripe account
- Email account for notifications

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/anacarlita.com.git
   cd anacarlita.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Firebase, Stripe, and email credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app directory
  - `/components` - Reusable UI components
  - `/context` - React context providers
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
  - Various page routes
- `/styles` - SCSS stylesheets
  - `/components` - Component-specific styles
  - `/pages` - Page-specific styles
- `/public` - Static assets

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
FIREBASE_APP_ID=your_firebase_app_id

# Stripe Configuration
STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email Notification
NOTIFICATION_EMAIL=notifications@example.com
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password

# Application Settings
NEXT_PUBLIC_URL=http://localhost:3000
```

## Deployment

The site can be deployed to platforms like Vercel or Netlify:

```bash
# Build for production
npm run build

# Start the production server
npm start
```

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Set up Firestore Database
4. Create necessary Firebase collections:
   - users
   - rentalItems
   - bookings
   - events

## License

This project is licensed under the MIT License - see the LICENSE file for details.
