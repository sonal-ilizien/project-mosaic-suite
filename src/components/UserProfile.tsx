import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { 
  User, 
  Mail, 
  Lock, 
  Shield, 
  Edit, 
  Save, 
  AlertCircle,
  ArrowLeft,
  Building,
  Settings,
  Menu,
  Search,
  Plus,
  Filter
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import apiService from '../services/apiService';
import ProjectSidebar from './ProjectSidebar';
import ViewSelector from './ViewSelector';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import UserProfileDropdown from './UserProfileDropdown';

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Sidebar and layout state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [selectedProjectFromSidebar, setSelectedProjectFromSidebar] = useState<Record<string, unknown> | null>(null);
  const isMobile = useIsMobile();

  // For changing password
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Profile details
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    user_role: 'User',
    organization_name: 'Default Company',
    organization_industry: '',
    organization_size: '',
    date_joined: '',
    email_verified: false,
    permissions: {}
  });

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const user = JSON.parse(userData);
      
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        username: user.username || '',
        user_role: user.role?.name || 'User',
        organization_name: user.organization?.name || 'Ilizien Pvt Ltd.',
        organization_industry: user.organization?.industry || '',
        organization_size: user.organization?.size || '',
        date_joined: user.date_joined || '',
        email_verified: user.email_verified || false,
        permissions: user.role?.permissions || {}
      });
    }
    
    setIsLoading(false);
  }, []);

  // URL parameters handling for tab navigation
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    
    if (tab === 'changePassword') {
      setActiveTab(1);
    } else {
      setActiveTab(0);
    }
  }, [location]);

  const navigateToTab = (tabIndex: number) => {
    setActiveTab(tabIndex);
    const params = new URLSearchParams();
    if (tabIndex === 1) {
      params.set('tab', 'changePassword');
    } else {
      params.delete('tab');
    }
    navigate(`/profile${params.toString() ? `?${params.toString()}` : ''}`, { replace: true });
  };

  // Handle password field changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "error",
      });
      return;
    }
    
    // Show success toast
    toast({
      title: "Password Updated",
      description: "Your password has been updated successfully",
      variant: "success",
    });
    
    setPasswords({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const getInitials = () => {
    const firstName = profileData.first_name || '';
    const lastName = profileData.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
      setMobileSidebarOpen(false);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(!mobileSidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-800"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background relative">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(circle at 20% 80%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)'
          }}
        />
      </div>

      {/* Mobile Overlay */}
      {isMobile && mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        transition-all duration-300 
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-80 max-w-[85vw]` 
          : `${sidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden flex-shrink-0 sticky top-0 h-screen`
        }
      `}>
        <ProjectSidebar 
          activeView="profile" 
          onViewChange={(view) => {
            if (view === 'dashboard') {
              navigate('/');
            }
            if (isMobile) {
              closeMobileSidebar();
            }
          }}
          onProjectSelect={(project) => {
            setSelectedProjectFromSidebar(project);
            if (isMobile) {
              closeMobileSidebar();
            }
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
        />
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Header - Same as ViewSelector but simplified */}
        <div className="bg-background border-b border-border p-3 sm:p-4 flex-shrink-0 sticky top-0 z-50 relative overflow-hidden navbar-morph navbar-particles navbar-orbs navbar-no-blur">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-32 -translate-y-32 float-animation"></div>
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/5 rounded-full translate-x-24 translate-y-24 float-animation" style={{ animationDelay: '2s' }}></div>
          
          {/* Additional animated elements */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: '3s' }}></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 min-w-0 relative z-10">
            {/* Mobile Layout - Hamburger and Search in first row, Action Buttons in second row */}
            <div className="w-full sm:hidden">
              {/* First row - Hamburger and Search */}
              <div className="flex items-center space-x-2 mb-2">
                {toggleSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="hover:bg-primary/20 hover:text-foreground flex-shrink-0 ripple-effect icon-animated text-foreground"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                )}
                
                {/* Search Bar */}
                <div className="relative flex-1 max-w-xs">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, tasks..."
                    className="pl-9 w-full bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
                  />
                </div>
              </div>
              
              {/* Second row - Action Buttons in right corner */}
              <div className="flex items-center justify-end space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover floating-action"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quick Actions</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover"
                    >
                      <Filter className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter Options</p>
                  </TooltipContent>
                </Tooltip>
                
                <UserProfileDropdown />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between w-full">
              {/* Left side - Sidebar Toggle */}
              <div className="flex items-center space-x-2 flex-shrink-0">
                {/* Sidebar Toggle Button for Desktop/Medium when collapsed */}
                {sidebarCollapsed && toggleSidebar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="hover:bg-primary/20 hover:text-foreground flex-shrink-0 text-white/90 hover:text-white"
                  >
                    <Menu className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              {/* Right side - Search and Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Search Bar */}
                <div className="relative hidden md:block">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search projects, tasks..."
                    className="pl-9 w-56 bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1"
                  />
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center space-x-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover floating-action"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Quick Actions</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect magnetic-hover"
                      >
                        <Filter className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filter Options</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <UserProfileDropdown />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
            </div>
            
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-white to-gray-100 shadow-2xl flex items-center justify-center text-indigo-800 text-2xl font-bold ring-4 ring-white/30 backdrop-blur-sm">
                    {getInitials()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {`${profileData.first_name} ${profileData.last_name}`}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/30">
                        <User className="h-4 w-4" />
                        {profileData.username}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/30">
                        <Mail className="h-4 w-4" />
                        {profileData.email}
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 border border-white/30">
                        <Shield className="h-4 w-4" />
                        {profileData.user_role}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
            {/* Navigation Tabs */}
            <div className="flex bg-white/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/50">
              <button
                onClick={() => navigateToTab(0)}
                className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                  activeTab === 0 
                    ? 'text-indigo-800 border-b-2 border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50' 
                    : 'text-gray-600 hover:bg-gray-50/80'
                } transition-all duration-300`}
              >
                <User className={`h-4 w-4 ${activeTab === 0 ? 'text-indigo-800' : 'text-gray-500'}`} />
                <span className="text-sm font-semibold">Profile Information</span>
              </button>
              <button
                onClick={() => navigateToTab(1)}
                className={`flex-1 py-3 px-4 text-center font-medium flex items-center justify-center gap-2 ${
                  activeTab === 1 
                    ? 'text-indigo-800 border-b-2 border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50' 
                    : 'text-gray-600 hover:bg-gray-50/80'
                } transition-all duration-300`}
              >
                <Lock className={`h-4 w-4 ${activeTab === 1 ? 'text-indigo-800' : 'text-gray-500'}`} />
                <span className="text-sm font-semibold">Security Settings</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-white/50">
              {/* Profile Tab */}
              {activeTab === 0 && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <User className="h-4 w-4 text-indigo-800" />
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <User className="h-5 w-5 text-blue-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">First Name</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900">{profileData.first_name}</p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <User className="h-5 w-5 text-purple-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Last Name</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900">{profileData.last_name}</p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Shield className="h-5 w-5 text-green-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Username</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900">{profileData.username}</p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Mail className="h-5 w-5 text-orange-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Email</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-medium text-gray-900">{profileData.email}</p>
                        {profileData.email_verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Shield className="h-5 w-5 text-indigo-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Role</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900">{profileData.user_role}</p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Building className="h-5 w-5 text-teal-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Organization</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900">{profileData.organization_name}</p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <Building className="h-5 w-5 text-violet-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Industry</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900 capitalize">{profileData.organization_industry}</p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-rose-100 rounded-lg">
                          <Building className="h-5 w-5 text-rose-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Organization Size</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900 capitalize">{profileData.organization_size}</p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Settings className="h-5 w-5 text-amber-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Member Since</h3>
                      </div>
                      <p className="text-base font-medium text-gray-900">
                        {profileData.date_joined ? new Date(profileData.date_joined).toLocaleDateString() : 'N/A'}
                      </p>
                    </Card>

                    <Card className="p-4 bg-gradient-to-br from-lime-50 to-green-50 border border-lime-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-lime-100 rounded-lg">
                          <Shield className="h-5 w-5 text-lime-700" />
                        </div>
                        <h3 className="font-semibold text-gray-800">Permissions</h3>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(profileData.permissions).map(([permission, hasPermission]) => (
                          <div key={permission} className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${hasPermission ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm text-gray-700 capitalize">
                              {permission.replace(/_/g, ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === 1 && (
                <div className="p-6">
                  <div className="max-w-md mx-auto">
                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-6 py-6 rounded-t-xl relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_0)] bg-[length:20px_20px]"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-3">
                          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full border border-white/30">
                            <Lock className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <h2 className="text-xl font-bold text-white text-center">Security Center</h2>
                        <p className="text-xs text-white/80 text-center mt-1">
                          Protect your account with a strong, unique password
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-white/95 backdrop-blur-sm px-6 py-6 rounded-b-xl shadow-xl border border-white/50">
                      <div className="space-y-4">
                        <div>
                          <Label className="block text-sm font-semibold text-gray-700 mb-1">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Input
                              type="password"
                              name="currentPassword"
                              value={passwords.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
                              placeholder="Enter current password"
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block text-sm font-semibold text-gray-700 mb-1">
                            New Password
                          </Label>
                          <div className="relative">
                            <Input
                              type="password"
                              name="newPassword"
                              value={passwords.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
                              placeholder="Enter new password"
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <p>Must be at least 8 characters with numbers and special characters.</p>
                          </div>
                        </div>
                        
                        <div>
                          <Label className="block text-sm font-semibold text-gray-700 mb-1">
                            Confirm New Password
                          </Label>
                          <div className="relative">
                            <Input
                              type="password"
                              name="confirmPassword"
                              value={passwords.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition duration-200 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50"
                              placeholder="Confirm new password"
                            />
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        
                        <Button
                          onClick={handlePasswordSubmit}
                          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 text-white py-2 rounded-lg font-semibold shadow-lg transition duration-200 flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          Update Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Expand Button for Desktop */}
      {!isMobile && sidebarCollapsed && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-background hover:bg-primary/20 hover:text-foreground shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default UserProfile; 