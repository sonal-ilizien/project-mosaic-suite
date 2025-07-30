import { useState, useEffect } from "react";
import { 
  Clock, 
  Play, 
  Square, 
  FileText, 
  Calendar,
  User,
  CheckCircle,
  X,
  Plus,
  Loader2,
  Sparkles,
  BarChart3,
  AlertCircle,
  Users,
  Tag,
  Star,
  Timer
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, differenceInMinutes, addMinutes } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { agileAPI, CreateWorkLogPayload } from "./AgileAPI";

interface WorkLog {
  id: number;
  start_time: string;
  end_time: string;
  description: string;
  duration_minutes: number;
  created_at: string;
}

interface WorkLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number;
  taskTitle: string;
  projectName: string;
  onWorkLogCreated?: (workLog: WorkLog) => void;
}

interface WorkLogData {
  startTime: Date | undefined;
  endTime: Date | undefined;
  description: string;
  duration: number; // in minutes
}

const WorkLogModal = ({ 
  open, 
  onOpenChange, 
  taskId, 
  taskTitle, 
  projectName, 
  onWorkLogCreated 
}: WorkLogModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingWorkLogs, setExistingWorkLogs] = useState<WorkLog[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingStartTime, setTrackingStartTime] = useState<Date | null>(null);

  const [workLogData, setWorkLogData] = useState<WorkLogData>({
    startTime: undefined,
    endTime: undefined,
    description: '',
    duration: 0
  });

  // Load existing work logs when modal opens
  useEffect(() => {
    if (open && taskId) {
      loadExistingWorkLogs();
    }
  }, [open, taskId]);

  // Auto-update duration when start/end times change
  useEffect(() => {
    if (workLogData.startTime && workLogData.endTime) {
      const duration = differenceInMinutes(workLogData.endTime, workLogData.startTime);
      setWorkLogData(prev => ({ ...prev, duration: Math.max(0, duration) }));
    }
  }, [workLogData.startTime, workLogData.endTime]);

  const loadExistingWorkLogs = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockWorkLogs: WorkLog[] = [
        {
          id: 1,
          start_time: '2024-01-16T09:00:00Z',
          end_time: '2024-01-16T11:30:00Z',
          description: 'Implemented form validation and error handling',
          duration_minutes: 150,
          created_at: '2024-01-16T11:30:00Z'
        },
        {
          id: 2,
          start_time: '2024-01-16T14:00:00Z',
          end_time: '2024-01-16T16:00:00Z',
          description: 'Code review and bug fixes',
          duration_minutes: 120,
          created_at: '2024-01-16T16:00:00Z'
        }
      ];
      setExistingWorkLogs(mockWorkLogs);
    } catch (error) {
      console.error('Error loading work logs:', error);
    }
  };

  const handleStartTracking = () => {
    const now = new Date();
    setTrackingStartTime(now);
    setIsTracking(true);
    setWorkLogData(prev => ({ ...prev, startTime: now }));
  };

  const handleStopTracking = () => {
    const now = new Date();
    setTrackingStartTime(null);
    setIsTracking(false);
    setWorkLogData(prev => ({ ...prev, endTime: now }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!workLogData.startTime || !workLogData.endTime || !workLogData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (workLogData.duration <= 0) {
      toast({
        title: "Validation Error",
        description: "End time must be after start time.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const workLogPayload: CreateWorkLogPayload = {
        start_time: workLogData.startTime.toISOString(),
        end_time: workLogData.endTime.toISOString(),
        description: workLogData.description
      };

      console.log('Creating work log:', workLogPayload);
      const response = await agileAPI.addWorkLog(taskId, workLogPayload);
      console.log('Work log created successfully:', response);

      toast({
        title: "Success",
        description: response.message || "Work log added successfully!",
      });

      // Reset form
      setWorkLogData({
        startTime: undefined,
        endTime: undefined,
        description: '',
        duration: 0
      });

      // Reload work logs
      await loadExistingWorkLogs();

      // Call callback if provided
      if (onWorkLogCreated) {
        onWorkLogCreated(response.data || response);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating work log:', error);
      toast({
        title: "Error",
        description: "Failed to add work log. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTotalTime = () => {
    return existingWorkLogs.reduce((total, log) => total + log.duration_minutes, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[98vw] max-h-[95vh] overflow-hidden p-0 rounded-none border-0 shadow-none [&_.absolute]:text-white [&_.absolute_button]:text-white [&_.absolute_svg]:text-white [&_.absolute_button:hover]:bg-white/20 [&_.absolute_button]:opacity-100 [&_.absolute_button]:hover:opacity-100">
        <div className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl overflow-hidden rounded-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Work Log</h2>
                  <p className="text-white/90">{taskTitle}</p>
                  <p className="text-white/70 text-sm">{projectName}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Timer className="w-3 h-3 mr-1" />
                Time Tracking
              </Badge>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex h-full">
            {/* Left Side - Work Log Form */}
            <div className="w-[60%] overflow-y-auto p-8 max-h-[calc(95vh-120px)]">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Time Tracking */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  Time Tracking
                </h3>
                
                <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                  {!isTracking ? (
                    <Button
                      type="button"
                      onClick={handleStartTracking}
                      className="font-semibold transition-all duration-200 rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl px-6 py-3"
                      disabled={isLoading}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Tracking
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleStopTracking}
                      className="font-semibold transition-all duration-200 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl px-6 py-3"
                      disabled={isLoading}
                    >
                      <Square className="w-4 h-4 mr-2" />
                      Stop Tracking
                    </Button>
                  )}
                  
                  {isTracking && trackingStartTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Tracking since {format(trackingStartTime, 'HH:mm')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Time Input */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  Time Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Start Time *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start text-left font-normal bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {workLogData.startTime ? format(workLogData.startTime, 'PPP p') : 'Pick start time'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={workLogData.startTime}
                          onSelect={(date) => setWorkLogData(prev => ({ ...prev, startTime: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">End Time *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start text-left font-normal bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {workLogData.endTime ? format(workLogData.endTime, 'PPP p') : 'Pick end time'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={workLogData.endTime}
                          onSelect={(date) => setWorkLogData(prev => ({ ...prev, endTime: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {workLogData.duration > 0 && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Duration:</span>
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        {formatDuration(workLogData.duration)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Work Description */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  Work Description
                </h3>
                
                <div className="space-y-3">
                  <Label htmlFor="work-description" className="text-sm font-semibold text-gray-700">
                    What did you work on? *
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="work-description"
                      value={workLogData.description}
                      onChange={(e) => setWorkLogData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the work you completed during this time..."
                      className="min-h-[120px] bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  disabled={isLoading}
                  className="font-semibold transition-all duration-200 rounded-xl bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-6 py-3"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="font-semibold transition-all duration-200 rounded-xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 shadow-lg hover:shadow-xl px-6 py-3"
                  disabled={isLoading || !workLogData.startTime || !workLogData.endTime || !workLogData.description || workLogData.duration <= 0}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  Add Work Log
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side - Existing Work Logs */}
          <div className="w-[40%] border-l border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 p-8 max-h-[95vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header matching left side structure */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Work History</h2>
                    <p className="text-sm text-muted-foreground">Time Tracking</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {formatDuration(getTotalTime())} total
                </Badge>
              </div>

              {existingWorkLogs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 text-sm">No work logs yet</p>
                  <p className="text-gray-400 text-xs mt-1">Start tracking your time to see history</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {existingWorkLogs.map((workLog) => (
                    <div key={workLog.id} className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {workLog.description}
                          </p>
                        </div>
                        <Badge className="bg-blue-600 text-white text-xs ml-2">
                          {formatDuration(workLog.duration_minutes)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {format(new Date(workLog.start_time), 'MMM dd, HH:mm')} - {format(new Date(workLog.end_time), 'HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(workLog.created_at), 'MMM dd')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export default WorkLogModal; 