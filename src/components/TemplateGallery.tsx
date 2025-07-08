import { useState } from "react";
import { 
  User, 
  Users, 
  DollarSign, 
  Anchor, 
  Calendar,
  UserCheck,
  Building,
  Briefcase,
  GraduationCap,
  Rocket,
  Eye,
  ArrowRight
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (template: any) => void;
}

const TemplateGallery = ({ open, onOpenChange, onTemplateSelect }: TemplateGalleryProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const templates = [
    {
      id: 'personal',
      name: 'Personal Productivity',
      description: 'Manage daily tasks, habits, goals, and time-blocking for personal productivity.',
      icon: User,
      gradient: 'from-blue-500 to-blue-600',
      features: ['Daily To-dos', 'Habit Tracking', 'Goal Setting', 'Time Blocking'],
      complexity: 'Beginner'
    },
    {
      id: 'agile',
      name: 'Agile Development',
      description: 'Sprint planning, task allocation, team collaboration, and bug tracking.',
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      features: ['Sprint Planning', 'User Stories', 'Bug Tracking', 'Team Collaboration'],
      complexity: 'Intermediate'
    },
    {
      id: 'finance',
      name: 'Finance Management',
      description: 'Budget planning, expense tracking, invoice management, and financial reporting.',
      icon: DollarSign,
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Budget Planning', 'Expense Tracking', 'Invoice Management', 'Financial Reports'],
      complexity: 'Advanced'
    },
    {
      id: 'shipbuilding',
      name: 'Shipbuilding Projects',
      description: 'Complex project management for maritime construction with specialized tracking.',
      icon: Anchor,
      gradient: 'from-red-500 to-red-600',
      features: ['Task Breakdown', 'Equipment Tracking', 'Milestone Scheduling', 'Gantt Charts'],
      complexity: 'Expert'
    },
    {
      id: 'event',
      name: 'Event Planning',
      description: 'Track vendors, dates, budgets, guests, tasks for weddings, conferences.',
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600',
      features: ['Vendor Management', 'Budget Tracking', 'Guest Lists', 'Timeline Planning'],
      complexity: 'Intermediate'
    },
    {
      id: 'hr',
      name: 'HR / Recruitment',
      description: 'Hiring pipelines, onboarding checklists, employee databases.',
      icon: UserCheck,
      gradient: 'from-indigo-500 to-indigo-600',
      features: ['Hiring Pipeline', 'Onboarding', 'Employee Database', 'Performance Reviews'],
      complexity: 'Intermediate'
    },
    {
      id: 'construction',
      name: 'Construction / Real Estate',
      description: 'Milestones for permits, contractors, inspection stages, payments.',
      icon: Building,
      gradient: 'from-amber-500 to-amber-600',
      features: ['Permit Tracking', 'Contractor Management', 'Inspections', 'Payment Schedule'],
      complexity: 'Advanced'
    },
    {
      id: 'consulting',
      name: 'Client Service / Consulting',
      description: 'Per-client templates: deliverables, billing, tasks, communication logs.',
      icon: Briefcase,
      gradient: 'from-teal-500 to-teal-600',
      features: ['Client Management', 'Deliverables', 'Billing', 'Communication Logs'],
      complexity: 'Intermediate'
    },
    {
      id: 'education',
      name: 'Education / Course Planning',
      description: 'Syllabus design, module breakdown, student tracking.',
      icon: GraduationCap,
      gradient: 'from-pink-500 to-pink-600',
      features: ['Syllabus Design', 'Module Planning', 'Student Tracking', 'Assignment Management'],
      complexity: 'Beginner'
    },
    {
      id: 'product',
      name: 'Product Launch Roadmaps',
      description: 'Beta testing, stakeholder feedback, feature rollouts, release logs.',
      icon: Rocket,
      gradient: 'from-cyan-500 to-cyan-600',
      features: ['Beta Testing', 'Feedback Collection', 'Feature Rollouts', 'Release Planning'],
      complexity: 'Advanced'
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'bg-success text-white';
      case 'Intermediate': return 'bg-primary text-white';
      case 'Advanced': return 'bg-warning text-white';
      case 'Expert': return 'bg-destructive text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleUseTemplate = (template: any) => {
    onTemplateSelect(template);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Browse Project Templates</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {templates.map((template) => (
            <Card key={template.id} className="p-4 hover:shadow-custom-md transition-shadow cursor-pointer">
              <div className="flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${template.gradient}`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                  <Badge className={getComplexityColor(template.complexity)}>
                    {template.complexity}
                  </Badge>
                </div>

                <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3 flex-1">{template.description}</p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {template.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 bg-gradient-primary hover:opacity-90"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {selectedTemplate && (
          <div className="mt-6 p-4 bg-background-secondary rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2">Template Preview: {selectedTemplate.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{selectedTemplate.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-foreground mb-2">Features:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedTemplate.features.map((feature: string, index: number) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-foreground mb-2">Includes:</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pre-configured task board</li>
                  <li>• Custom fields and forms</li>
                  <li>• Progress tracking</li>
                  <li>• Team collaboration tools</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button 
                className="bg-gradient-primary hover:opacity-90"
                onClick={() => handleUseTemplate(selectedTemplate)}
              >
                Use This Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;