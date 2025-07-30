import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent } from './ui/card';
import { Eye, EyeOff, Mail, Lock, User, Shield, Building2, Users, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import { useToast } from '@/hooks/use-toast';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginData = {
        username: formData.username,
        password: formData.password
      };

      const response = await apiService.post('/accounts/auth/login/', loginData);
      
      // Store tokens if provided in response
      if (response.data?.tokens?.access) {
        apiService.setToken(response.data.tokens.access);
      }
      if (response.data?.tokens?.refresh) {
        localStorage.setItem('refreshToken', response.data.tokens.refresh);
      }

      // Store user data if provided
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      // Show success toast
      toast({
        title: "Login Successful",
        description: "Welcome back!",
        variant: "success",
      });

      // Redirect to landing page
      navigate('/');
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please check your credentials.';
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
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

      <div className="relative z-10 container mx-auto px-4 py-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600 text-base">Sign in to your PHS MOSAIC account</p>
          </div>

          {/* Login Form */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Sign In</h2>
                  <p className="text-white/90 text-sm">Access your PHS MOSAIC workspace</p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username*</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="h-11 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pl-12"
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password*</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="h-11 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pl-12 pr-12"
                      required
                    />
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => handleInputChange('rememberMe', checked as boolean)}
                      className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-500"
                    />
                    <Label htmlFor="rememberMe" className="text-sm font-medium text-gray-700">Remember me</Label>
                  </div>
                  <Button variant="link" className="text-sm text-blue-600 hover:text-blue-700 font-medium p-0 h-auto" asChild>
                    <Link to="/forgot-password">Forgot password?</Link>
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center">
                  <span className="text-gray-600">Don't have an account? </span>
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Create account
                  </Link>
                </div>
              </form>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">Or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full h-11 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200">
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                <Button variant="outline" className="w-full h-11 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-200">
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  Continue with Twitter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Secure & Private</h3>
                <p className="text-xs text-gray-600">Your data is encrypted and secure</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Flexible Setup</h3>
                <p className="text-xs text-gray-600">Scale from personal to enterprise</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">Team Collaboration</h3>
                <p className="text-xs text-gray-600">Collaborate seamlessly</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 