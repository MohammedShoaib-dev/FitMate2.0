import { useState, useEffect, useCallback } from 'react';

export interface CheckInRecord {
  id: string;
  userId: string;
  userName: string;
  checkInTime: Date;
  checkOutTime?: Date;
  isActive: boolean;
}

export interface CrowdStats {
  currentCount: number;
  maxCapacity: number;
  percentage: number;
  status: 'low' | 'moderate' | 'high';
  peakHours: { hour: number; count: number }[];
  averageStayTime: number; // in minutes
}

const MAX_CAPACITY = 50;
const DEMO_USERS = {
  'USER001': 'John Doe',
  'USER002': 'Jane Smith',
  'USER003': 'Mike Johnson',
  'USER004': 'Sarah Wilson',
  'USER005': 'Emily Brown',
  'USER006': 'David Lee',
  'USER007': 'Lisa Garcia',
  'USER008': 'Tom Anderson'
};

export const useCheckInSystem = () => {
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [crowdStats, setCrowdStats] = useState<CrowdStats>({
    currentCount: 0,
    maxCapacity: MAX_CAPACITY,
    percentage: 0,
    status: 'low',
    peakHours: [],
    averageStayTime: 0
  });

  // Initialize with some demo data
  useEffect(() => {
    const initializeDemoData = () => {
      const now = new Date();
      const demoCheckIns: CheckInRecord[] = [
        {
          id: '1',
          userId: 'USER001',
          userName: 'John Doe',
          checkInTime: new Date(now.getTime() - 45 * 60000), // 45 minutes ago
          isActive: true
        },
        {
          id: '2',
          userId: 'USER002',
          userName: 'Jane Smith',
          checkInTime: new Date(now.getTime() - 30 * 60000), // 30 minutes ago
          isActive: true
        },
        {
          id: '3',
          userId: 'USER003',
          userName: 'Mike Johnson',
          checkInTime: new Date(now.getTime() - 120 * 60000), // 2 hours ago
          checkOutTime: new Date(now.getTime() - 15 * 60000), // checked out 15 minutes ago
          isActive: false
        }
      ];

      setCheckIns(demoCheckIns);
    };

    initializeDemoData();
  }, []);

  // Update crowd stats whenever check-ins change
  useEffect(() => {
    const activeCheckIns = checkIns.filter(record => record.isActive);
    const currentCount = activeCheckIns.length;
    const percentage = Math.round((currentCount / MAX_CAPACITY) * 100);
    
    let status: 'low' | 'moderate' | 'high' = 'low';
    if (percentage >= 80) status = 'high';
    else if (percentage >= 50) status = 'moderate';

    // Calculate average stay time
    const completedSessions = checkIns.filter(record => !record.isActive && record.checkOutTime);
    const averageStayTime = completedSessions.length > 0
      ? completedSessions.reduce((acc, record) => {
          const stayTime = (record.checkOutTime!.getTime() - record.checkInTime.getTime()) / (1000 * 60);
          return acc + stayTime;
        }, 0) / completedSessions.length
      : 0;

    // Generate peak hours data (mock data for demo)
    const peakHours = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      count: Math.floor(Math.random() * MAX_CAPACITY * 0.8) + (hour >= 17 && hour <= 20 ? 20 : 0)
    }));

    setCrowdStats({
      currentCount,
      maxCapacity: MAX_CAPACITY,
      percentage,
      status,
      peakHours,
      averageStayTime: Math.round(averageStayTime)
    });
  }, [checkIns]);

  const processQRScan = useCallback((qrData: string) => {
    console.log('Processing QR scan:', qrData);
    console.log('Current checkIns:', checkIns);
    
    try {
      // Parse QR data format: FITMATE_CHECKIN:USER_ID:TIMESTAMP
      const [prefix, userId, timestamp] = qrData.split(':');
      
      console.log('Parsed QR data:', { prefix, userId, timestamp });
      
      if (prefix !== 'FITMATE_CHECKIN') {
        throw new Error('Invalid QR code format');
      }

      const userName = DEMO_USERS[userId as keyof typeof DEMO_USERS] || `User ${userId}`;
      console.log('User name resolved:', userName);
      
      // Check if user is already checked in
      const existingCheckIn = checkIns.find(record => 
        record.userId === userId && record.isActive
      );

      console.log('Existing check-in found:', existingCheckIn);

      if (existingCheckIn) {
        // Check out the user
        setCheckIns(prev => {
          const updated = prev.map(record => 
            record.id === existingCheckIn.id
              ? { ...record, checkOutTime: new Date(), isActive: false }
              : record
          );
          console.log('Updated checkIns (checkout):', updated);
          return updated;
        });
        return { success: true, action: 'checkout', userName };
      } else {
        // Check in the user
        const newCheckIn: CheckInRecord = {
          id: Date.now().toString(),
          userId,
          userName,
          checkInTime: new Date(),
          isActive: true
        };
        
        console.log('New check-in record:', newCheckIn);
        
        setCheckIns(prev => {
          const updated = [...prev, newCheckIn];
          console.log('Updated checkIns (checkin):', updated);
          return updated;
        });
        return { success: true, action: 'checkin', userName };
      }
    } catch (error) {
      console.error('QR scan processing error:', error);
      return { success: false, error: 'Invalid QR code' };
    }
  }, [checkIns]);

  const manualCheckIn = useCallback((userId: string, userName: string) => {
    const existingCheckIn = checkIns.find(record => 
      record.userId === userId && record.isActive
    );

    if (existingCheckIn) {
      // Check out
      setCheckIns(prev => prev.map(record => 
        record.id === existingCheckIn.id
          ? { ...record, checkOutTime: new Date(), isActive: false }
          : record
      ));
      return { success: true, action: 'checkout', userName };
    } else {
      // Check in
      const newCheckIn: CheckInRecord = {
        id: Date.now().toString(),
        userId,
        userName,
        checkInTime: new Date(),
        isActive: true
      };
      
      setCheckIns(prev => [...prev, newCheckIn]);
      return { success: true, action: 'checkin', userName };
    }
  }, [checkIns]);

  const getActiveUsers = useCallback(() => {
    return checkIns.filter(record => record.isActive);
  }, [checkIns]);

  const getRecentActivity = useCallback(() => {
    return checkIns
      .sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime())
      .slice(0, 10);
  }, [checkIns]);

  // Simulate real-time updates (in real app, this would come from websockets/server)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly check out some users (simulate people leaving)
      setCheckIns(prev => {
        const activeUsers = prev.filter(record => record.isActive);
        if (activeUsers.length > 0 && Math.random() < 0.1) { // 10% chance per minute
          const randomUser = activeUsers[Math.floor(Math.random() * activeUsers.length)];
          return prev.map(record => 
            record.id === randomUser.id
              ? { ...record, checkOutTime: new Date(), isActive: false }
              : record
          );
        }
        return prev;
      });

      // Randomly add new users (simulate people arriving)
      if (Math.random() < 0.05) { // 5% chance per minute
        const availableUsers = Object.entries(DEMO_USERS).filter(([userId]) => 
          !checkIns.some(record => record.userId === userId && record.isActive)
        );
        
        if (availableUsers.length > 0) {
          const [userId, userName] = availableUsers[Math.floor(Math.random() * availableUsers.length)];
          const newCheckIn: CheckInRecord = {
            id: Date.now().toString(),
            userId,
            userName,
            checkInTime: new Date(),
            isActive: true
          };
          
          setCheckIns(prev => [...prev, newCheckIn]);
        }
      }
    }, 60000); // Every minute

    return () => clearInterval(interval);
  }, [checkIns]);

  return {
    checkIns,
    crowdStats,
    processQRScan,
    manualCheckIn,
    getActiveUsers,
    getRecentActivity
  };
};