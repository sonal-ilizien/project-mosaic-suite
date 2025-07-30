import { useState, useEffect } from "react";
import { 
  Bug, 
  AlertTriangle, 
  User, 
  Calendar,
  FileText,
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
  Play,
  Square
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
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { agileAPI, CreateBugPayload } from "./AgileAPI";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Bug {
  id: number;
  title: string;
  description: string;
  assignee: number;
  priority: string;
  severity: string;
  reproducible: boolean;
  steps_to_reproduce: string;
  expected_behavior: string;
  actual_behavior: string;
  environment: string;
  browser: string;
  os: string;
}

interface BugTrackingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: number;
  projectName: string;
  onBugCreated?: (bug: Bug) => void;
  editingBug?: Bug;
}

interface BugData {
  title: string;
  description: string;
  assignee: number;
  priority: string;
  severity: string;
  reproducible: boolean;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment: string;
  browser: string;
  os: string;
}

const BugTrackingModal = ({ 
  open, 
  onOpenChange, 
  projectId, 
  projectName, 
  onBugCreated,
  editingBug 
}: BugTrackingModalProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const [bugData, setBugData] = useState<BugData>({
    title: '',
    description: '',
    assignee: 0,
    priority: 'Medium',
    severity: 'Medium',
    reproducible: true,
    stepsToReproduce: '',
    expectedBehavior: '',
    actualBehavior: '',
    environment: '',
    browser: '',
    os: ''
  });

  // Load team members when modal opens
  useEffect(() => {
    if (open && projectId) {
      loadTeamMembers();
    }
  }, [open, projectId]);

  // Load editing bug data if provided
  useEffect(() => {
    if (editingBug) {
      setBugData({
        title: editingBug.title || '',
        description: editingBug.description || '',
        assignee: editingBug.assignee || 0,
        priority: editingBug.priority || 'Medium',
        severity: editingBug.severity || 'Medium',
        reproducible: editingBug.reproducible !== undefined ? editingBug.reproducible : true,
        stepsToReproduce: editingBug.steps_to_reproduce || '',
        expectedBehavior: editingBug.expected_behavior || '',
        actualBehavior: editingBug.actual_behavior || '',
        environment: editingBug.environment || '',
        browser: editingBug.browser || '',
        os: editingBug.os || ''
      });
    }
  }, [editingBug]);

  const loadTeamMembers = async () => {
    // Mock team members for now - replace with actual API call
    setTeamMembers([
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'QA Engineer' },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Product Manager' }
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bugData.title || !bugData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const bugPayload: CreateBugPayload = {
        title: bugData.title,
        description: bugData.description,
        project: projectId,
        assignee: bugData.assignee,
        priority: bugData.priority,
        severity: bugData.severity,
        reproducible: bugData.reproducible,
        steps_to_reproduce: bugData.stepsToReproduce
      };

      console.log('Creating bug:', bugPayload);
      const response = await agileAPI.createBug(bugPayload);
      console.log('Bug created successfully:', response);

      toast({
        title: "Success",
        description: response.message || "Bug reported successfully!",
      });

      // Reset form
      setBugData({
        title: '',
        description: '',
        assignee: 0,
        priority: 'Medium',
        severity: 'Medium',
        reproducible: true,
        stepsToReproduce: '',
        expectedBehavior: '',
        actualBehavior: '',
        environment: '',
        browser: '',
        os: ''
      });

      // Call callback if provided
      if (onBugCreated) {
        onBugCreated(response.data || response);
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating bug:', error);
      toast({
        title: "Error",
        description: "Failed to report bug. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const severityOptions = ['Low', 'Medium', 'High', 'Critical'];
  const browserOptions = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'];
  const osOptions = ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Other'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-600';
      case 'High': return 'bg-orange-600';
      case 'Medium': return 'bg-yellow-600';
      case 'Low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl w-[98vw] max-h-[95vh] overflow-hidden p-0 rounded-none border-0 shadow-none [&_.absolute]:text-white [&_.absolute_button]:text-white [&_.absolute_svg]:text-white [&_.absolute_button:hover]:bg-white/20 [&_.absolute_button]:opacity-100 [&_.absolute_button]:hover:opacity-100">
        <div className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl overflow-hidden rounded-none">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-red-600 via-purple-600 to-red-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Bug className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {editingBug ? 'Edit Bug Report' : 'Report New Bug'}
                  </h2>
                  <p className="text-white/90">{projectName}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Bug Report
              </Badge>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="flex h-full">
            {/* Left Side - Bug Report Form */}
            <div className="w-[70%] overflow-y-auto p-8 max-h-[calc(95vh-120px)]">

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Bug Basic Info */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Bug className="w-4 h-4 text-white" />
                  </div>
                  Bug Information
                </h3>
                
                <div className="space-y-3">
                  <Label htmlFor="bug-title" className="text-sm font-semibold text-gray-700">
                    Bug Title *
                  </Label>
                  <div className="relative">
                    <Input
                      id="bug-title"
                      value={bugData.title}
                      onChange={(e) => setBugData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Payment processing fails"
                      className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="bug-description" className="text-sm font-semibold text-gray-700">
                    Description *
                  </Label>
                  <div className="relative">
                    <Textarea
                      id="bug-description"
                      value={bugData.description}
                      onChange={(e) => setBugData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the bug in detail..."
                      className="min-h-[120px] bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      required
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Bug Classification */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  Classification
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="bug-priority" className="text-sm font-semibold text-gray-700">
                      Priority
                    </Label>
                    <div className="relative">
                      <Select
                        value={bugData.priority}
                        onValueChange={(value) => setBugData(prev => ({ ...prev, priority: value }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {priorityOptions.map((priority) => (
                            <SelectItem key={priority} value={priority}>
                              {priority}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="bug-severity" className="text-sm font-semibold text-gray-700">
                      Severity
                    </Label>
                    <div className="relative">
                      <Select
                        value={bugData.severity}
                        onValueChange={(value) => setBugData(prev => ({ ...prev, severity: value }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {severityOptions.map((severity) => (
                            <SelectItem key={severity} value={severity}>
                              {severity}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="bug-assignee" className="text-sm font-semibold text-gray-700">
                      Assignee
                    </Label>
                    <div className="relative">
                      <Select
                        value={bugData.assignee.toString()}
                        onValueChange={(value) => setBugData(prev => ({ ...prev, assignee: parseInt(value) }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select assignee" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          <SelectItem value="0">Unassigned</SelectItem>
                          {teamMembers.map((member) => (
                            <SelectItem key={member.id} value={member.id.toString()}>
                              <div className="flex items-center space-x-2">
                                <span>{member.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {member.role}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reproducibility */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  Reproducibility
                </h3>
                
                <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                  <Checkbox
                    id="reproducible"
                    checked={bugData.reproducible}
                    onCheckedChange={(checked) => setBugData(prev => ({ ...prev, reproducible: checked as boolean }))}
                    className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                  />
                  <Label htmlFor="reproducible" className="text-sm font-semibold text-gray-700">Bug is reproducible</Label>
                </div>
                
                {bugData.reproducible && (
                  <div className="space-y-3">
                    <Label htmlFor="steps-to-reproduce" className="text-sm font-semibold text-gray-700">
                      Steps to Reproduce *
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="steps-to-reproduce"
                        value={bugData.stepsToReproduce}
                        onChange={(e) => setBugData(prev => ({ ...prev, stepsToReproduce: e.target.value }))}
                        placeholder="1. Navigate to the login page&#10;2. Enter invalid credentials&#10;3. Click login button&#10;4. Observe the error..."
                        className="min-h-[120px] bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                        required
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Behavior Details */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  Behavior Details
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="expected-behavior" className="text-sm font-semibold text-gray-700">
                      Expected Behavior
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="expected-behavior"
                        value={bugData.expectedBehavior}
                        onChange={(e) => setBugData(prev => ({ ...prev, expectedBehavior: e.target.value }))}
                        placeholder="Describe what should happen..."
                        className="min-h-[80px] bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="actual-behavior" className="text-sm font-semibold text-gray-700">
                      Actual Behavior
                    </Label>
                    <div className="relative">
                      <Textarea
                        id="actual-behavior"
                        value={bugData.actualBehavior}
                        onChange={(e) => setBugData(prev => ({ ...prev, actualBehavior: e.target.value }))}
                        placeholder="Describe what actually happens..."
                        className="min-h-[80px] bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Environment */}
              <div className="space-y-6">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Square className="w-4 h-4 text-white" />
                  </div>
                  Environment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="environment" className="text-sm font-semibold text-gray-700">
                      Environment
                    </Label>
                    <div className="relative">
                      <Input
                        id="environment"
                        value={bugData.environment}
                        onChange={(e) => setBugData(prev => ({ ...prev, environment: e.target.value }))}
                        placeholder="e.g., Production, Staging, Development"
                        className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 hover:text-gray-900"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="browser" className="text-sm font-semibold text-gray-700">
                      Browser
                    </Label>
                    <div className="relative">
                      <Select
                        value={bugData.browser}
                        onValueChange={(value) => setBugData(prev => ({ ...prev, browser: value }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select browser" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {browserOptions.map((browser) => (
                            <SelectItem key={browser} value={browser}>
                              {browser}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="os" className="text-sm font-semibold text-gray-700">
                      Operating System
                    </Label>
                    <div className="relative">
                      <Select
                        value={bugData.os}
                        onValueChange={(value) => setBugData(prev => ({ ...prev, os: value }))}
                      >
                        <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 hover:border-indigo-300 rounded-xl transition-all duration-200 text-gray-800 hover:text-gray-900">
                          <SelectValue placeholder="Select OS" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-2 border-indigo-200 rounded-xl shadow-lg">
                          {osOptions.map((os) => (
                            <SelectItem key={os} value={os}>
                              {os}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                    </div>
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
                  className="font-semibold transition-all duration-200 rounded-xl bg-gradient-to-r from-red-600 via-purple-600 to-red-500 text-white hover:from-red-700 hover:via-purple-700 hover:to-red-600 shadow-lg hover:shadow-xl px-6 py-3"
                  disabled={isLoading || !bugData.title || !bugData.description || (bugData.reproducible && !bugData.stepsToReproduce)}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Bug className="w-4 h-4 mr-2" />
                  )}
                  {editingBug ? 'Update Bug' : 'Report Bug'}
                </Button>
              </div>
            </form>
          </div>

          {/* Right Side - Bug Preview */}
          <div className="w-[30%] border-l border-gray-200 bg-gradient-to-br from-gray-50 to-red-50 p-8 max-h-[95vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header matching left side structure */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Bug Preview</h2>
                    <p className="text-sm text-muted-foreground">Live Preview</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  Preview
                </Badge>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground truncate">{bugData.title || 'Bug Title'}</h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3 overflow-hidden">
                    {bugData.description || 'Bug description will appear here...'}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {teamMembers.find(m => m.id === bugData.assignee)?.name || 'Unassigned'}
                    </span>
                  </div>
                  <div className="flex space-x-1">
                    <Badge className={`text-xs ${getPriorityColor(bugData.priority)} text-white`}>
                      {bugData.priority}
                    </Badge>
                    <Badge className={`text-xs ${getSeverityColor(bugData.severity)} text-white`}>
                      {bugData.severity}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {bugData.reproducible ? 'Reproducible' : 'Not Reproducible'}
                  </span>
                </div>
                
                {bugData.environment && (
                  <div className="flex items-center space-x-2">
                    <Square className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">{bugData.environment}</span>
                  </div>
                )}
                
                {bugData.browser && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-600">{bugData.browser}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
  );
};

export default BugTrackingModal; 