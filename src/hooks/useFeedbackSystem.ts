import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

export const useFeedbackSystem = () => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(DEMO_FEEDBACK);

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
  }, []);

  const addFeedback = useCallback((newFeedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    const feedback: Feedback = {
      ...newFeedback,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setFeedbacks(prev => [feedback, ...prev]);
    return feedback;
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

  // Simulate new feedback coming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% chance every 2 minutes
        const categories = ['Equipment', 'Facility', 'Service', 'Classes', 'Amenities'];
        const comments = [
          'Great workout today! Equipment is in excellent condition.',
          'Could use more towels in the locker room.',
          'The new trainer is very knowledgeable and helpful.',
          'Love the new spin bikes! Much more comfortable.',
          'Parking lot could use better lighting.',
          'The smoothie bar has amazing post-workout drinks.',
          'Would like to see more variety in group classes.'
        ];
        const names = ['Alex Johnson', 'Maria Rodriguez', 'Chris Taylor', 'Sam Wilson'];
        
        const newFeedback = {
          userId: `USER${Math.floor(Math.random() * 1000)}`,
          userName: names[Math.floor(Math.random() * names.length)],
          date: new Date().toLocaleDateString(),
          comment: comments[Math.floor(Math.random() * comments.length)],
          rating: Math.floor(Math.random() * 3) + 3, // 3-5 stars
          category: categories[Math.floor(Math.random() * categories.length)],
          status: 'pending' as const
        };
        
        addFeedback(newFeedback);
      }
    }, 120000); // Every 2 minutes

    return () => clearInterval(interval);
  }, [addFeedback]);

  return {
    feedbacks,
    markAsReviewed,
    markAsResolved,
    addFeedback,
    getFeedbackStats,
    getFeedbacksByStatus,
    getFeedbacksByCategory,
    getRecentFeedback
  };
};