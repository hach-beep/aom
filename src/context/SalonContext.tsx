import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { SalonService, TeamMember, Appointment, PageView, AppointmentStatus } from '../types';
import { INITIAL_SERVICES, INITIAL_TEAM } from '../data/defaults';

interface SalonContextType {
  services: SalonService[];
  team: TeamMember[];
  appointments: Appointment[];
  loading: boolean;
  currentPage: PageView;
  selectedServiceForBooking: string | null;
  lastConfirmedBooking: Appointment | null;
  showConfirmationModal: boolean;
  setCurrentPage: (page: PageView) => void;
  setSelectedServiceForBooking: (serviceName: string | null) => void;
  setShowConfirmationModal: (show: boolean) => void;
  setLastConfirmedBooking: (appt: Appointment | null) => void;
  // Service CRUD
  addService: (name: string, price: string, description: string, category?: string) => Promise<void>;
  updateService: (id: string, name: string, price: string, description: string, category?: string) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  // Team Member CRUD
  addTeamMember: (name: string, role: string, bio: string) => Promise<void>;
  updateTeamMember: (id: string, name: string, role: string, bio: string) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
  // Appointment CRUD
  bookAppointment: (data: {
    name: string;
    phone: string;
    service: string;
    date: string;
    time?: string;
    notes?: string;
    assignedStaff?: string;
    bookedBy?: 'customer' | 'staff';
  }) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  updateAppointmentDetails: (id: string, updates: Partial<Appointment>) => Promise<void>;
  deleteAppointment: (id: string) => Promise<void>;
  resetToDefaults: () => Promise<void>;
}

const SalonContext = createContext<SalonContextType | undefined>(undefined);

export const SalonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPageState] = useState<PageView>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'services') return 'services';
      if (hash === 'team') return 'team';
      if (hash === 'worker-dashboard' || hash === 'dashboard' || hash === 'worker') return 'worker-dashboard';
      if (hash === 'admin') return 'admin';
    }
    return 'home';
  });

  const [services, setServices] = useState<SalonService[]>(INITIAL_SERVICES);
  const [team, setTeam] = useState<TeamMember[]>(INITIAL_TEAM);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | null>(null);
  const [lastConfirmedBooking, setLastConfirmedBooking] = useState<Appointment | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'services') setCurrentPageState('services');
      else if (hash === 'team') setCurrentPageState('team');
      else if (hash === 'worker-dashboard' || hash === 'dashboard' || hash === 'worker') {
        setCurrentPageState('worker-dashboard');
      } else if (hash === 'admin') {
        setCurrentPageState('admin');
      } else if (hash === 'home' || hash === '' || hash === 'about' || hash === 'contact') {
        setCurrentPageState('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setCurrentPage = (page: PageView) => {
    setCurrentPageState(page);
    window.location.hash = page === 'home' ? '' : page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Seed default items to Firestore if empty
  const seedFirestoreIfEmpty = async () => {
    try {
      const srvSnap = await getDocs(collection(db, 'services'));
      if (srvSnap.empty) {
        for (const s of INITIAL_SERVICES) {
          await setDoc(doc(db, 'services', s.id), s);
        }
      }

      const teamSnap = await getDocs(collection(db, 'team'));
      if (teamSnap.empty) {
        for (const m of INITIAL_TEAM) {
          await setDoc(doc(db, 'team', m.id), m);
        }
      }
    } catch (err) {
      console.warn('Initial Firestore seeding notice:', err);
    }
  };

  // Real-time Firestore Listeners
  useEffect(() => {
    seedFirestoreIfEmpty();

    // 1. Services Listener
    const servicesRef = collection(db, 'services');
    const unsubServices = onSnapshot(
      query(servicesRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: SalonService[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...d.data() } as SalonService);
          });
          setServices(loaded);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching services from Firestore:', error);
        handleFirestoreError(error, OperationType.LIST, 'services');
      }
    );

    // 2. Team Listener
    const teamRef = collection(db, 'team');
    const unsubTeam = onSnapshot(
      query(teamRef, orderBy('createdAt', 'asc')),
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: TeamMember[] = [];
          snapshot.forEach((d) => {
            loaded.push({ id: d.id, ...d.data() } as TeamMember);
          });
          setTeam(loaded);
        }
      },
      (error) => {
        console.error('Error fetching team from Firestore:', error);
        handleFirestoreError(error, OperationType.LIST, 'team');
      }
    );

    // 3. Appointments Listener
    const apptsRef = collection(db, 'appointments');
    const unsubAppts = onSnapshot(
      query(apptsRef, orderBy('createdAt', 'desc')),
      (snapshot) => {
        const loaded: Appointment[] = [];
        snapshot.forEach((d) => {
          loaded.push({ id: d.id, ...d.data() } as Appointment);
        });
        setAppointments(loaded);
      },
      (error) => {
        console.error('Error fetching appointments from Firestore:', error);
        handleFirestoreError(error, OperationType.LIST, 'appointments');
      }
    );

    return () => {
      unsubServices();
      unsubTeam();
      unsubAppts();
    };
  }, []);

  // Services Management (Owner/Employer control)
  const addService = async (name: string, price: string, description: string, category = 'General Service') => {
    const id = 'srv-' + Date.now();
    const newService: SalonService = {
      id,
      name: name.trim(),
      price: price.trim(),
      description: description.trim(),
      category: category.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistic local update
    setServices((prev) => [newService, ...prev.filter((s) => s.id !== id)]);

    try {
      await setDoc(doc(db, 'services', id), newService);
    } catch (err) {
      console.error('Firestore addService error:', err);
      handleFirestoreError(err, OperationType.CREATE, `services/${id}`);
    }
  };

  const updateService = async (id: string, name: string, price: string, description: string, category?: string) => {
    // Optimistic local update
    setServices((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              name: name.trim(),
              price: price.trim(),
              description: description.trim(),
              category: category?.trim() || s.category,
              updatedAt: Date.now(),
            }
          : s
      )
    );

    try {
      await updateDoc(doc(db, 'services', id), {
        name: name.trim(),
        price: price.trim(),
        description: description.trim(),
        category: category?.trim() || 'General Service',
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Firestore updateService error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `services/${id}`);
    }
  };

  const deleteService = async (id: string) => {
    // Optimistic local update
    setServices((prev) => prev.filter((s) => s.id !== id));

    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (err) {
      console.error('Firestore deleteService error:', err);
      handleFirestoreError(err, OperationType.DELETE, `services/${id}`);
    }
  };

  // Team Management
  const addTeamMember = async (name: string, role: string, bio: string) => {
    const id = 'tm-' + Date.now();
    const newMember: TeamMember = {
      id,
      name: name.trim(),
      role: role.trim(),
      bio: bio.trim(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistic local update
    setTeam((prev) => [...prev, newMember]);

    try {
      await setDoc(doc(db, 'team', id), newMember);
    } catch (err) {
      console.error('Firestore addTeamMember error:', err);
      handleFirestoreError(err, OperationType.CREATE, `team/${id}`);
    }
  };

  const updateTeamMember = async (id: string, name: string, role: string, bio: string) => {
    // Optimistic local update
    setTeam((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              name: name.trim(),
              role: role.trim(),
              bio: bio.trim(),
              updatedAt: Date.now(),
            }
          : m
      )
    );

    try {
      await updateDoc(doc(db, 'team', id), {
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Firestore updateTeamMember error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `team/${id}`);
    }
  };

  const deleteTeamMember = async (id: string) => {
    // Optimistic local update
    setTeam((prev) => prev.filter((m) => m.id !== id));

    try {
      await deleteDoc(doc(db, 'team', id));
    } catch (err) {
      console.error('Firestore deleteTeamMember error:', err);
      handleFirestoreError(err, OperationType.DELETE, `team/${id}`);
    }
  };

  // Appointment Operations
  const bookAppointment = async (data: {
    name: string;
    phone: string;
    service: string;
    date: string;
    time?: string;
    notes?: string;
    assignedStaff?: string;
    bookedBy?: 'customer' | 'staff';
  }): Promise<Appointment> => {
    const id = 'appt-' + Date.now();
    const appointmentRecord: Appointment = {
      id,
      name: data.name.trim(),
      phone: data.phone.trim(),
      service: data.service.trim(),
      date: data.date.trim() || new Date().toISOString().split('T')[0],
      time: data.time?.trim() || '11:00 AM',
      assignedStaff: data.assignedStaff?.trim() || 'Any Senior Stylist',
      status: 'Pending',
      notes: data.notes?.trim() || '',
      bookedBy: data.bookedBy || 'customer',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Optimistic local update
    setAppointments((prev) => [appointmentRecord, ...prev]);
    setLastConfirmedBooking(appointmentRecord);
    setShowConfirmationModal(true);

    try {
      await setDoc(doc(db, 'appointments', id), appointmentRecord);
      return appointmentRecord;
    } catch (err) {
      console.error('Firestore bookAppointment error:', err);
      handleFirestoreError(err, OperationType.CREATE, `appointments/${id}`);
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    // Optimistic local update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, updatedAt: Date.now() } : a))
    );

    try {
      await updateDoc(doc(db, 'appointments', id), {
        status,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Firestore updateAppointmentStatus error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const updateAppointmentDetails = async (id: string, updates: Partial<Appointment>) => {
    // Optimistic local update
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates, updatedAt: Date.now() } : a))
    );

    try {
      await updateDoc(doc(db, 'appointments', id), {
        ...updates,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.error('Firestore updateAppointmentDetails error:', err);
      handleFirestoreError(err, OperationType.UPDATE, `appointments/${id}`);
    }
  };

  const deleteAppointment = async (id: string) => {
    // Optimistic local update
    setAppointments((prev) => prev.filter((a) => a.id !== id));

    try {
      await deleteDoc(doc(db, 'appointments', id));
    } catch (err) {
      console.error('Firestore deleteAppointment error:', err);
      handleFirestoreError(err, OperationType.DELETE, `appointments/${id}`);
    }
  };

  const resetToDefaults = async () => {
    setServices(INITIAL_SERVICES);
    setTeam(INITIAL_TEAM);
    try {
      for (const s of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', s.id), s);
      }
      for (const m of INITIAL_TEAM) {
        await setDoc(doc(db, 'team', m.id), m);
      }
    } catch (err) {
      console.error('Reset error:', err);
    }
  };

  return (
    <SalonContext.Provider
      value={{
        services,
        team,
        appointments,
        loading,
        currentPage,
        selectedServiceForBooking,
        lastConfirmedBooking,
        showConfirmationModal,
        setCurrentPage,
        setSelectedServiceForBooking,
        setShowConfirmationModal,
        setLastConfirmedBooking,
        addService,
        updateService,
        deleteService,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        bookAppointment,
        updateAppointmentStatus,
        updateAppointmentDetails,
        deleteAppointment,
        resetToDefaults,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
