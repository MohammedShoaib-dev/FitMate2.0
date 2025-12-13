import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  date: string;
  comment: string;
  rating: number;
  category: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
  adminNotes?: string;
}

export interface FeedbackStats {
  totalFeedback: number;
  pendingFeedback: number;
  reviewedFeedback: number;
  resolvedFeedback: number;
  averageRating: number;
  categoryBreakdown: Record<string, number>;
  ratingDistribution: Record<number, number>;
  monthlyTrends: { month: string; count: number; avgRating: number }[];
}

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => Feedback;
  markAsReviewed: (feedbackId: string, adminNotes?: string) => void;
  markAsResolved: (feedbackId: string, adminNotes?: string) => void;
  getFeedbackStats: () => FeedbackStats;
  getFeedbacksByStatus: (status?: 'pending' | 'reviewed' | 'resolved') => Feedback[];
  getFeedbacksByCategory: (category: string) => Feedback[];
  getRecentFeedback: (limit?: number) => Feedback[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

const DEMO_FEEDBACK: Feedback[] = [
  {
    id: "1",
    userId: "USER001",
    userName: "John Doe",
    date: new Date().toLocaleDateString(),
    comment: "Love the new dumbbells! Great quality and variety. The gym feels much more modern now.",
    rating: 5,
    category: "Equipment",
    status: "reviewed",
    createdAt: new Date(Date.now() - 86400000), // 1 day ago
  },
  {
    id: "2",
    userId: "USER002",
    userName: "Jane Smith",
    date: new Date().toLocaleDateString(),
    comment: "Bathroom could be cleaner. AC not working well in the cardio area. Otherwise good experience.",
    rating: 3,
    category: "Facility",
    status: "pending",
    createdAt: new Date(Date.now() - 43200000), // 12 hours ago
  },
  {
    id: "3",
    userId: "USER003",
    userName: "Mike Johnson",
    date: new Date(Date.now() - 86400000).toLocaleDateString(),
    comment: "Excellent trainers and facilities! Sarah helped me with my form and it made a huge difference.",
    rating: 5,
    category: "Service",
    status: "reviewed",
    createdAt: new Date(Date.now() - 172800000), // 2 days ago
  },
  {
    id: "4",
    userId: "USER004",
    userName: "Sarah Wilson",
    date: new Date(Date.now() - 259200000).toLocaleDateString(),
    comment: "The yoga classes are amazing! Would love to see more variety in class times.",
    rating: 4,
    category: "Classes",
    status: "resolved",
    createdAt: new Date(Date.now() - 259200000), // 3 days ago
    resolvedAt: new Date(Date.now() - 86400000),
    adminNotes: "Added evening yoga class on Wednesdays"
  },
  {
    id: "5",
    userId: "USER005",
    userName: "David Lee",
    date: new Date(Date.now() - 345600000).toLocaleDateString(),
    comment: "Parking is always full during peak hours. Maybe consider reserved spots for members?",
    rating: 3,
    category: "Facility",
    status: "pending",
    createdAt: new Date(Date.now() - 345600000), // 4 days ago
  },
  {
    id: "6",
    userId: "USER006",
    userName: "Emily Brown",
    date: new Date(Date.now() - 432000000).toLocaleDateString(),
    comment: "The new protein bar selection is great! Prices are reasonable too.",
    rating: 5,
    category: "Amenities",
    status: "reviewed",
    createdAt: new Date(Date.now() - 432000000), // 5 days ago
  },
  {
    id: "7",
    userId: "USER007",
    userName: "Tom Anderson",
    date: new Date(Date.now() - 518400000).toLocaleDateString(),
    comment: "Could use more squat racks. Always have to wait during busy times.",
    rating: 3,
    category: "Equipment",
    status: "resolved",
    createdAt: new Date(Date.now() - 518400000), // 6 days ago
    resolvedAt: new Date(Date.now() - 172800000),
    adminNotes: "Ordered 2 additional squat racks, arriving next week"
  },
  {
    id: "8",
    userId: "USER008",
    userName: "Lisa Garcia",
    date: new Date(Date.now() - 604800000).toLocaleDateString(),
    comment: "Staff is always friendly and helpful. Great atmosphere!",
    rating: 5,
    category: "Service",
    status: "reviewed",
    createdAt: new Date(Date.now() - 604800000), // 7 days ago
  }
];

export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(DEMO_FEEDBACK);

  const addFeedback = useCallback((newFeedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const feedback: Feedback = {
      ...newFeedback,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setFeedbacks(prev => [feedback, ...prev]);
    console.log('✅ New feedback added:', feedback);
    return feedback;
  }, []);

  const markAsReviewed = useCallback((feedbackId: string, adminNotes?: string) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            status: 'reviewed' as const,
            adminNotes: adminNotes || feedback.adminNotes
          }
        : feedback
    ));
    console.log('✅ Feedback marked as reviewed:', feedbackId);
  }, []);

  const markAsResolved = useCallback((feedbackId: string, adminNotes?: string) => {
    setFeedbacks(prev => prev.map(feedback => 
      feedback.id === feedbackId 
        ? { 
            ...feedback, 
            status: 'resolved' as const,
            resolvedAt: new Date(),
            adminNotes: adminNotes || feedback.adminNotes
          }
        : feedback
    ));
    console.log('✅ Feedback marked as resolved:', feedbackId);
  }, []);

  const getFeedbackStats = useCallback((): FeedbackStats => {
    const totalFeedback = feedbacks.length;
    const pendingFeedback = feedbacks.filter(f => f.status === 'pending').length;
    const reviewedFeedback = feedbacks.filter(f => f.status === 'reviewed').length;
    const resolvedFeedback = feedbacks.filter(f => f.status === 'resolved').length;
    
    const averageRating = feedbacks.length > 0 
      ? Math.round((feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length) * 10) / 10
      : 0;

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    feedbacks.forEach(f => {
      categoryBreakdown[f.category] = (categoryBreakdown[f.category] || 0) + 1;
    });

    // Rating distribution
    const ratingDistribution: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = feedbacks.filter(f => f.rating === i).length;
    }

    // Monthly trends (last 6 months)
    const monthlyTrends = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      
      const monthFeedbacks = feedbacks.filter(f => {
        const feedbackDate = new Date(f.createdAt);
        return feedbackDate.getMonth() === date.getMonth() && 
               feedbackDate.getFullYear() === date.getFullYear();
      });
      
      const avgRating = monthFeedbacks.length > 0
        ? Math.round((monthFeedbacks.reduce((sum, f) => sum + f.rating, 0) / monthFeedbacks.length) * 10) / 10
        : 0;

      monthlyTrends.push({
        month: monthName,
        count: monthFeedbacks.length,
        avgRating
      });
    }

    return {
      totalFeedback,
      pendingFeedback,
      reviewedFeedback,
      resolvedFeedback,
      averageRating,
      categoryBreakdown,
      ratingDistribution,
      monthlyTrends
    };
  }, [feedbacks]);

  const getFeedbacksByStatus = useCallback((status?: 'pending' | 'reviewed' | 'resolved') => {
    if (!status) return feedbacks;
    return feedbacks.filter(f => f.status === status);
  }, [feedbacks]);

  const getFeedbacksByCategory = useCallback((category: string) => {
    return feedbacks.filter(f => f.category === category);
  }, [feedbacks]);

  const getRecentFeedback = useCallback((limit: number = 5) => {
    return feedbacks
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [feedbacks]);

  const value: FeedbackContextType = {
    feedbacks,
    addFeedback,
    markAsReviewed,
    markAsResolved,
    getFeedbackStats,
    getFeedbacksByStatus,
    getFeedbacksByCategory,
    getRecentFeedback
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};