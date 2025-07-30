import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Star,
  Award,
  Shield,
  Zap,
  Heart,
  X,
  Clock,
  Video,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { 
  CommonDialog, 
  CommonInput, 
  CommonTextarea, 
  CommonSelect, 
  CommonCheckbox, 
  CommonButton, 
  CommonSectionHeader, 
  CommonFormGrid, 
  CommonFormActions,
  CommonTags
} from "@/components/ui/common-dialog";
import apiService from "../services/apiService";
import { useToast } from "@/hooks/use-toast";

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
  is_default: boolean;
}

interface NewRole {
  name: string;
  description: string;
  permissions: {
    can_invite_users: boolean;
    can_manage_users: boolean;
    can_manage_projects: boolean;
    can_view_all_projects: boolean;
    can_manage_organization: boolean;
    can_review_code: boolean;
  };
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: 'online' | 'offline' | 'away';
  joinDate: string;
  skills: string[];
  performance: number;
  projects: number;
}

const Team = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showScheduleMeetingDialog, setShowScheduleMeetingDialog] = useState(false);
  const [showMemberDetailsDialog, setShowMemberDetailsDialog] = useState(false);
  const [showAddRoleDialog, setShowAddRoleDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [newRole, setNewRole] = useState<NewRole>({
    name: '',
    description: '',
    permissions: {
      can_invite_users: false,
      can_manage_users: false,
      can_manage_projects: false,
      can_view_all_projects: false,
      can_manage_organization: false,
      can_review_code: false
    }
  });
  const [meetingDetails, setMeetingDetails] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30',
    type: 'video',
    description: ''
  });
  const [newMember, setNewMember] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role: '',
    message: 'Welcome to our team! Please join us.'
  });

  // Fetch roles when component mounts
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          throw new Error('User data not found');
        }
        
        const user = JSON.parse(userData);
        const organizationId = user.organization?.id;
        
        if (!organizationId) {
          throw new Error('Organization ID not found');
        }
        
        const response = await apiService.get(`/accounts/roles/?organization=${organizationId}`);
        console.log('Fetched roles:', response); // Debug log
        setRoles(response?.data || []);
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({
          title: "Error",
          description: "Failed to load roles. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [toast]);

  // Handle role creation
  const handleCreateRole = async () => {
    if (!newRole.name.trim()) {
      toast({
        title: "Error",
        description: "Role name is required.",
        variant: "destructive",
      });
      return;
    }

    setCreatingRole(true);
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        throw new Error('User data not found');
      }
      
      const user = JSON.parse(userData);
      const organizationId = user.organization?.id;
      
      if (!organizationId) {
        throw new Error('Organization ID not found');
      }

      const roleData = {
        ...newRole,
        organization: organizationId
      };

      const response = await apiService.post('/accounts/roles/', roleData);
      toast({
        title: "Success",
        description: "Role created successfully!",
        variant: "default",
      });
      
      // Refresh roles list
      const rolesResponse = await apiService.get(`/accounts/roles/?organization=${organizationId}`);
      const updatedRoles = rolesResponse?.data || [];
      setRoles(updatedRoles);
      
      // Auto-select the newly created role
      const createdRole = updatedRoles.find(role => role.name === newRole.name);
      if (createdRole) {
        setNewMember(prev => ({...prev, role: createdRole.name}));
      }
      
      // Reset form and close dialog
      setNewRole({
        name: '',
        description: '',
        permissions: {
          can_invite_users: false,
          can_manage_users: false,
          can_manage_projects: false,
          can_view_all_projects: false,
          can_manage_organization: false,
          can_review_code: false
        }
      });
      setShowAddRoleDialog(false);
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingRole(false);
    }
  };

  // Handle permission toggle
  const handlePermissionToggle = (permission: keyof NewRole['permissions']) => {
    setNewRole(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };



  // Updated Team Members with Indian names and backend/frontend developers and designers
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Priya Sharma',
      role: 'Project Manager',
      email: 'priya.sharma@company.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      avatar: '/avatars/priya.jpg',
      status: 'online',
      joinDate: '2023-01-15',
      skills: ['Agile', 'Scrum', 'Leadership', 'Communication'],
      performance: 95,
      projects: 12
    },
    {
      id: '2',
      name: 'Arjun Patel',
      role: 'Frontend Developer',
      email: 'arjun.patel@company.com',
      phone: '+91 87654 32109',
      location: 'Bangalore, Karnataka',
      avatar: '/avatars/arjun.jpg',
      status: 'online',
      joinDate: '2022-08-20',
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS'],
      performance: 92,
      projects: 8
    },
    {
      id: '3',
      name: 'Ananya Reddy',
      role: 'UI/UX Designer',
      email: 'ananya.reddy@company.com',
      phone: '+91 76543 21098',
      location: 'Hyderabad, Telangana',
      avatar: '/avatars/ananya.jpg',
      status: 'away',
      joinDate: '2023-03-10',
      skills: ['Figma', 'User Research', 'Prototyping', 'UI/UX'],
      performance: 88,
      projects: 6
    },
    {
      id: '4',
      name: 'Rahul Singh',
      role: 'Backend Developer',
      email: 'rahul.singh@company.com',
      phone: '+91 65432 10987',
      location: 'Delhi, NCR',
      avatar: '/avatars/rahul.jpg',
      status: 'online',
      joinDate: '2022-11-05',
      skills: ['Node.js', 'Python', 'PostgreSQL', 'AWS'],
      performance: 90,
      projects: 10
    },
    {
      id: '5',
      name: 'Kavya Iyer',
      role: 'Frontend Developer',
      email: 'kavya.iyer@company.com',
      phone: '+91 54321 09876',
      location: 'Chennai, Tamil Nadu',
      avatar: '/avatars/kavya.jpg',
      status: 'offline',
      joinDate: '2023-06-12',
      skills: ['Vue.js', 'JavaScript', 'CSS3', 'Webpack'],
      performance: 87,
      projects: 9
    }
  ]);

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterRole === 'all' || member.role.toLowerCase().includes(filterRole.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600';
    if (performance >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleAddMember = async () => {
    if (newMember.email && newMember.first_name && newMember.last_name && newMember.role) {
      try {
        // Find the selected role to get its ID
        const selectedRole = roles.find(role => role.name === newMember.role);
        if (!selectedRole) {
          toast({
            title: "Error",
            description: "Please select a valid role.",
            variant: "destructive",
          });
          return;
        }

        const invitationData = {
          email: newMember.email,
          first_name: newMember.first_name,
          last_name: newMember.last_name,
          role: selectedRole.id,
          message: newMember.message
        };

        const response = await apiService.post('/accounts/invitations/', invitationData);
        
        toast({
          title: "Success",
          description: "Team member invitation sent successfully!",
          variant: "default",
        });

        // Reset form
        setNewMember({
          email: '',
          first_name: '',
          last_name: '',
          role: '',
          message: 'Welcome to our team! Please join us.'
        });
        setShowAddMemberDialog(false);
      } catch (error) {
        console.error('Error sending invitation:', error);
        toast({
          title: "Error",
          description: "Failed to send invitation. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
    }
  };

  const availableSkills = [
    'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java',
    'PostgreSQL', 'MongoDB', 'AWS', 'Docker', 'Kubernetes', 'Figma', 'Adobe XD', 'Sketch',
    'User Research', 'Prototyping', 'UI/UX', 'Agile', 'Scrum', 'Leadership', 'Communication'
  ];

  const handleScheduleMeeting = (member: TeamMember) => {
    setSelectedMember(member);
    setMeetingDetails({
      title: `Meeting with ${member.name}`,
      date: '',
      time: '',
      duration: '30',
      type: 'video',
      description: ''
    });
    setShowScheduleMeetingDialog(true);
  };

  const handleCreateMeeting = () => {
    if (meetingDetails.title && meetingDetails.date && meetingDetails.time) {
      // Here you would typically send this to your backend
      console.log('Meeting scheduled:', {
        member: selectedMember,
        meeting: meetingDetails
      });
      
      // Show success message (you can add a toast notification here)
      alert(`Meeting scheduled with ${selectedMember?.name} on ${meetingDetails.date} at ${meetingDetails.time}`);
      
      setShowScheduleMeetingDialog(false);
      setSelectedMember(null);
      setMeetingDetails({
        title: '',
        date: '',
        time: '',
        duration: '30',
        type: 'video',
        description: ''
      });
    }
  };

  const handleOpenMemberDetails = (member: TeamMember) => {
    setSelectedMember(member);
    setShowMemberDetailsDialog(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage your team members and their roles</p>
        </div>
        <Button 
          onClick={() => setShowAddMemberDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>

        <CommonDialog
          open={showAddMemberDialog}
          onOpenChange={setShowAddMemberDialog}
          title="Add New Team Member"
          subtitle="Fill in the details to add a new team member to your project. Fields marked with * are required."
          icon={UserPlus}
          maxWidth="max-w-7xl"
        >
                      <div className="space-y-8">
              {/* Personal Information Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <CommonSectionHeader title="Personal Information" icon={Users} />
                  <CommonButton
                    onClick={() => setShowAddRoleDialog(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Role
                  </CommonButton>
                </div>
                <CommonFormGrid cols={2}>
                  <CommonInput
                    id="first_name"
                    label="First Name"
                    value={newMember.first_name}
                    onChange={(value) => setNewMember({...newMember, first_name: value})}
                    placeholder="Enter first name"
                    required
                  />
                  <CommonInput
                    id="last_name"
                    label="Last Name"
                    value={newMember.last_name}
                    onChange={(value) => setNewMember({...newMember, last_name: value})}
                    placeholder="Enter last name"
                    required
                  />
                </CommonFormGrid>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <CommonSectionHeader title="Contact Information" icon={Mail} />
                <CommonFormGrid cols={2}>
                  <CommonInput
                    id="email"
                    label="Email Address"
                    value={newMember.email}
                    onChange={(value) => setNewMember({...newMember, email: value})}
                    placeholder="email@company.com"
                    type="email"
                    required
                  />
                  <CommonSelect
                    id="role"
                    label="Role"
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({...newMember, role: value})}
                    placeholder={loadingRoles ? "Loading roles..." : "Select role"}
                    required
                    disabled={loadingRoles}
                    options={
                      loadingRoles 
                        ? [{ value: "", label: "Loading roles..." }]
                        : roles.length === 0 
                          ? [{ value: "", label: "No roles available" }]
                          : roles.map(role => ({ value: role.name, label: role.name }))
                    }
                  />
                </CommonFormGrid>
              </div>

              {/* Message Section */}
              <div className="space-y-6">
                <CommonSectionHeader title="Invitation Message" icon={Mail} />
                <CommonTextarea
                  id="message"
                  label="Welcome Message"
                  value={newMember.message}
                  onChange={(value) => setNewMember({...newMember, message: value})}
                  placeholder="Enter a welcome message for the new team member..."
                  rows={4}
                />
              </div>
            </div>

          <CommonFormActions>
            <div className="flex items-center justify-between w-full">
              <p className="text-sm text-gray-600">
                {newMember.email && newMember.first_name && newMember.last_name && newMember.role ? 'Ready to send invitation' : 'Please fill in required fields'}
              </p>
              <div className="flex items-center gap-3">
                <CommonButton
                  variant="outline"
                  onClick={() => setShowAddMemberDialog(false)}
                >
                  Cancel
                </CommonButton>
                <CommonButton
                  onClick={handleAddMember}
                  disabled={!newMember.email || !newMember.first_name || !newMember.last_name || !newMember.role}
                >
                  Send Invitation
                </CommonButton>
              </div>
            </div>
          </CommonFormActions>
        </CommonDialog>

        {/* Schedule Meeting Dialog */}
        <Dialog open={showScheduleMeetingDialog} onOpenChange={setShowScheduleMeetingDialog}>
          <DialogContent className="w-full max-w-6xl h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-foreground">Schedule Meeting</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Schedule a meeting with {selectedMember?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              {/* Meeting Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Meeting Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-title" className="text-sm font-medium text-foreground">
                      Meeting Title *
                    </Label>
                    <Input
                      id="meeting-title"
                      value={meetingDetails.title}
                      onChange={(e) => setMeetingDetails({...meetingDetails, title: e.target.value})}
                      placeholder="Enter meeting title"
                      className="h-11 border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-type" className="text-sm font-medium text-foreground">
                      Meeting Type
                    </Label>
                    <Select value={meetingDetails.type} onValueChange={(value) => setMeetingDetails({...meetingDetails, type: value})}>
                      <SelectTrigger className="h-11 border-2 focus:border-primary transition-colors">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="audio">Audio Call</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-date" className="text-sm font-medium text-foreground">
                      Date *
                    </Label>
                    <Input
                      id="meeting-date"
                      type="date"
                      value={meetingDetails.date}
                      onChange={(e) => setMeetingDetails({...meetingDetails, date: e.target.value})}
                      className="h-11 border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time" className="text-sm font-medium text-foreground">
                      Time *
                    </Label>
                    <Input
                      id="meeting-time"
                      type="time"
                      value={meetingDetails.time}
                      onChange={(e) => setMeetingDetails({...meetingDetails, time: e.target.value})}
                      className="h-11 border-2 focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="meeting-duration" className="text-sm font-medium text-foreground">
                      Duration
                    </Label>
                    <Select value={meetingDetails.duration} onValueChange={(value) => setMeetingDetails({...meetingDetails, duration: value})}>
                      <SelectTrigger className="h-11 border-2 focus:border-primary transition-colors">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meeting-description" className="text-sm font-medium text-foreground">
                    Description
                  </Label>
                  <textarea
                    id="meeting-description"
                    value={meetingDetails.description}
                    onChange={(e) => setMeetingDetails({...meetingDetails, description: e.target.value})}
                    placeholder="Enter meeting description or agenda..."
                    className="w-full h-24 p-3 border-2 border-input rounded-md focus:border-primary transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Team Member Info */}
              {selectedMember && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Team Member</h3>
                  <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-foreground">{selectedMember.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedMember.role}</p>
                      <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="pt-6 border-t border-border">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-muted-foreground">
                  {meetingDetails.title && meetingDetails.date && meetingDetails.time ? 'Ready to schedule meeting' : 'Please fill in required fields'}
                </p>
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowScheduleMeetingDialog(false)}
                    className="px-6 py-2"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreateMeeting} 
                    disabled={!meetingDetails.title || !meetingDetails.date || !meetingDetails.time}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meeting
                  </Button>
                </div>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Team Member Details Dialog */}
        <Dialog open={showMemberDetailsDialog} onOpenChange={setShowMemberDetailsDialog}>
          <DialogContent className="w-full max-w-4xl h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-2xl font-bold text-foreground">Team Member Details</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Detailed information about {selectedMember?.name}
              </DialogDescription>
            </DialogHeader>
            {selectedMember && (
              <div className="space-y-6 py-6">
                {/* Header with Avatar and Basic Info */}
                <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-white ${getStatusColor(selectedMember.status)}`} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-foreground">{selectedMember.name}</h2>
                    <p className="text-xl text-muted-foreground">{selectedMember.role}</p>
                    <p className="text-lg text-primary">{selectedMember.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="outline" className="text-sm">
                        {selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        Joined {new Date(selectedMember.joinDate).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{selectedMember.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{selectedMember.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{selectedMember.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Performance</span>
                          <span className={`text-sm font-bold ${getPerformanceColor(selectedMember.performance)}`}>
                            {selectedMember.performance}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${selectedMember.performance >= 90 ? 'bg-green-500' : selectedMember.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${selectedMember.performance}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{selectedMember.projects}</p>
                          <p className="text-sm text-muted-foreground">Active Projects</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{selectedMember.skills.length}</p>
                          <p className="text-sm text-muted-foreground">Skills</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Skills & Expertise</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMember.skills.map((skill, index) => (
                      <Badge key={index} variant="default" className="text-sm px-3 py-1">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed project milestone</span>
                      <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Attended team meeting</span>
                      <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Updated project documentation</span>
                      <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground border-b pb-2">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                      onClick={() => {
                        setShowMemberDetailsDialog(false);
                        handleScheduleMeeting(selectedMember);
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Meeting</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Email</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Call</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center space-x-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Video Call</span>
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={() => setShowMemberDetailsDialog(false)}
                className="px-6 py-2"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Total Members</span>
            </div>
            <p className="text-2xl font-bold text-blue-800 mt-1">{teamMembers.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-700">Active Projects</span>
            </div>
            <p className="text-2xl font-bold text-green-800 mt-1">
              {teamMembers.reduce((sum, member) => sum + member.projects, 0)}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">Avg Performance</span>
            </div>
            <p className="text-2xl font-bold text-purple-800 mt-1">
              {Math.round(teamMembers.reduce((sum, member) => sum + member.performance, 0) / teamMembers.length)}%
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-700">Online Now</span>
            </div>
            <p className="text-2xl font-bold text-orange-800 mt-1">
              {teamMembers.filter(member => member.status === 'online').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={filterRole === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterRole('all')}
          >
            All Roles
          </Button>
          <Button
            variant={filterRole === 'developer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterRole('developer')}
          >
            Developers
          </Button>
          <Button
            variant={filterRole === 'designer' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterRole('designer')}
          >
            Designers
          </Button>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <Card 
            key={member.id} 
            className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-2 hover:border-primary/20 cursor-pointer"
            onClick={() => handleOpenMemberDetails(member)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleScheduleMeeting(member)}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Meeting
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.location}</span>
                </div>
              </div>

              {/* Performance */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Performance</span>
                <span className={`text-sm font-bold ${getPerformanceColor(member.performance)}`}>
                  {member.performance}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${member.performance >= 90 ? 'bg-green-500' : member.performance >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${member.performance}%` }}
                />
              </div>

              {/* Skills */}
              <div>
                <span className="text-sm font-medium">Skills</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {member.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {member.skills.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{member.skills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{member.projects}</p>
                  <p className="text-xs text-muted-foreground">Projects</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{member.joinDate.split('-')[0]}</p>
                  <p className="text-xs text-muted-foreground">Joined</p>
                </div>
                <div className="text-center">
                  <Heart className="w-4 h-4 text-red-500 mx-auto" />
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No team members found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Add New Role Dialog */}
      <CommonDialog
        open={showAddRoleDialog}
        onOpenChange={setShowAddRoleDialog}
        title="Create New Role"
        subtitle="Create a new role with specific permissions for your organization."
        icon={Shield}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-8">
          {/* Role Name */}
          <CommonInput
            id="roleName"
            label="Role Name"
            value={newRole.name}
            onChange={(value) => setNewRole({...newRole, name: value})}
            placeholder="e.g., Senior Developer"
            required
          />

          {/* Role Description */}
          <CommonTextarea
            id="roleDescription"
            label="Description"
            value={newRole.description}
            onChange={(value) => setNewRole({...newRole, description: value})}
            placeholder="Describe the role and its responsibilities..."
            required
            rows={4}
          />

          {/* Permissions */}
          <div className="space-y-6">
            <CommonSectionHeader title="Permissions" icon={Shield} />
            <CommonFormGrid cols={2}>
              <CommonCheckbox
                id="can_invite_users"
                label="Can Invite Users"
                checked={newRole.permissions.can_invite_users}
                onCheckedChange={() => handlePermissionToggle('can_invite_users')}
              />
              
              <CommonCheckbox
                id="can_manage_users"
                label="Can Manage Users"
                checked={newRole.permissions.can_manage_users}
                onCheckedChange={() => handlePermissionToggle('can_manage_users')}
              />
              
              <CommonCheckbox
                id="can_manage_projects"
                label="Can Manage Projects"
                checked={newRole.permissions.can_manage_projects}
                onCheckedChange={() => handlePermissionToggle('can_manage_projects')}
              />
              
              <CommonCheckbox
                id="can_view_all_projects"
                label="Can View All Projects"
                checked={newRole.permissions.can_view_all_projects}
                onCheckedChange={() => handlePermissionToggle('can_view_all_projects')}
              />
              
              <CommonCheckbox
                id="can_manage_organization"
                label="Can Manage Organization"
                checked={newRole.permissions.can_manage_organization}
                onCheckedChange={() => handlePermissionToggle('can_manage_organization')}
              />
              
              <CommonCheckbox
                id="can_review_code"
                label="Can Review Code"
                checked={newRole.permissions.can_review_code}
                onCheckedChange={() => handlePermissionToggle('can_review_code')}
              />
            </CommonFormGrid>
          </div>
        </div>

        <CommonFormActions>
          <div className="flex items-center justify-between w-full">
            <p className="text-sm text-gray-600">
              {newRole.name.trim() ? 'Ready to create role' : 'Please enter a role name'}
            </p>
            <div className="flex items-center gap-3">
              <CommonButton
                variant="outline"
                onClick={() => setShowAddRoleDialog(false)}
                disabled={creatingRole}
              >
                Cancel
              </CommonButton>
              <CommonButton
                onClick={handleCreateRole}
                disabled={creatingRole || !newRole.name.trim()}
                loading={creatingRole}
              >
                {creatingRole ? "Creating..." : "Create Role"}
              </CommonButton>
            </div>
          </div>
        </CommonFormActions>
      </CommonDialog>
    </div>
  );
};

export default Team; 