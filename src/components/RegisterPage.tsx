import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Shield, Building2, Users, Eye, EyeOff, User, Mail, Lock, FileText, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useToast } from '@/hooks/use-toast';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationName?: string;
  industry?: string;
  organizationSize?: string;
  invitationToken?: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
  marketingAccepted: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false,
  });

  const steps = [
    { id: 1, title: 'Personal', icon: User, description: 'Personal Workspace' },
    { id: 2, title: 'Organization', icon: Building2, description: 'Organization Setup' },
    { id: 3, title: 'Join Team', icon: Users, description: 'Join Organization' },
  ];

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegistration = async () => {
    if (!formData.termsAccepted || !formData.privacyAccepted) {
      toast({
        title: "Validation Error",
        description: "Please accept the Terms of Service and Privacy Policy",
        variant: "warning",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "warning",
      });
      return;
    }

    // For step 3, validate invitation token
    if (currentStep === 3 && !formData.invitationToken) {
      toast({
        title: "Validation Error",
        description: "Please enter an invitation token",
        variant: "warning",
      });
      return;
    }

    setIsLoading(true);

    try {
      let response;
      
      if (currentStep === 1) {
        // Personal registration
        const personalRegistrationData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          first_name: formData.firstName,
          last_name: formData.lastName
        };

        response = await apiService.post('/accounts/auth/personal-register/', personalRegistrationData);
        
        toast({
          title: "Registration Successful",
          description: "Your personal workspace has been created successfully!",
          variant: "success",
        });
      } else if (currentStep === 2) {
        // Organization registration
        const organizationRegistrationData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          first_name: formData.firstName,
          last_name: formData.lastName,
          organization_name: formData.organizationName,
          organization_industry: formData.industry,
          organization_size: formData.organizationSize
        };

        response = await apiService.post('/accounts/auth/public-register/', organizationRegistrationData);
        
        toast({
          title: "Registration Successful",
          description: "Your organization has been created successfully!",
          variant: "success",
        });
      } else if (currentStep === 3) {
        // Join team registration
        const joinTeamData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
          first_name: formData.firstName,
          last_name: formData.lastName,
          token: formData.invitationToken
        };

        response = await apiService.post('/accounts/invitations/accept/', joinTeamData);
        
        toast({
          title: "Registration Successful",
          description: "You have successfully joined the organization!",
          variant: "success",
        });
      }
      
      // Store tokens if provided in response
      if (response?.access_token) {
        apiService.setToken(response.access_token);
      }
      if (response?.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }

      // Redirect to dashboard
      navigate('/');
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mb-3">
                Welcome to PHS MOSAIC
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Choose how you'd like to get started</p>
            </div>

            {/* Step Navigation */}
            <div className="w-full mb-8">
              <div className="flex justify-center">
                <div className="flex bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-2xl w-full max-w-4xl border border-white/20">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-300 flex-1 justify-center ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white shadow-lg transform scale-105'
                            : isCompleted
                            ? 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="hidden sm:block">
                          <div className="font-semibold">{step.title}</div>
                          <div className="text-xs opacity-90">{step.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Card className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Personal Workspace</h2>
                    <p className="text-white/90">Create your personal workspace for individual project management.</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name*</Label>
                        <div className="relative">
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your first name"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name*</Label>
                        <div className="relative">
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your last name"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username*</Label>
                        <div className="relative">
                          <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Choose a username"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address*</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your email"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password*</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                            placeholder="Create a strong password"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password*</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                            placeholder="Confirm your password"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Terms & Conditions
                    </h3>
                    <div className="space-y-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="terms"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="terms" className="text-sm font-semibold text-gray-800">I accept the Terms of Service*</Label>
                          <p className="text-xs text-gray-600">By checking this box, you agree to our Terms of Service and acknowledge that you have read and understood them.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="privacy"
                          checked={formData.privacyAccepted}
                          onCheckedChange={(checked) => handleInputChange('privacyAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="privacy" className="text-sm font-semibold text-gray-800">I accept the Privacy Policy*</Label>
                          <p className="text-xs text-gray-600">You agree to our Privacy Policy and consent to the collection and use of your information as described.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="marketing"
                          checked={formData.marketingAccepted}
                          onCheckedChange={(checked) => handleInputChange('marketingAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="marketing" className="text-sm font-semibold text-gray-800">I agree to receive marketing communications</Label>
                          <p className="text-xs text-gray-600">Receive updates about new features, tips, and best practices. You can unsubscribe at any time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    onClick={handleRegistration}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Personal Workspace...
                      </>
                    ) : (
                      'Create Personal Workspace'
                    )}
                  </Button>
                  <Button variant="link" className="text-gray-600 hover:text-indigo-600 font-medium" asChild>
                    <Link to="/login">Already have an account? Sign in</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mb-3">
                Organization Setup
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Choose how you'd like to get started</p>
            </div>

            {/* Step Navigation */}
            <div className="w-full mb-8">
              <div className="flex justify-center">
                <div className="flex bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-2xl w-full max-w-4xl border border-white/20">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-300 flex-1 justify-center ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white shadow-lg transform scale-105'
                            : isCompleted
                            ? 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="hidden sm:block">
                          <div className="font-semibold">{step.title}</div>
                          <div className="text-xs opacity-90">{step.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Card className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Organization Setup</h2>
                    <p className="text-white/90">Set up your organization and invite team members.</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="firstName2" className="text-sm font-semibold text-gray-700">First Name*</Label>
                        <div className="relative">
                          <Input
                            id="firstName2"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your first name"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName2" className="text-sm font-semibold text-gray-700">Last Name*</Label>
                        <div className="relative">
                          <Input
                            id="lastName2"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your last name"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="username2" className="text-sm font-semibold text-gray-700">Username*</Label>
                        <div className="relative">
                          <Input
                            id="username2"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Choose a username"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email2" className="text-sm font-semibold text-gray-700">Email Address*</Label>
                        <div className="relative">
                          <Input
                            id="email2"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your email"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="password2" className="text-sm font-semibold text-gray-700">Password*</Label>
                        <div className="relative">
                          <Input
                            id="password2"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                            placeholder="Create a strong password"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword2" className="text-sm font-semibold text-gray-700">Confirm Password*</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword2"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                            placeholder="Confirm your password"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      Organization Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="orgName" className="text-sm font-semibold text-gray-700">Organization Name*</Label>
                        <div className="relative">
                          <Input
                            id="orgName"
                            value={formData.organizationName || ''}
                            onChange={(e) => handleInputChange('organizationName', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter organization name"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="industry" className="text-sm font-semibold text-gray-700">Industry*</Label>
                        <div className="relative">
                          <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                            <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="retail">Retail</SelectItem>
                              <SelectItem value="manufacturing">Manufacturing</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="orgSize" className="text-sm font-semibold text-gray-700">Organization Size*</Label>
                        <div className="relative">
                          <Select value={formData.organizationSize} onValueChange={(value) => handleInputChange('organizationSize', value)}>
                            <SelectTrigger className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Terms & Conditions
                    </h3>
                    <div className="space-y-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="terms2"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="terms2" className="text-sm font-semibold text-gray-800">I accept the Terms of Service*</Label>
                          <p className="text-xs text-gray-600">By checking this box, you agree to our Terms of Service and acknowledge that you have read and understood them.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="privacy2"
                          checked={formData.privacyAccepted}
                          onCheckedChange={(checked) => handleInputChange('privacyAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="privacy2" className="text-sm font-semibold text-gray-800">I accept the Privacy Policy*</Label>
                          <p className="text-xs text-gray-600">You agree to our Privacy Policy and consent to the collection and use of your information as described.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="marketing2"
                          checked={formData.marketingAccepted}
                          onCheckedChange={(checked) => handleInputChange('marketingAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="marketing2" className="text-sm font-semibold text-gray-800">I agree to receive marketing communications</Label>
                          <p className="text-xs text-gray-600">Receive updates about new features, tips, and best practices. You can unsubscribe at any time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    onClick={handleRegistration}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating Organization...
                      </>
                    ) : (
                      'Create Organization'
                    )}
                  </Button>
                  <Button variant="link" className="text-gray-600 hover:text-indigo-600 font-medium" asChild>
                    <Link to="/login">Already have an account? Sign in</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mb-3">
                Join Organization
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Choose how you'd like to get started</p>
            </div>

            {/* Step Navigation */}
            <div className="w-full mb-8">
              <div className="flex justify-center">
                <div className="flex bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-2xl w-full max-w-4xl border border-white/20">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isCompleted = currentStep > step.id;
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => setCurrentStep(step.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-300 flex-1 justify-center ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 text-white shadow-lg transform scale-105'
                            : isCompleted
                            ? 'text-gray-700 hover:text-blue-600 hover:bg-white/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/30'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : isCompleted
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="hidden sm:block">
                          <div className="font-semibold">{step.title}</div>
                          <div className="text-xs opacity-90">{step.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <Card className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Join Organization</h2>
                    <p className="text-white/90">Join an existing organization using an invitation link.</p>
                  </div>
                </div>
              </div>
              
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="firstName3" className="text-sm font-semibold text-gray-700">First Name*</Label>
                        <div className="relative">
                          <Input
                            id="firstName3"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your first name"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName3" className="text-sm font-semibold text-gray-700">Last Name*</Label>
                        <div className="relative">
                          <Input
                            id="lastName3"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your last name"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="username3" className="text-sm font-semibold text-gray-700">Username*</Label>
                        <div className="relative">
                          <Input
                            id="username3"
                            value={formData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Choose a username"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="email3" className="text-sm font-semibold text-gray-700">Email Address*</Label>
                        <div className="relative">
                          <Input
                            id="email3"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                            placeholder="Enter your email"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="password3" className="text-sm font-semibold text-gray-700">Password*</Label>
                        <div className="relative">
                          <Input
                            id="password3"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                            placeholder="Create a strong password"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="confirmPassword3" className="text-sm font-semibold text-gray-700">Confirm Password*</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword3"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
                            placeholder="Confirm your password"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <Mail className="w-4 h-4 text-white" />
                      </div>
                      Invitation Details
                    </h3>
                    <div className="space-y-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                      <p className="text-sm text-gray-600 flex items-start gap-3">
                        <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mt-1 flex-shrink-0"></div>
                        You should have received an invitation email with a secure link. If you have an invitation token, enter it below.
                      </p>
                      <div className="space-y-3">
                        <Label htmlFor="invitationToken" className="text-sm font-semibold text-gray-700">Invitation Token*</Label>
                        <div className="relative">
                          <Input
                            id="invitationToken"
                            placeholder="Enter invitation token or paste invitation URL"
                            value={formData.invitationToken || ''}
                            onChange={(e) => handleInputChange('invitationToken', e.target.value)}
                            className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-semibold text-gray-800 mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-white" />
                      </div>
                      Terms & Conditions
                    </h3>
                    <div className="space-y-4 bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="terms3"
                          checked={formData.termsAccepted}
                          onCheckedChange={(checked) => handleInputChange('termsAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-indigo-500 data-[state=checked]:to-purple-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="terms3" className="text-sm font-semibold text-gray-800">I accept the Terms of Service*</Label>
                          <p className="text-xs text-gray-600">By checking this box, you agree to our Terms of Service and acknowledge that you have read and understood them.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="privacy3"
                          checked={formData.privacyAccepted}
                          onCheckedChange={(checked) => handleInputChange('privacyAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-emerald-500 data-[state=checked]:to-teal-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="privacy3" className="text-sm font-semibold text-gray-800">I accept the Privacy Policy*</Label>
                          <p className="text-xs text-gray-600">You agree to our Privacy Policy and consent to the collection and use of your information as described.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Checkbox
                          id="marketing3"
                          checked={formData.marketingAccepted}
                          onCheckedChange={(checked) => handleInputChange('marketingAccepted', checked as boolean)}
                          className="mt-1 data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-cyan-500 data-[state=checked]:to-blue-500"
                        />
                        <div className="space-y-2">
                          <Label htmlFor="marketing3" className="text-sm font-semibold text-gray-800">I agree to receive marketing communications</Label>
                          <p className="text-xs text-gray-600">Receive updates about new features, tips, and best practices. You can unsubscribe at any time.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button
                    onClick={handleRegistration}
                    disabled={isLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Joining Organization...
                      </>
                    ) : (
                      'Join Organization'
                    )}
                  </Button>
                  <Button variant="link" className="text-gray-600 hover:text-indigo-600 font-medium" asChild>
                    <Link to="/login">Already have an account? Sign in</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 via-pink-100 to-indigo-200 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/60 to-purple-600/60 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-400/60 to-blue-600/60 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/50 to-pink-600/50 rounded-full blur-2xl animate-pulse delay-500"></div>
        
        {/* Moving elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-400/70 to-teal-500/70 rounded-full blur-lg animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-gradient-to-br from-orange-400/70 to-red-500/70 rounded-full blur-lg animate-bounce delay-700"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-400/70 to-orange-500/70 rounded-full blur-md animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-400/70 to-rose-500/70 rounded-full blur-md animate-ping delay-1000"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-gradient-to-br from-indigo-400/50 to-purple-500/50 rotate-45 blur-lg animate-spin"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-gradient-to-br from-cyan-400/50 to-blue-500/50 -rotate-45 blur-lg animate-spin delay-500"></div>
        
        {/* Particle effects */}
        <div className="absolute top-10 left-1/2 w-3 h-3 bg-white/80 rounded-full animate-ping"></div>
        <div className="absolute top-20 right-1/3 w-2 h-2 bg-cyan-400/90 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-10 left-1/3 w-2.5 h-2.5 bg-purple-400/90 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-20 right-1/2 w-2 h-2 bg-pink-400/90 rounded-full animate-ping delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {renderStepContent()}
        </div>

        {/* Feature Cards */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your data is encrypted and secure. We never share your information with third parties.</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Flexible Setup</h3>
                <p className="text-sm text-gray-600">Start personal or scale to enterprise. Add team members anytime with our invitation system.</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Collaboration</h3>
                <p className="text-sm text-gray-600">Invite team members, assign roles, and collaborate seamlessly across projects.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 