export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time?: string;
  assignedStaff?: string;
  status: AppointmentStatus;
  notes?: string;
  bookedBy: 'customer' | 'staff';
  createdAt: number;
  updatedAt?: number;
}

export interface SalonService {
  id: string;
  name: string;
  price: string;
  description: string;
  category?: string;
  createdAt: number;
  updatedAt?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  createdAt: number;
  updatedAt?: number;
}

export type PageView = 'home' | 'services' | 'team' | 'worker-dashboard' | 'admin';
