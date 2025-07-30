import { useState } from "react";
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  MessageSquare,
  Video,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Crown,
  Star,
  Award,
  Activity,
  BarChart3,
  FileText,
  Code,
  Palette,
  Database,
  Globe,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

interface ProjectTeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
  joinDate: string;
  performance: number;
  tasksCompleted: number;
  totalTasks: number;
  hoursWorked: number;
  skills: string[];
  contributions: string[];
  recentActivity: {
    action: string;
    timestamp: string;
    description: string;
  }[];
  projectRole: 'lead' | 'developer' | 'designer' | 'tester' | 'analyst' | 'manager';
  expertise: string[];
  availability: 'full-time' | 'part-time' | 'contract';
  timezone: string;
}

interface ProjectTeamProps {
  projectId: number;
  projectName: string;
}

const ProjectTeam = ({ projectId, projectName }: ProjectTeamProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMember, setSelectedMember] = useState<ProjectTeamMember | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showVideoCallModal, setShowVideoCallModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Mock data for project team members
  const mockTeamMembers: ProjectTeamMember[] = [
    {
      id: '1',
      name: 'Jane Smith',
      role: 'Project Manager',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      avatar: '',
      status: 'online',
      joinDate: '2024-01-01',
      performance: 95,
      tasksCompleted: 12,
      totalTasks: 15,
      hoursWorked: 120,
      skills: ['Project Management', 'Agile', 'Scrum', 'Budget Planning', 'Risk Management'],
      contributions: ['Led budget planning sessions', 'Coordinated team meetings', 'Created project timeline'],
      recentActivity: [
        { action: 'Completed', timestamp: '2 hours ago', description: 'Budget review meeting' },
        { action: 'Updated', timestamp: '1 day ago', description: 'Project timeline' },
        { action: 'Created', timestamp: '3 days ago', description: 'Team meeting agenda' }
      ],
      projectRole: 'manager',
      expertise: ['Leadership', 'Communication', 'Strategic Planning'],
      availability: 'full-time',
      timezone: 'EST'
    },
    {
      id: '2',
      name: 'John Doe',
      role: 'Senior Developer',
      email: 'john.doe@company.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      avatar: '',
      status: 'busy',
      joinDate: '2024-01-05',
      performance: 88,
      tasksCompleted: 8,
      totalTasks: 10,
      hoursWorked: 95,
      skills: ['React', 'TypeScript', 'Node.js', 'Database Design', 'API Development'],
      contributions: ['Built budget tracking system', 'Implemented data validation', 'Created API endpoints'],
      recentActivity: [
        { action: 'Completed', timestamp: '4 hours ago', description: 'Budget API integration' },
        { action: 'Updated', timestamp: '2 days ago', description: 'Database schema' },
        { action: 'Created', timestamp: '1 week ago', description: 'Frontend components' }
      ],
      projectRole: 'developer',
      expertise: ['Full-Stack Development', 'System Architecture', 'Code Review'],
      availability: 'full-time',
      timezone: 'PST'
    },
    {
      id: '3',
      name: 'Alice Johnson',
      role: 'UI/UX Designer',
      email: 'alice.johnson@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Austin, TX',
      avatar: '',
      status: 'online',
      joinDate: '2024-01-03',
      performance: 92,
      tasksCompleted: 6,
      totalTasks: 7,
      hoursWorked: 85,
      skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
      contributions: ['Designed budget dashboard', 'Created user interface mockups', 'Conducted user testing'],
      recentActivity: [
        { action: 'Completed', timestamp: '1 hour ago', description: 'Dashboard design review' },
        { action: 'Updated', timestamp: '1 day ago', description: 'User interface mockups' },
        { action: 'Created', timestamp: '3 days ago', description: 'Design system components' }
      ],
      projectRole: 'designer',
      expertise: ['Visual Design', 'User Experience', 'Design Systems'],
      availability: 'full-time',
      timezone: 'CST'
    },
    {
      id: '4',
      name: 'Bob Wilson',
      role: 'Backend Developer',
      email: 'bob.wilson@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      avatar: '',
      status: 'away',
      joinDate: '2024-01-07',
      performance: 85,
      tasksCompleted: 7,
      totalTasks: 9,
      hoursWorked: 78,
      skills: ['Python', 'Django', 'PostgreSQL', 'AWS', 'Docker'],
      contributions: ['Developed backend APIs', 'Set up database infrastructure', 'Implemented security features'],
      recentActivity: [
        { action: 'Completed', timestamp: '6 hours ago', description: 'API security implementation' },
        { action: 'Updated', timestamp: '2 days ago', description: 'Database optimization' },
        { action: 'Created', timestamp: '1 week ago', description: 'Backend API structure' }
      ],
      projectRole: 'developer',
      expertise: ['Backend Development', 'Database Design', 'DevOps'],
      availability: 'full-time',
      timezone: 'PST'
    },
    {
      id: '5',
      name: 'Sarah Chen',
      role: 'QA Engineer',
      email: 'sarah.chen@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Boston, MA',
      avatar: '',
      status: 'online',
      joinDate: '2024-01-10',
      performance: 90,
      tasksCompleted: 5,
      totalTasks: 6,
      hoursWorked: 65,
      skills: ['Selenium', 'Jest', 'Cypress', 'Test Planning', 'Bug Tracking'],
      contributions: ['Created test plans', 'Automated test scripts', 'Conducted user acceptance testing'],
      recentActivity: [
        { action: 'Completed', timestamp: '3 hours ago', description: 'Automated test suite' },
        { action: 'Updated', timestamp: '1 day ago', description: 'Test documentation' },
        { action: 'Created', timestamp: '4 days ago', description: 'Test cases for budget module' }
      ],
      projectRole: 'tester',
      expertise: ['Test Automation', 'Quality Assurance', 'Performance Testing'],
      availability: 'full-time',
      timezone: 'EST'
    },
    {
      id: '6',
      name: 'Mike Brown',
      role: 'Business Analyst',
      email: 'mike.brown@company.com',
      phone: '+1 (555) 678-9012',
      location: 'Chicago, IL',
      avatar: '',
      status: 'offline',
      joinDate: '2024-01-02',
      performance: 87,
      tasksCompleted: 4,
      totalTasks: 5,
      hoursWorked: 72,
      skills: ['Requirements Analysis', 'Data Analysis', 'Process Modeling', 'Stakeholder Management'],
      contributions: ['Analyzed business requirements', 'Created process flows', 'Gathered stakeholder feedback'],
      recentActivity: [
        { action: 'Completed', timestamp: '5 hours ago', description: 'Requirements documentation' },
        { action: 'Updated', timestamp: '2 days ago', description: 'Process flow diagrams' },
        { action: 'Created', timestamp: '1 week ago', description: 'Business requirements spec' }
      ],
      projectRole: 'analyst',
      expertise: ['Business Analysis', 'Data Analysis', 'Process Improvement'],
      availability: 'part-time',
      timezone: 'CST'
    }
  ];

  const [teamMembers, setTeamMembers] = useState<ProjectTeamMember[]>(mockTeamMembers);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'away':
        return 'bg-orange-500';
      case 'offline':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'manager':
        return <Crown className="w-4 h-4" />;
      case 'developer':
        return <Code className="w-4 h-4" />;
      case 'designer':
        return <Palette className="w-4 h-4" />;
      case 'tester':
        return <Shield className="w-4 h-4" />;
      case 'analyst':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'manager':
        return 'text-purple-600 bg-purple-50';
      case 'developer':
        return 'text-blue-600 bg-blue-50';
      case 'designer':
        return 'text-pink-600 bg-pink-50';
      case 'tester':
        return 'text-green-600 bg-green-50';
      case 'analyst':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-blue-600';
    if (performance >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesRole = filterRole === 'all' || member.projectRole === filterRole;
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleMemberClick = (member: ProjectTeamMember) => {
    setSelectedMember(member);
    setShowMemberDetails(true);
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleMessage = (member: ProjectTeamMember) => {
    setSelectedMember(member);
    setShowMessageModal(true);
  };

  const handleVideoCall = (member: ProjectTeamMember) => {
    setSelectedMember(member);
    setShowVideoCallModal(true);
  };

  const handleScheduleMeeting = (member: ProjectTeamMember) => {
    setSelectedMember(member);
    setShowScheduleModal(true);
  };

  const handleBulkAction = (action: string) => {
    if (selectedMember) {
      alert(`${action} action performed for ${selectedMember.name}`);
    }
  };

  const totalTasks = teamMembers.reduce((acc, member) => acc + member.totalTasks, 0);
  const completedTasks = teamMembers.reduce((acc, member) => acc + member.tasksCompleted, 0);
  const totalHours = teamMembers.reduce((acc, member) => acc + member.hoursWorked, 0);
  const avgPerformance = Math.round(teamMembers.reduce((acc, member) => acc + member.performance, 0) / teamMembers.length);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Team Members</div>
              <div className="text-2xl font-bold text-foreground">{teamMembers.length}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tasks Completed</div>
              <div className="text-2xl font-bold text-foreground">{completedTasks}/{totalTasks}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Hours Worked</div>
              <div className="text-2xl font-bold text-foreground">{totalHours}h</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Avg Performance</div>
              <div className="text-2xl font-bold text-foreground">{avgPerformance}%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Role
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterRole('all')}>All Roles</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('manager')}>Managers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('developer')}>Developers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('designer')}>Designers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('tester')}>Testers</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterRole('analyst')}>Analysts</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('online')}>Online</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('busy')}>Busy</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('away')}>Away</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('offline')}>Offline</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800"
            onClick={handleAddMember}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {/* Team Members Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleMemberClick(member)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge className={getRoleColor(member.projectRole)}>
                  {getRoleIcon(member.projectRole)}
                  <span className="ml-1">{member.projectRole}</span>
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Performance</span>
                  <span className={`text-sm font-bold ${getPerformanceColor(member.performance)}`}>
                    {member.performance}%
                  </span>
                </div>
                <Progress value={member.performance} className="h-2" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tasks:</span>
                    <span className="font-medium ml-1">{member.tasksCompleted}/{member.totalTasks}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hours:</span>
                    <span className="font-medium ml-1">{member.hoursWorked}h</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {member.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.skills.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{member.location}</span>
                  <span>{member.timezone}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMembers.map((member) => (
            <Card 
              key={member.id} 
              className="p-6 hover:bg-gray-50 transition-all duration-300 cursor-pointer"
              onClick={() => handleMemberClick(member)}
            >
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleColor(member.projectRole)}>
                        {getRoleIcon(member.projectRole)}
                        <span className="ml-1">{member.projectRole}</span>
                      </Badge>
                      <span className={`text-sm font-bold ${getPerformanceColor(member.performance)}`}>
                        {member.performance}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                    <span>{member.email}</span>
                    <span>{member.location}</span>
                    <span>{member.timezone}</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm mt-2">
                    <span>Tasks: {member.tasksCompleted}/{member.totalTasks}</span>
                    <span>Hours: {member.hoursWorked}h</span>
                    <span>Availability: {member.availability}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {member.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {member.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{member.skills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleMessage(member)}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Send Message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleVideoCall(member)}
                        >
                          <Video className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Video Call</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleScheduleMeeting(member)}
                        >
                          <CalendarIcon className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schedule Meeting</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Team Performance Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Team Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">{avgPerformance}%</div>
            <div className="text-sm text-muted-foreground">Average Performance</div>
            <Progress value={avgPerformance} className="mt-2" />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {Math.round((completedTasks / totalTasks) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">Task Completion Rate</div>
            <Progress value={(completedTasks / totalTasks) * 100} className="mt-2" />
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">{totalHours}h</div>
            <div className="text-sm text-muted-foreground">Total Hours Worked</div>
            <div className="text-xs text-muted-foreground mt-1">
              Avg: {Math.round(totalHours / teamMembers.length)}h per member
            </div>
          </div>
                 </div>
       </Card>

       {/* Member Details Modal */}
       {showMemberDetails && selectedMember && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center space-x-4">
                   <Avatar className="w-16 h-16">
                     <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                       {selectedMember.name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <h2 className="text-2xl font-bold text-foreground">{selectedMember.name}</h2>
                     <p className="text-lg text-muted-foreground">{selectedMember.role}</p>
                     <Badge className={getRoleColor(selectedMember.projectRole)}>
                       {getRoleIcon(selectedMember.projectRole)}
                       <span className="ml-1">{selectedMember.projectRole}</span>
                     </Badge>
                   </div>
                 </div>
                 <Button variant="ghost" onClick={() => setShowMemberDetails(false)}>
                   ✕
                 </Button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                   <h3 className="font-semibold text-foreground">Contact Information</h3>
                   <div className="space-y-3">
                     <div className="flex items-center space-x-3">
                       <Mail className="w-5 h-5 text-muted-foreground" />
                       <span>{selectedMember.email}</span>
                     </div>
                     <div className="flex items-center space-x-3">
                       <Phone className="w-5 h-5 text-muted-foreground" />
                       <span>{selectedMember.phone}</span>
                     </div>
                     <div className="flex items-center space-x-3">
                       <MapPin className="w-5 h-5 text-muted-foreground" />
                       <span>{selectedMember.location}</span>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h3 className="font-semibold text-foreground">Performance Metrics</h3>
                   <div className="space-y-4">
                     <div>
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-sm font-medium">Performance</span>
                         <span className={`text-sm font-bold ${getPerformanceColor(selectedMember.performance)}`}>
                           {selectedMember.performance}%
                         </span>
                       </div>
                       <Progress value={selectedMember.performance} className="h-2" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="text-center p-3 bg-blue-50 rounded-lg">
                         <p className="text-2xl font-bold text-blue-600">{selectedMember.tasksCompleted}/{selectedMember.totalTasks}</p>
                         <p className="text-sm text-muted-foreground">Tasks</p>
                       </div>
                       <div className="text-center p-3 bg-green-50 rounded-lg">
                         <p className="text-2xl font-bold text-green-600">{selectedMember.hoursWorked}h</p>
                         <p className="text-sm text-muted-foreground">Hours</p>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="mt-6">
                 <h3 className="font-semibold text-foreground mb-3">Skills & Expertise</h3>
                 <div className="flex flex-wrap gap-2">
                   {selectedMember.skills.map((skill, index) => (
                     <Badge key={index} variant="secondary">
                       {skill}
                     </Badge>
                   ))}
                 </div>
               </div>

               <div className="mt-6">
                 <h3 className="font-semibold text-foreground mb-3">Recent Activity</h3>
                 <div className="space-y-3">
                   {selectedMember.recentActivity.map((activity, index) => (
                     <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                       <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                       <div className="flex-1">
                         <span className="text-sm font-medium">{activity.action}: </span>
                         <span className="text-sm">{activity.description}</span>
                         <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                 <Button variant="outline" onClick={() => setShowMemberDetails(false)}>
                   Close
                 </Button>
                 <Button onClick={() => handleMessage(selectedMember)}>
                   <MessageSquare className="w-4 h-4 mr-2" />
                   Send Message
                 </Button>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Add Member Modal */}
       {showAddMemberModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-foreground">Add Team Member</h2>
                 <Button variant="ghost" onClick={() => setShowAddMemberModal(false)}>
                   ✕
                 </Button>
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                   <Input placeholder="Enter member name..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                   <select className="w-full p-3 border rounded-lg">
                     <option value="">Select role...</option>
                     <option value="manager">Project Manager</option>
                     <option value="developer">Developer</option>
                     <option value="designer">Designer</option>
                     <option value="tester">QA Engineer</option>
                     <option value="analyst">Business Analyst</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                   <Input placeholder="Enter email address..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                   <Input placeholder="Enter phone number..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                   <Input placeholder="Enter location..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
                   <Input placeholder="Enter skills separated by commas..." />
                 </div>

                 <div className="flex justify-end space-x-3 pt-6 border-t">
                   <Button variant="outline" onClick={() => setShowAddMemberModal(false)}>
                     Cancel
                   </Button>
                   <Button onClick={() => {
                     alert('Team member added successfully!');
                     setShowAddMemberModal(false);
                   }}>
                     Add Member
                   </Button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Message Modal */}
       {showMessageModal && selectedMember && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-foreground">Send Message</h2>
                 <Button variant="ghost" onClick={() => setShowMessageModal(false)}>
                   ✕
                 </Button>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                   <Avatar className="w-10 h-10">
                     <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                       {selectedMember.name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-medium">{selectedMember.name}</p>
                     <p className="text-sm text-muted-foreground">{selectedMember.role}</p>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                   <Input placeholder="Enter message subject..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                   <textarea 
                     className="w-full p-3 border rounded-lg resize-none"
                     rows={5}
                     placeholder="Enter your message..."
                   />
                 </div>

                 <div className="flex justify-end space-x-3 pt-6 border-t">
                   <Button variant="outline" onClick={() => setShowMessageModal(false)}>
                     Cancel
                   </Button>
                   <Button onClick={() => {
                     alert('Message sent successfully!');
                     setShowMessageModal(false);
                   }}>
                     Send Message
                   </Button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Video Call Modal */}
       {showVideoCallModal && selectedMember && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-foreground">Video Call</h2>
                 <Button variant="ghost" onClick={() => setShowVideoCallModal(false)}>
                   ✕
                 </Button>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                   <Avatar className="w-10 h-10">
                     <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                       {selectedMember.name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-medium">{selectedMember.name}</p>
                     <p className="text-sm text-muted-foreground">{selectedMember.role}</p>
                   </div>
                 </div>

                 <div className="text-center p-8 bg-gray-50 rounded-lg">
                   <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                   <p className="text-muted-foreground">Video call interface would be displayed here</p>
                 </div>

                 <div className="flex justify-end space-x-3 pt-6 border-t">
                   <Button variant="outline" onClick={() => setShowVideoCallModal(false)}>
                     Cancel
                   </Button>
                   <Button onClick={() => {
                     alert('Video call initiated!');
                     setShowVideoCallModal(false);
                   }}>
                     Start Call
                   </Button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Schedule Meeting Modal */}
       {showScheduleModal && selectedMember && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
             <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-foreground">Schedule Meeting</h2>
                 <Button variant="ghost" onClick={() => setShowScheduleModal(false)}>
                   ✕
                 </Button>
               </div>

               <div className="space-y-4">
                 <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                   <Avatar className="w-10 h-10">
                     <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                     <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                       {selectedMember.name.split(' ').map(n => n[0]).join('')}
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-medium">{selectedMember.name}</p>
                     <p className="text-sm text-muted-foreground">{selectedMember.role}</p>
                   </div>
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Meeting Title</label>
                   <Input placeholder="Enter meeting title..." />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                   <Input type="date" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Time</label>
                   <Input type="time" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Duration</label>
                   <select className="w-full p-3 border rounded-lg">
                     <option value="30">30 minutes</option>
                     <option value="60">1 hour</option>
                     <option value="90">1.5 hours</option>
                     <option value="120">2 hours</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                   <textarea 
                     className="w-full p-3 border rounded-lg resize-none"
                     rows={3}
                     placeholder="Enter meeting description..."
                   />
                 </div>

                 <div className="flex justify-end space-x-3 pt-6 border-t">
                   <Button variant="outline" onClick={() => setShowScheduleModal(false)}>
                     Cancel
                   </Button>
                   <Button onClick={() => {
                     alert('Meeting scheduled successfully!');
                     setShowScheduleModal(false);
                   }}>
                     Schedule Meeting
                   </Button>
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

 export default ProjectTeam; 