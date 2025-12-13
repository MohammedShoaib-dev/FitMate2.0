import { useState } from "react";
import { Users, QrCode, Clock, TrendingUp, UserCheck, UserX, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCheckInSystem } from "@/hooks/useCheckInSystem";
import QRScanner from "@/components/QRScanner";
import { useToast } from "@/hooks/use-toast";

const CheckInManagement = () => {
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { 
    checkIns, 
    crowdStats, 
    processQRScan, 
    manualCheckIn, 
    getActiveUsers, 
    getRecentActivity 
  } = useCheckInSystem();
  const { toast } = useToast();

  const handleQRScan = (qrData: string) => {
    const result = processQRScan(qrData);
    
    if (result.success) {
      toast({
        title: result.action === 'checkin' ? "Checked In!" : "Checked Out!",
        description: `${result.userName} has been ${result.action === 'checkin' ? 'checked in' : 'checked out'} successfully.`,
      });
      setIsQRScannerOpen(false);
    } else {
      toast({
        title: "Scan Failed",
        description: result.error || "Invalid QR code",
        variant: "destructive",
      });
    }
  };

  const handleManualCheckIn = (userId: string, userName: string) => {
    const result = manualCheckIn(userId, userName);
    
    toast({
      title: result.action === 'checkin' ? "Checked In!" : "Checked Out!",
      description: `${result.userName} has been ${result.action === 'checkin' ? 'checked in' : 'checked out'} successfully.`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString();
  };

  const getStayDuration = (checkInTime: Date, checkOutTime?: Date) => {
    const endTime = checkOutTime || new Date();
    const diffMs = endTime.getTime() - checkInTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins}m`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  };

  const filteredCheckIns = checkIns.filter(record => {
    const matchesSearch = record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && record.isActive) ||
                         (filterStatus === "inactive" && !record.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const exportData = () => {
    const csvContent = [
      ['User ID', 'User Name', 'Check In Time', 'Check Out Time', 'Duration', 'Status'],
      ...checkIns.map(record => [
        record.userId,
        record.userName,
        record.checkInTime.toISOString(),
        record.checkOutTime?.toISOString() || '',
        getStayDuration(record.checkInTime, record.checkOutTime),
        record.isActive ? 'Active' : 'Completed'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gym-checkins-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Check-In Management</h1>
          <p className="text-muted-foreground">Monitor and manage gym occupancy</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setIsQRScannerOpen(true)}>
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR Code
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Occupancy</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crowdStats.currentCount}</div>
            <p className="text-xs text-muted-foreground">
              {crowdStats.percentage}% of capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Capacity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crowdStats.maxCapacity}</div>
            <p className="text-xs text-muted-foreground">
              Total gym capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Stay Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{crowdStats.averageStayTime}m</div>
            <p className="text-xs text-muted-foreground">
              Average session duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{crowdStats.status}</div>
            <p className="text-xs text-muted-foreground">
              Current crowd level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Check-In Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search by name or user ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Completed Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredCheckIns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No check-in records found
              </div>
            ) : (
              filteredCheckIns.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {record.isActive ? (
                        <UserCheck className="w-4 h-4 text-green-500" />
                      ) : (
                        <UserX className="w-4 h-4 text-red-500" />
                      )}
                      <div>
                        <p className="font-medium">{record.userName}</p>
                        <p className="text-sm text-muted-foreground">{record.userId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        In: {formatTime(record.checkInTime)}
                      </p>
                      {record.checkOutTime && (
                        <p className="text-sm text-muted-foreground">
                          Out: {formatTime(record.checkOutTime)}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <Badge variant={record.isActive ? "default" : "secondary"}>
                        {getStayDuration(record.checkInTime, record.checkOutTime)}
                      </Badge>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManualCheckIn(record.userId, record.userName)}
                      disabled={!record.isActive}
                    >
                      {record.isActive ? "Check Out" : "Checked Out"}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Manual Check-In */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Manual Check-In</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { id: 'USER005', name: 'Emily Brown' },
              { id: 'USER006', name: 'David Lee' },
              { id: 'USER007', name: 'Lisa Garcia' },
              { id: 'USER008', name: 'Tom Anderson' }
            ].map((user) => {
              const isActive = getActiveUsers().some(active => active.userId === user.id);
              return (
                <Button
                  key={user.id}
                  variant={isActive ? "destructive" : "default"}
                  onClick={() => handleManualCheckIn(user.id, user.name)}
                  className="h-auto py-3 flex-col gap-1"
                >
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs opacity-80">
                    {isActive ? "Check Out" : "Check In"}
                  </span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleQRScan}
      />
    </div>
  );
};

export default CheckInManagement;