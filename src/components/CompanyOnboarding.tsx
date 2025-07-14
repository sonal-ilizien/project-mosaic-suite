import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Users, UserPlus, Shield } from "lucide-react";

interface CompanyOnboardingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: any) => void;
}

const CompanyOnboarding = ({ open, onOpenChange, onComplete }: CompanyOnboardingProps) => {
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<'create' | 'join' | null>(null);
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: '',
    size: '',
    inviteCode: '',
    userRole: 'member',
    department: ''
  });

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Education',
    'Retail',
    'Construction',
    'Other'
  ];

  const companySizes = [
    '1-10 employees',
    '11-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees'
  ];

  const roles = [
    { value: 'admin', label: 'Company Admin', icon: Shield },
    { value: 'manager', label: 'Team Lead / Manager', icon: Users },
    { value: 'member', label: 'Member / Collaborator', icon: UserPlus }
  ];

  const handleModeSelect = (selectedMode: 'create' | 'join') => {
    setMode(selectedMode);
    setStep(2);
  };

  const handleSubmit = () => {
    const data = {
      mode,
      ...formData
    };
    onComplete(data);
    onOpenChange(false);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Welcome to ProjectFlow</h2>
        <p className="text-muted-foreground">Choose how you want to get started</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className="p-6 cursor-pointer hover:shadow-custom-md transition-all hover:scale-105"
          onClick={() => handleModeSelect('create')}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto">
              <Building className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Create New Company</h3>
              <p className="text-sm text-muted-foreground">Set up a new organization workspace</p>
            </div>
          </div>
        </Card>

        <Card 
          className="p-6 cursor-pointer hover:shadow-custom-md transition-all hover:scale-105"
          onClick={() => handleModeSelect('join')}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-accent rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Join Existing Company</h3>
              <p className="text-sm text-muted-foreground">Join your team with an invite code</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (mode === 'create') {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Create Your Company</h2>
            <p className="text-muted-foreground">Tell us about your organization</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of your company"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Industry</Label>
                <Select 
                  value={formData.industry} 
                  onValueChange={(value) => setFormData({ ...formData, industry: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Company Size</Label>
                <Select 
                  value={formData.size} 
                  onValueChange={(value) => setFormData({ ...formData, size: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Your Role</Label>
              <Select 
                value={formData.userRole} 
                onValueChange={(value) => setFormData({ ...formData, userRole: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center">
                        <role.icon className="w-4 h-4 mr-2" />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground">Join Your Team</h2>
            <p className="text-muted-foreground">Enter your invite code to join</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="invite-code">Invite Code</Label>
              <Input
                id="invite-code"
                value={formData.inviteCode}
                onChange={(e) => setFormData({ ...formData, inviteCode: e.target.value })}
                placeholder="Enter your invite code"
              />
            </div>

            <div>
              <Label>Your Role</Label>
              <Select 
                value={formData.userRole} 
                onValueChange={(value) => setFormData({ ...formData, userRole: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.filter(role => role.value !== 'admin').map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      <div className="flex items-center">
                        <role.icon className="w-4 h-4 mr-2" />
                        {role.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Development, Marketing, Sales"
              />
            </div>
          </div>
        </div>
      );
    }
  };

  const canProceed = () => {
    if (mode === 'create') {
      return formData.companyName && formData.industry && formData.size;
    } else {
      return formData.inviteCode && formData.userRole;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Company Setup</DialogTitle>
        </DialogHeader>

        {step === 1 ? renderStep1() : renderStep2()}

        {step === 2 && (
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="bg-gradient-primary hover:opacity-90"
            >
              {mode === 'create' ? 'Create Company' : 'Join Company'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CompanyOnboarding;