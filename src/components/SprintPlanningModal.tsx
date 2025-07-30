import { useState, useEffect } from "react";
import { 
  Calendar, 
  Target, 
  Users, 
  Clock, 
  CheckCircle,
  X,
  Plus,
  Loader2,
  Sparkles,
  BarChart3,
  TrendingUp,
  AlertCircle
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
import { format, addDays, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { agileAPI, CreateSprintPayload } from "./AgileAPI";

interface Sprint {
  id: number;
  project: number;
  project_name: string;
  name: string;
  start_date: string;
  end_date: string;
  goal: string;
  tasks_count: number;
  completed_tasks_count: number;
  total_story_points: number;
  completed_story_points: number;
  progress_percentage: number;
}

interface SprintPlanningModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectName: string;
  onSprintCreated?: (sprint: Sprint) => void;
}

interface SprintData {
  name: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  goal: string;
  duration: number;
}

const SprintPlanningModal = ({ 
  open, 
  onOpenChange, 
  projectId, 
  projectName, 
  onSprintCreated 
}: SprintPlanningModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [existingSprints, setExistingSprints] = useState<Sprint[]>([]);

  const [sprintData, setSprintData] = useState<SprintData>({
    name: '',
    startDate: undefined,
    endDate: undefined,
    goal: '',
    duration: 14 // Default 2 weeks
  });

  // Load existing sprints when modal opens
  useEffect(() => {
    if (open && projectId) {
      loadExistingSprints();
    }
  }, [open, projectId]);

  const loadExistingSprints = async () => {
    try {
      const response = await agileAPI.getSprints(projectId);
      // Handle the nested response structure: { results: { data: [...] } }
      const sprintsData = response.results?.data || response.data || [];
      setExistingSprints(sprintsData);
    } catch (error) {
      console.error('Error loading sprints:', error);
    }
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setSprintData(prev => ({
      ...prev,
      startDate: date,
      endDate: date ? addDays(date, prev.duration - 1) : undefined
    }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setSprintData(prev => ({
      ...prev,
      endDate: date,
      duration: date && prev.startDate ? differenceInDays(date, prev.startDate) + 1 : prev.duration
    }));
  };

  const handleDurationChange = (duration: number) => {
    setSprintData(prev => ({
      ...prev,
      duration,
      endDate: prev.startDate ? addDays(prev.startDate, duration - 1) : undefined
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sprintData.name || !sprintData.startDate || !sprintData.endDate || !sprintData.goal) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const sprintPayload: CreateSprintPayload = {
        project: projectId,
        name: sprintData.name,
        start_date: format(sprintData.startDate, 'yyyy-MM-dd'),
        end_date: format(sprintData.endDate, 'yyyy-MM-dd'),
        goal: sprintData.goal
      };

      console.log('Creating sprint:', sprintPayload);
      const response = await agileAPI.createSprint(sprintPayload);
      console.log('Sprint created successfully:', response);

      toast({
        title: "Success",
        description: response.message || "Sprint created successfully!",
      });

      // Reset form
      setSprintData({
        name: '',
        startDate: undefined,
        endDate: undefined,
        goal: '',
        duration: 14
      });

      // Reload sprints
      await loadExistingSprints();

      // Call callback if provided
      if (onSprintCreated) {
        onSprintCreated(response.data || response);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating sprint:', error);
      toast({
        title: "Error",
        description: "Failed to create sprint. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSprintStatus = (sprint: Sprint) => {
    const today = new Date();
    const startDate = new Date(sprint.start_date);
    const endDate = new Date(sprint.end_date);

    if (today < startDate) return { status: 'Planned', color: 'bg-blue-500' };
    if (today >= startDate && today <= endDate) return { status: 'Active', color: 'bg-green-500' };
    return { status: 'Completed', color: 'bg-gray-500' };
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
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Sprint Planning</h2>
                  <p className="text-white/90">{projectName}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <Sparkles className="w-3 h-3 mr-1" />
                Agile Template
              </Badge>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex h-full">
            {/* Left Side - Sprint Creation Form */}
            <div className="w-[60%] overflow-y-auto p-8 max-h-[calc(95vh-120px)]">

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sprint Basic Info */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Sprint Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="sprint-name" className="text-sm font-semibold text-gray-700">
                      Sprint Name *
                    </Label>
                    <div className="relative">
                      <Input
                        id="sprint-name"
                        value={sprintData.name}
                        onChange={(e) => setSprintData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Sprint 1, Sprint Alpha"
                        className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="sprint-duration" className="text-sm font-semibold text-gray-700">
                      Duration (days) *
                    </Label>
                    <div className="relative">
                      <Select
                        value={sprintData.duration.toString()}
                        onValueChange={(value) => handleDurationChange(parseInt(value))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          <SelectItem value="7">1 Week (7 days)</SelectItem>
                          <SelectItem value="14">2 Weeks (14 days)</SelectItem>
                          <SelectItem value="21">3 Weeks (21 days)</SelectItem>
                          <SelectItem value="28">4 Weeks (28 days)</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">Start Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start text-left font-normal bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {sprintData.startDate ? format(sprintData.startDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={sprintData.startDate}
                          onSelect={handleStartDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-700">End Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="h-12 w-full justify-start text-left font-normal bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {sprintData.endDate ? format(sprintData.endDate, 'PPP') : 'Pick a date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="single"
                          selected={sprintData.endDate}
                          onSelect={handleEndDateChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Sprint Goal */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  Sprint Goal
                </h3>
                
                <div className="space-y-3">
                  <Label htmlFor="sprint-goal" className="text-sm font-semibold text-gray-700">
                    What will this sprint accomplish? *
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="sprint-goal"
                      value={sprintData.goal}
                      onChange={(e) => setSprintData(prev => ({ ...prev, goal: e.target.value }))}
                      placeholder="e.g., Implement shopping cart and checkout functionality"
                      className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900 resize-none min-h-[120px]"
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
                  disabled={isLoading || !sprintData.name || !sprintData.startDate || !sprintData.endDate || !sprintData.goal}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Create Sprint
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side - Existing Sprints */}
          <div className="w-[40%] border-l border-gray-200 bg-gradient-to-br from-gray-50 to-green-50 p-8 max-h-[calc(95vh-120px)] overflow-y-auto">
            <div className="space-y-6">
              {/* Header matching left side structure */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Sprint Preview</h2>
                    <p className="text-sm text-muted-foreground">Live Preview</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {existingSprints.length} existing
                </Badge>
              </div>

              {/* Live Preview Card */}
              {(sprintData.name || sprintData.startDate || sprintData.endDate || sprintData.goal) ? (
                <div className="bg-white rounded-xl border-2 border-blue-200 p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-lg text-gray-900">
                      {sprintData.name || 'Sprint Name'}
                    </h4>
                    <Badge className="bg-blue-600 text-white text-xs">
                      {sprintData.startDate && sprintData.endDate 
                        ? `${differenceInDays(sprintData.endDate, sprintData.startDate) + 1} days`
                        : 'Duration'
                      }
                    </Badge>
                  </div>
                  
                  {sprintData.goal && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {sprintData.goal}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Start Date:</span>
                      <span className="font-medium text-gray-900">
                        {sprintData.startDate ? format(sprintData.startDate, 'MMM dd, yyyy') : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">End Date:</span>
                      <span className="font-medium text-gray-900">
                        {sprintData.endDate ? format(sprintData.endDate, 'MMM dd, yyyy') : 'Not set'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium text-gray-900">
                        {sprintData.duration} days
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Tasks: 0</span>
                      <span>Story Points: 0</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 text-center">
                  <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-500 text-sm font-medium">Sprint Preview</p>
                  <p className="text-gray-400 text-xs mt-1">Fill in the form to see a live preview</p>
                </div>
              )}

              {/* Existing Sprints Section */}
              {existingSprints.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Existing Sprints</h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {existingSprints.map((sprint) => {
                      const status = getSprintStatus(sprint);
                      return (
                        <div key={sprint.id} className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{sprint.name}</h4>
                            <Badge className={`text-xs text-white ${status.color}`}>
                              {status.status}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {sprint.goal}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {format(new Date(sprint.start_date), 'MMM dd')} - {format(new Date(sprint.end_date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3" />
                              <span>{differenceInDays(new Date(sprint.end_date), new Date(sprint.start_date)) + 1} days</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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

export default SprintPlanningModal; 