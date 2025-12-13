import { useState } from 'react';
import { X, Clock, Users, DollarSign, User, Calendar, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBookingSystem, GymClass } from '@/hooks/useBookingSystem';
import { useToast } from '@/hooks/use-toast';

interface ClassBookingProps {
  isOpen: boolean;
  onClose: () => void;
  gymClass: GymClass | null;
}

const ClassBooking = ({ isOpen, onClose, gymClass }: ClassBookingProps) => {
  const { bookClass, isBooking } = useBookingSystem();
  const { toast } = useToast();
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen || !gymClass) return null;

  const handleBookClass = async () => {
    const result = await bookClass(gymClass.id);
    
    if (result.success) {
      toast({
        title: "Class Booked Successfully! 🎉",
        description: `You're all set for ${gymClass.name} with ${gymClass.instructor}.`,
      });
      onClose();
    } else {
      toast({
        title: "Booking Failed",
        description: result.error,
        variant: "destructive",
      });
    }
    setIsConfirming(false);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Beginner': 'bg-green-500/10 text-green-700',
      'Intermediate': 'bg-orange-500/10 text-orange-700',
      'Advanced': 'bg-red-500/10 text-red-700'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-500/10 text-gray-700';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Yoga': 'bg-purple-500/10 text-purple-700',
      'Cardio': 'bg-red-500/10 text-red-700',
      'Dance': 'bg-pink-500/10 text-pink-700',
      'Strength': 'bg-blue-500/10 text-blue-700',
      'Pilates': 'bg-indigo-500/10 text-indigo-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/10 text-gray-700';
  };

  const spotsPercentage = ((gymClass.totalSpots - gymClass.spotsLeft) / gymClass.totalSpots) * 100;
  const isAlmostFull = spotsPercentage >= 80;
  const isFull = gymClass.spotsLeft === 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Book Class</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Class Info */}
          <div className="space-y-3">
            <div>
              <h3 className="text-xl font-bold">{gymClass.name}</h3>
              <p className="text-sm text-muted-foreground">{gymClass.description}</p>
            </div>

            <div className="flex gap-2">
              <Badge className={getLevelColor(gymClass.level)}>
                {gymClass.level}
              </Badge>
              <Badge className={getCategoryColor(gymClass.category)}>
                {gymClass.category}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* Class Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Instructor:</span> {gymClass.instructor}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Date:</span> {new Date(gymClass.date).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Time:</span> {gymClass.time} ({gymClass.duration})
              </span>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-medium">Price:</span> ${gymClass.price}
              </span>
            </div>
          </div>

          <Separator />

          {/* Availability */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Availability</span>
              <span className="text-sm text-muted-foreground">
                {gymClass.spotsLeft} of {gymClass.totalSpots} spots left
              </span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  isFull ? 'bg-red-500' : isAlmostFull ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ width: `${spotsPercentage}%` }}
              />
            </div>

            {isAlmostFull && !isFull && (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Almost full! Book soon to secure your spot.</span>
              </div>
            )}

            {isFull && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>This class is currently full.</span>
              </div>
            )}
          </div>

          {/* Equipment */}
          {gymClass.equipment && gymClass.equipment.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-2">Equipment Provided</h4>
                <div className="flex flex-wrap gap-1">
                  {gymClass.equipment.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Booking Actions */}
          <div className="space-y-3">
            {!isConfirming ? (
              <Button
                onClick={() => setIsConfirming(true)}
                disabled={isFull}
                className="w-full"
              >
                {isFull ? 'Class Full' : `Book for $${gymClass.price}`}
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Confirm your booking for <strong>${gymClass.price}</strong></span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirming(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleBookClass}
                    disabled={isBooking}
                    className="flex-1"
                  >
                    {isBooking ? 'Booking...' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground text-center">
              You can cancel up to 2 hours before the class starts for a full refund.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassBooking;