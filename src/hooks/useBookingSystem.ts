import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface GymClass {
  id: string;
  name: string;
  instructor: string;
  time: string;
  duration: string;
  spotsLeft: number;
  totalSpots: number;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  price: number;
  date: string;
  equipment?: string[];
}

export interface Booking {
  id: string;
  userId: string;
  classId: string;
  className: string;
  instructor: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  bookedAt: Date;
  price: number;
}

const DEMO_CLASSES: GymClass[] = [
  {
    id: '1',
    name: 'Morning Yoga',
    instructor: 'Sarah Johnson',
    time: '7:00 AM',
    duration: '60 min',
    spotsLeft: 8,
    totalSpots: 15,
    category: 'Yoga',
    level: 'Beginner',
    description: 'Start your day with gentle yoga flow and mindfulness',
    price: 25,
    date: new Date().toISOString().split('T')[0],
    equipment: ['Yoga Mat', 'Blocks', 'Straps']
  },
  {
    id: '2',
    name: 'HIIT Blast',
    instructor: 'Mike Chen',
    time: '9:00 AM',
    duration: '45 min',
    spotsLeft: 3,
    totalSpots: 20,
    category: 'Cardio',
    level: 'Advanced',
    description: 'High-intensity interval training for maximum calorie burn',
    price: 30,
    date: new Date().toISOString().split('T')[0],
    equipment: ['Kettlebells', 'Battle Ropes', 'Medicine Balls']
  },
  {
    id: '3',
    name: 'Zumba Dance',
    instructor: 'Maria Garcia',
    time: '11:00 AM',
    duration: '50 min',
    spotsLeft: 12,
    totalSpots: 25,
    category: 'Dance',
    level: 'Beginner',
    description: 'Fun dance workout with Latin rhythms',
    price: 20,
    date: new Date().toISOString().split('T')[0],
    equipment: ['None required']
  },
  {
    id: '4',
    name: 'Spin Class',
    instructor: 'James Wilson',
    time: '5:00 PM',
    duration: '45 min',
    spotsLeft: 5,
    totalSpots: 18,
    category: 'Cardio',
    level: 'Intermediate',
    description: 'Indoor cycling with energetic music and coaching',
    price: 28,
    date: new Date().toISOString().split('T')[0],
    equipment: ['Spin Bike', 'Towel', 'Water Bottle']
  },
  {
    id: '5',
    name: 'Strength Training',
    instructor: 'David Rodriguez',
    time: '6:00 PM',
    duration: '60 min',
    spotsLeft: 10,
    totalSpots: 15,
    category: 'Strength',
    level: 'Intermediate',
    description: 'Build muscle and strength with guided weight training',
    price: 35,
    date: new Date().toISOString().split('T')[0],
    equipment: ['Barbells', 'Dumbbells', 'Resistance Bands']
  },
  {
    id: '6',
    name: 'Pilates Core',
    instructor: 'Emma Thompson',
    time: '8:00 AM',
    duration: '45 min',
    spotsLeft: 6,
    totalSpots: 12,
    category: 'Pilates',
    level: 'Intermediate',
    description: 'Core-focused Pilates for stability and strength',
    price: 32,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    equipment: ['Pilates Mat', 'Resistance Bands', 'Pilates Ball']
  }
];

export const useBookingSystem = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<GymClass[]>(DEMO_CLASSES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  // Initialize with demo bookings
  useEffect(() => {
    if (user) {
      const demoBookings: Booking[] = [
        {
          id: 'b1',
          userId: user.id,
          classId: '1',
          className: 'Morning Yoga',
          instructor: 'Sarah Johnson',
          date: new Date().toISOString().split('T')[0],
          time: '7:00 AM',
          status: 'confirmed',
          bookedAt: new Date(),
          price: 25
        }
      ];
      setBookings(demoBookings);
    }
  }, [user]);

  const bookClass = useCallback(async (classId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    const classToBook = classes.find(c => c.id === classId);
    if (!classToBook) return { success: false, error: 'Class not found' };

    if (classToBook.spotsLeft <= 0) {
      return { success: false, error: 'Class is full' };
    }

    // Check if already booked
    const existingBooking = bookings.find(b => 
      b.classId === classId && 
      b.userId === user.id && 
      b.status === 'confirmed'
    );

    if (existingBooking) {
      return { success: false, error: 'Already booked this class' };
    }

    setIsBooking(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newBooking: Booking = {
        id: Date.now().toString(),
        userId: user.id,
        classId: classToBook.id,
        className: classToBook.name,
        instructor: classToBook.instructor,
        date: classToBook.date,
        time: classToBook.time,
        status: 'confirmed',
        bookedAt: new Date(),
        price: classToBook.price
      };

      setBookings(prev => [...prev, newBooking]);
      
      // Update class spots
      setClasses(prev => prev.map(c => 
        c.id === classId 
          ? { ...c, spotsLeft: c.spotsLeft - 1 }
          : c
      ));

      return { success: true, booking: newBooking };
    } catch (error) {
      return { success: false, error: 'Failed to book class' };
    } finally {
      setIsBooking(false);
    }
  }, [user, classes, bookings]);

  const cancelBooking = useCallback(async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setBookings(prev => prev.map(b => 
        b.id === bookingId 
          ? { ...b, status: 'cancelled' as const }
          : b
      ));

      // Restore class spot
      setClasses(prev => prev.map(c => 
        c.id === booking.classId 
          ? { ...c, spotsLeft: c.spotsLeft + 1 }
          : c
      ));

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to cancel booking' };
    }
  }, [bookings]);

  const getClassesForDate = useCallback((date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return classes.filter(c => c.date === dateString);
  }, [classes]);

  const getUserBookings = useCallback((status?: 'confirmed' | 'cancelled' | 'completed') => {
    if (!user) return [];
    
    let userBookings = bookings.filter(b => b.userId === user.id);
    
    if (status) {
      userBookings = userBookings.filter(b => b.status === status);
    }
    
    return userBookings.sort((a, b) => 
      new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime()
    );
  }, [user, bookings]);

  const getUpcomingBookings = useCallback(() => {
    if (!user) return [];
    
    const today = new Date().toISOString().split('T')[0];
    
    return bookings
      .filter(b => 
        b.userId === user.id && 
        b.status === 'confirmed' && 
        b.date >= today
      )
      .sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [user, bookings]);

  const getBookingStats = useCallback(() => {
    if (!user) return {
      totalBookings: 0,
      confirmedBookings: 0,
      cancelledBookings: 0,
      completedBookings: 0,
      totalSpent: 0,
      favoriteInstructor: 'None',
      favoriteCategory: 'None'
    };

    const userBookings = bookings.filter(b => b.userId === user.id);
    
    const totalBookings = userBookings.length;
    const confirmedBookings = userBookings.filter(b => b.status === 'confirmed').length;
    const cancelledBookings = userBookings.filter(b => b.status === 'cancelled').length;
    const completedBookings = userBookings.filter(b => b.status === 'completed').length;
    const totalSpent = userBookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, b) => sum + b.price, 0);

    // Calculate favorite instructor
    const instructorCount: Record<string, number> = {};
    userBookings.forEach(b => {
      if (b.status !== 'cancelled') {
        instructorCount[b.instructor] = (instructorCount[b.instructor] || 0) + 1;
      }
    });
    const favoriteInstructor = Object.entries(instructorCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    // Calculate favorite category
    const categoryCount: Record<string, number> = {};
    userBookings.forEach(b => {
      if (b.status !== 'cancelled') {
        const classInfo = classes.find(c => c.id === b.classId);
        if (classInfo) {
          categoryCount[classInfo.category] = (categoryCount[classInfo.category] || 0) + 1;
        }
      }
    });
    const favoriteCategory = Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'None';

    return {
      totalBookings,
      confirmedBookings,
      cancelledBookings,
      completedBookings,
      totalSpent,
      favoriteInstructor,
      favoriteCategory
    };
  }, [user, bookings, classes]);

  // Simulate classes filling up over time
  useEffect(() => {
    const interval = setInterval(() => {
      setClasses(prev => prev.map(c => {
        if (c.spotsLeft > 0 && Math.random() < 0.1) { // 10% chance per minute
          return { ...c, spotsLeft: Math.max(0, c.spotsLeft - 1) };
        }
        return c;
      }));
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, []);

  return {
    classes,
    bookings,
    isBooking,
    bookClass,
    cancelBooking,
    getClassesForDate,
    getUserBookings,
    getUpcomingBookings,
    getBookingStats
  };
};