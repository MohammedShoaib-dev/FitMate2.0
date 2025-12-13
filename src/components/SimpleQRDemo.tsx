import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, X } from 'lucide-react';

interface SimpleQRDemoProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const SimpleQRDemo = ({ onScan, onClose, isOpen }: SimpleQRDemoProps) => {
  const simulateQRScan = (userId: string) => {
    const qrData = `FITMATE_CHECKIN:${userId}:${Date.now()}`;
    console.log('SimpleQRDemo: Simulating scan for', userId, 'with data:', qrData);
    onScan(qrData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Quick Check-In Demo
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Click on a user to simulate their QR code scan:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => simulateQRScan('USER001')}
              className="h-auto py-4 flex-col gap-2"
            >
              <div className="font-medium">John Doe</div>
              <div className="text-xs opacity-80">USER001</div>
            </Button>
            
            <Button
              onClick={() => simulateQRScan('USER002')}
              className="h-auto py-4 flex-col gap-2"
            >
              <div className="font-medium">Jane Smith</div>
              <div className="text-xs opacity-80">USER002</div>
            </Button>
            
            <Button
              onClick={() => simulateQRScan('USER003')}
              className="h-auto py-4 flex-col gap-2"
            >
              <div className="font-medium">Mike Johnson</div>
              <div className="text-xs opacity-80">USER003</div>
            </Button>
            
            <Button
              onClick={() => simulateQRScan('USER004')}
              className="h-auto py-4 flex-col gap-2"
            >
              <div className="font-medium">Sarah Wilson</div>
              <div className="text-xs opacity-80">USER004</div>
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            First click = Check In | Second click = Check Out
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimpleQRDemo;