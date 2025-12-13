import { useState, useEffect, useCallback } from 'react';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: 'Basic' | 'Premium' | 'VIP';
  joinDate: string;
  lastVisit: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  totalVisits: number;
  monthlyVisits: number;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  notes?: string;
}

export interface MemberStats {
  totalMembers: number;
  activeMembers: number;
  newMembersThisMonth: number;
  membershipBreakdown: Record<string, number>;
  statusBreakdown: Record<string, number>;
  averageVisitsPerMonth: number;
  retentionRate: number;
}

const DEMO_MEMBERS: Member[] = [
  {
    id: 'USER001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    membershipType: 'Premium',
    joinDate: '2024-01-15',
    lastVisit: new Date().toISOString().split('T')[0],
    status: 'Active',
    totalVisits: 145,
    monthlyVisits: 18,
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 123-4568',
      relationship: 'Spouse'
    },
    notes: 'Prefers morning workouts. Interested in personal training.'
  },
  {
    id: 'USER002',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '+1 (555) 234-5678',
    membershipType: 'VIP',
    joinDate: '2023-11-20',
    lastVisit: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    status: 'Active',
    totalVisits: 89,
    monthlyVisits: 22,
    emergencyContact: {
      name: 'Robert Smith',
      phone: '+1 (555) 234-5679',
      relationship: 'Father'
    },
    notes: 'Regular yoga class attendee. Has dietary restrictions.'
  },
  {
    id: 'USER003',
    name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '+1 (555) 345-6789',
    membershipType: 'Basic',
    joinDate: '2024-03-10',
    lastVisit: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    status: 'Active',
    totalVisits: 67,
    monthlyVisits: 12,
    emergencyContact: {
      name: 'Sarah Johnson',
      phone: '+1 (555) 345-6790',
      relationship: 'Sister'
    }
  },
  {
    id: 'USER004',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 456-7890',
    membershipType: 'Premium',
    joinDate: '2024-02-28',
    lastVisit: new Date(Date.now() - 259200000).toISOString().split('T')[0],
    status: 'Active',
    totalVisits: 78,
    monthlyVisits: 15,
    emergencyContact: {
      name: 'Tom Wilson',
      phone: '+1 (555) 456-7891',
      relationship: 'Husband'
    },
    notes: 'Recovering from knee injury. Modified workout plan.'
  },
  {
    id: 'USER005',
    name: 'David Lee',
    email: 'david.lee@email.com',
    phone: '+1 (555) 567-8901',
    membershipType: 'Basic',
    joinDate: '2023-12-05',
    lastVisit: new Date(Date.now() - 604800000).toISOString().split('T')[0],
    status: 'Inactive',
    totalVisits: 23,
    monthlyVisits: 3,
    emergencyContact: {
      name: 'Lisa Lee',
      phone: '+1 (555) 567-8902',
      relationship: 'Wife'
    },
    notes: 'Has not visited in over a week. Consider follow-up.'
  },
  {
    id: 'USER006',
    name: 'Emily Brown',
    email: 'emily.brown@email.com',
    phone: '+1 (555) 678-9012',
    membershipType: 'VIP',
    joinDate: '2024-04-12',
    lastVisit: new Date().toISOString().split('T')[0],
    status: 'Active',
    totalVisits: 56,
    monthlyVisits: 20,
    emergencyContact: {
      name: 'Mark Brown',
      phone: '+1 (555) 678-9013',
      relationship: 'Brother'
    },
    notes: 'Competitive powerlifter. Trains 6 days a week.'
  }
];

export const useMemberSystem = () => {
  const [members, setMembers] = useState<Member[]>(DEMO_MEMBERS);

  const updateMemberStatus = useCallback((memberId: string, status: Member['status']) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, status } : member
    ));
  }, []);

  const updateMemberNotes = useCallback((memberId: string, notes: string) => {
    setMembers(prev => prev.map(member => 
      member.id === memberId ? { ...member, notes } : member
    ));
  }, []);

  const addMember = useCallback((newMember: Omit<Member, 'id' | 'totalVisits' | 'monthlyVisits'>) => {
    const member: Member = {
      ...newMember,
      id: `USER${Date.now()}`,
      totalVisits: 0,
      monthlyVisits: 0
    };
    setMembers(prev => [member, ...prev]);
    return member;
  }, []);

  const getMemberStats = useCallback((): MemberStats => {
    const totalMembers = members.length;
    const activeMembers = members.filter(m => m.status === 'Active').length;
    
    // New members this month
    const thisMonth = new Date();
    const newMembersThisMonth = members.filter(m => {
      const joinDate = new Date(m.joinDate);
      return joinDate.getMonth() === thisMonth.getMonth() && 
             joinDate.getFullYear() === thisMonth.getFullYear();
    }).length;

    // Membership breakdown
    const membershipBreakdown: Record<string, number> = {};
    members.forEach(m => {
      membershipBreakdown[m.membershipType] = (membershipBreakdown[m.membershipType] || 0) + 1;
    });

    // Status breakdown
    const statusBreakdown: Record<string, number> = {};
    members.forEach(m => {
      statusBreakdown[m.status] = (statusBreakdown[m.status] || 0) + 1;
    });

    // Average visits per month
    const averageVisitsPerMonth = members.length > 0
      ? Math.round(members.reduce((sum, m) => sum + m.monthlyVisits, 0) / members.length)
      : 0;

    // Retention rate (active members / total members)
    const retentionRate = totalMembers > 0 
      ? Math.round((activeMembers / totalMembers) * 100)
      : 0;

    return {
      totalMembers,
      activeMembers,
      newMembersThisMonth,
      membershipBreakdown,
      statusBreakdown,
      averageVisitsPerMonth,
      retentionRate
    };
  }, [members]);

  const getMembersByStatus = useCallback((status?: Member['status']) => {
    if (!status) return members;
    return members.filter(m => m.status === status);
  }, [members]);

  const getMembersByMembershipType = useCallback((type: Member['membershipType']) => {
    return members.filter(m => m.membershipType === type);
  }, [members]);

  const searchMembers = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return members.filter(m => 
      m.name.toLowerCase().includes(lowercaseQuery) ||
      m.email.toLowerCase().includes(lowercaseQuery) ||
      m.phone.includes(query) ||
      m.id.toLowerCase().includes(lowercaseQuery)
    );
  }, [members]);

  const getRecentMembers = useCallback((limit: number = 5) => {
    return members
      .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
      .slice(0, limit);
  }, [members]);

  const getInactiveMembers = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return members.filter(m => {
      const lastVisit = new Date(m.lastVisit);
      return lastVisit < oneWeekAgo && m.status === 'Active';
    });
  }, [members]);

  // Simulate member activity updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMembers(prev => prev.map(member => {
        // Randomly update last visit for active members
        if (member.status === 'Active' && Math.random() < 0.1) {
          return {
            ...member,
            lastVisit: new Date().toISOString().split('T')[0],
            totalVisits: member.totalVisits + 1,
            monthlyVisits: member.monthlyVisits + 1
          };
        }
        return member;
      }));
    }, 300000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    members,
    updateMemberStatus,
    updateMemberNotes,
    addMember,
    getMemberStats,
    getMembersByStatus,
    getMembersByMembershipType,
    searchMembers,
    getRecentMembers,
    getInactiveMembers
  };
};