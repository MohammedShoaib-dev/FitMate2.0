import { useState, useRef, useEffect } from 'react';
import { QrCode, Camera, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const QRScanner = ({ onScan, onClose, isOpen }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen && isScanning) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isOpen, isScanning]);

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleManualInput = () => {
    const input = prompt('Enter QR code data manually:');
    if (input) {
      setLastScan(input);
      onScan(input);
    }
  };

  // Simulate QR code detection (in real app, you'd use a QR library like qr-scanner)
  const simulateQRScan = (userId: string) => {
    const qrData = `FITMATE_CHECKIN:${userId}:${Date.now()}`;
    setLastScan(qrData);
    onScan(qrData);
    console.log('QR Scan simulated:', qrData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              QR Code Scanner
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Camera View */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 bg-gray-900 rounded-lg object-cover"
            />
            <div className="absolute inset-0 border-2 border-dashed border-primary rounded-lg flex items-center justify-center">
              {!isScanning && (
                <div className="text-center text-white">
                  <Camera className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Position QR code in frame</p>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {lastScan && (
            <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-700">Last scan: {lastScan.substring(0, 30)}...</span>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => setIsScanning(!isScanning)}
              className="flex-1"
              variant={isScanning ? "destructive" : "default"}
            >
              {isScanning ? "Stop Scanning" : "Start Scanning"}
            </Button>
            <Button onClick={handleManualInput} variant="outline">
              Manual Input
            </Button>
          </div>

          {/* Demo QR Codes */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Demo QR Codes:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateQRScan('USER001')}
              >
                John Doe
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateQRScan('USER002')}
              >
                Jane Smith
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateQRScan('USER003')}
              >
                Mike Johnson
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => simulateQRScan('USER004')}
              >
                Sarah Wilson
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRScanner;