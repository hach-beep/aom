# The Bridal Bloom — Full-Stack Salon Web Application

A modern React 19 + TypeScript single-page application integrated with **Firebase Firestore**, tailored for **The Bridal Bloom** luxury bridal beauty, hair, makeup, and grooming salon.

## Core Features

### 1. Firebase Firestore Real-Time Integration
- Provisioned cloud database with real-time listeners (`onSnapshot`) for `appointments`, `services`, and `team` collections.
- Immediate cross-device sync: any updates made by workers or employers reflect on the customer-facing website instantly.

### 2. Worker Appointment Dashboard (`#worker-dashboard`)
- **Live Up-To-Date Appointment Feed**: Filter by status (*All*, *Pending*, *Confirmed*, *Completed*, *Cancelled*) or date (*Today*, *Upcoming*, *All*).
- **Manual Booking Creator**: Modal to register walk-ins or phone appointments with client name, phone, service, date, time slot, assigned staff artisan, and status.
- **Appointment Management**:
  - One-click confirmation and completion.
  - Reassign staff/artisan directly from the card.
  - Delete appointments with confirmation safety check.
  - 1-click WhatsApp customer chat pre-populated with appointment details.
  - Metric counters for Total, Pending, and Today's bookings.

### 3. Customer Booking Confirmation Modal
- When a customer submits an appointment request on the home page, an elegant bridal-themed confirmation card appears instantly with:
  - Unique Booking Reference ID
  - Service, Date, Time, and Contact breakdown
  - Direct WhatsApp connection button
  - Copy summary button
  - Reassuring confirmation status badge

### 4. Employer Website Control Center (`#admin`)
- **Service & Price Management**:
  - Employer can edit any existing service's **price**, name, description, and category with live website updates.
  - Add new menu services with custom pricing and inclusions.
  - Delete retired menu items.
- **Team Artisan Management**:
  - Add and edit staff profiles, roles, and bios.
  - Delete old or inactive roster entries.
- **Default Presets**: One-click restore button for testing or starting fresh.

### 5. Client Public Experience
- **Home**: Luxury blush-and-rose visual design, hero with custom CSS portrait art and flower accents, service cards, brand story, and interactive booking form.
- **Services Menu & Pricing (`#services`)**: Searchable and filterable service menu with direct "Reserve Service" buttons.
- **Artisans Showcase (`#team`)**: Certified beauty team profiles with direct appointment booking shortcuts.
