import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Mail, ArrowLeft, Shield, Building2, Users, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'verification' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending reset email
    setStep('verification');
  };

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate verification
    setStep('success');
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic
    console.log('Password reset:', { email, newPassword });
  };

  const renderEmailStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Forgot your password?</h2>
        <p className="text-gray-600">No worries! Enter your email address and we'll send you a reset link.</p>
      </div>

      <form onSubmit={handleEmailSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address*</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pl-12"
              required
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Send Reset Link
        </Button>
      </form>

      <div className="text-center">
        <span className="text-gray-600">Remember your password? </span>
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to login
        </Link>
      </div>
    </div>
  );

  const renderVerificationStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Check your email</h2>
        <p className="text-gray-600">
          We've sent a verification code to <span className="font-medium text-gray-800">{email}</span>
        </p>
      </div>

      <form onSubmit={handleVerificationSubmit} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="verificationCode" className="text-sm font-semibold text-gray-700">Verification Code*</Label>
          <div className="relative">
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/10 to-purple-400/10 rounded-xl pointer-events-none"></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => setStep('email')}
            className="flex items-center gap-2 h-12 border-2 border-gray-200 rounded-xl hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button
            type="submit"
            className="h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 hover:from-blue-700 hover:via-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Verify Code
          </Button>
        </div>
      </form>

      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">Didn't receive the code?</p>
        <Button variant="link" className="text-blue-600 hover:text-blue-700 font-medium p-0 h-auto">
          Resend code
        </Button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Code verified!</h2>
        <p className="text-gray-600">Now create a new password for your account.</p>
      </div>

      <form onSubmit={handlePasswordReset} className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="newPassword" className="text-sm font-semibold text-gray-700">New Password*</Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
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

        <div className="space-y-3">
          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm New Password*</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 pr-12"
              required
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-2">Password requirements:</p>
              <ul className="space-y-1 text-xs">
                <li>• At least 8 characters long</li>
                <li>• Contains uppercase and lowercase letters</li>
                <li>• Includes numbers and special characters</li>
              </ul>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-600 hover:from-green-700 hover:via-emerald-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          Reset Password
        </Button>
      </form>

      <div className="text-center">
        <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
          Back to login
        </Link>
      </div>
    </div>
  );

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
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 bg-clip-text text-transparent mb-3">
              Reset Password
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Get back to your PHS MOSAIC account</p>
          </div>

          {/* Main Form */}
          <Card className="backdrop-blur-sm bg-gradient-to-br from-white/95 to-white/85 border-0 shadow-2xl rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-500 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Password Recovery</h2>
                  <p className="text-white/90">Secure and easy password reset process</p>
                </div>
              </div>
            </div>
            
            <CardContent className="p-8">
              {step === 'email' && renderEmailStep()}
              {step === 'verification' && renderVerificationStep()}
              {step === 'success' && renderSuccessStep()}
            </CardContent>
          </Card>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Reset</h3>
                <p className="text-sm text-gray-600">Your account is protected</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Quick Recovery</h3>
                <p className="text-sm text-gray-600">Get back in minutes</p>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/60 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">24/7 Support</h3>
                <p className="text-sm text-gray-600">Help when you need it</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 