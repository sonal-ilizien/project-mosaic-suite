import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { 
  User, 
  Lock, 
  LogOut, 
  Bell, 
  ChevronUp,
  Settings,
  Mail
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import apiService from '../services/apiService';

const UserProfileDropdown = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  // Get user data from localStorage
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  const getInitials = () => {
    if (user) {
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return 'U';
  };

  const getUserName = () => {
    if (user) {
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      return `${firstName} ${lastName}`.trim() || 'User';
    }
    return 'User';
  };

  const getUserEmail = () => {
    if (user) {
      return user.email || 'user@example.com';
    }
    return 'user@example.com';
  };

  const getUserRole = () => {
    if (user) {
      return user.role?.name || 'User';
    }
    return 'User';
  };

  const handleLogout = async () => {
    try {
      // Clear tokens and user data
      apiService.clearToken();
      localStorage.removeItem('user');
      localStorage.removeItem('userCompany');

      // Show success toast
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
        variant: "success",
      });

      // Redirect to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout Error",
        description: "There was an error during logout.",
        variant: "error",
      });
    }
  };

  const handleProfileClick = () => {
    // Navigate to profile page or open profile modal
    navigate('/profile');
  };

  const handleChangePassword = () => {
    // Navigate to change password page or open modal
    navigate('/profile?tab=changePassword');
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Notification Bell */}
      <div className="relative p-1">
        <Button
          variant="outline"
          size="sm"
          className="relative border-border text-foreground hover:bg-accent hover:text-accent-foreground ripple-effect"
        >
          <Bell className="w-4 h-4" />
        </Button>
        <Badge 
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center border-2 border-white shadow-sm"
        >
          9+
        </Badge>
      </div>

      {/* User Profile Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 hover:bg-accent hover:text-accent-foreground p-2 rounded-lg transition-all duration-200"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold text-sm">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:flex items-center space-x-1">
              <span className="text-sm font-medium text-foreground">
                {getUserName()}
              </span>
              <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-64 p-2 bg-white border border-gray-200 shadow-lg rounded-lg"
        >
          {/* User Info Section */}
          <DropdownMenuLabel className="p-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white font-semibold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
                                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 text-sm">
                              {getUserName()}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {getUserEmail()}
                            </div>
                            <div className="text-xs text-blue-600 font-medium">
                              {getUserRole()}
                            </div>
                          </div>
            </div>
          </DropdownMenuLabel>

          {/* Menu Items */}
          <div className="py-1">
            <DropdownMenuItem 
              onClick={handleProfileClick}
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <User className="w-4 h-4 text-gray-500" />
              <span>Your Profile</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleChangePassword}
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
            >
              <Lock className="w-4 h-4 text-gray-500" />
              <span>Change Password</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="my-1" />
            
            <DropdownMenuItem 
              onClick={handleLogout}
              className="flex items-center space-x-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-500" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserProfileDropdown; 