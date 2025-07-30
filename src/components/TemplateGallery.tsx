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
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  Star
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
      complexity: 'Beginner',
      popularity: 95,
      rating: 4.8
    },
    {
      id: 'agile',
      name: 'Agile Development',
      description: 'Sprint planning, task allocation, team collaboration, and bug tracking.',
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      features: ['Sprint Planning', 'User Stories', 'Bug Tracking', 'Team Collaboration'],
      complexity: 'Intermediate',
      popularity: 98,
      rating: 4.9
    },
    {
      id: 'finance',
      name: 'Finance Management',
      description: 'Budget planning, expense tracking, invoice management, and financial reporting.',
      icon: DollarSign,
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Budget Planning', 'Expense Tracking', 'Invoice Management', 'Financial Reports'],
      complexity: 'Advanced',
      popularity: 87,
      rating: 4.7
    },
    {
      id: 'shipbuilding',
      name: 'Shipbuilding Projects',
      description: 'Complex project management for maritime construction with specialized tracking.',
      icon: Anchor,
      gradient: 'from-red-500 to-red-600',
      features: ['Task Breakdown', 'Equipment Tracking', 'Milestone Scheduling', 'Gantt Charts'],
      complexity: 'Expert',
      popularity: 92,
      rating: 4.6
    },
    {
      id: 'event',
      name: 'Event Planning',
      description: 'Track vendors, dates, budgets, guests, tasks for weddings, conferences.',
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-600',
      features: ['Vendor Management', 'Budget Tracking', 'Guest Lists', 'Timeline Planning'],
      complexity: 'Intermediate',
      popularity: 89,
      rating: 4.5
    },
    {
      id: 'hr',
      name: 'HR / Recruitment',
      description: 'Hiring pipelines, onboarding checklists, employee databases.',
      icon: UserCheck,
      gradient: 'from-indigo-500 to-indigo-600',
      features: ['Hiring Pipeline', 'Onboarding', 'Employee Database', 'Performance Reviews'],
      complexity: 'Intermediate',
      popularity: 85,
      rating: 4.4
    },
    {
      id: 'construction',
      name: 'Construction / Real Estate',
      description: 'Milestones for permits, contractors, inspection stages, payments.',
      icon: Building,
      gradient: 'from-amber-500 to-amber-600',
      features: ['Permit Tracking', 'Contractor Management', 'Inspections', 'Payment Schedule'],
      complexity: 'Advanced',
      popularity: 88,
      rating: 4.3
    },
    {
      id: 'consulting',
      name: 'Client Service / Consulting',
      description: 'Per-client templates: deliverables, billing, tasks, communication logs.',
      icon: Briefcase,
      gradient: 'from-teal-500 to-teal-600',
      features: ['Client Management', 'Deliverables', 'Billing', 'Communication Logs'],
      complexity: 'Intermediate',
      popularity: 91,
      rating: 4.6
    },
    {
      id: 'education',
      name: 'Education / Course Planning',
      description: 'Syllabus design, module breakdown, student tracking.',
      icon: GraduationCap,
      gradient: 'from-pink-500 to-pink-600',
      features: ['Syllabus Design', 'Module Planning', 'Student Tracking', 'Assignment Management'],
      complexity: 'Beginner',
      popularity: 83,
      rating: 4.2
    },
    {
      id: 'product',
      name: 'Product Launch Roadmaps',
      description: 'Beta testing, stakeholder feedback, feature rollouts, release logs.',
      icon: Rocket,
      gradient: 'from-cyan-500 to-cyan-600',
      features: ['Beta Testing', 'Feedback Collection', 'Feature Rollouts', 'Release Planning'],
      complexity: 'Advanced',
      popularity: 94,
      rating: 4.8
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
      <DialogContent className="max-w-none w-[99vw] max-h-[85vh] overflow-hidden p-0">
        <div className="flex h-full">
          {/* Left Side - Template Grid */}
          <div className="w-[70%] p-6 overflow-y-auto">
            <DialogHeader className="mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-foreground">Browse Project Templates</DialogTitle>
                  <p className="text-muted-foreground mt-1">Choose from our curated collection of professional templates</p>
                </div>
              </div>
        </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`p-4 hover:shadow-custom-lg transition-all duration-300 cursor-pointer border-2 hover:bg-primary/20 ${
                    selectedTemplate?.id === template.id 
                      ? 'border-primary shadow-custom-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
              <div className="flex flex-col h-full">
                    {/* Header */}
                <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${template.gradient} shadow-lg`}>
                    <template.icon className="w-6 h-6 text-white" />
                  </div>
                      <div className="flex items-center space-x-2">
                  <Badge className={getComplexityColor(template.complexity)}>
                    {template.complexity}
                  </Badge>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium">{template.rating}</span>
                        </div>
                      </div>
                </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-foreground mb-2">{template.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{template.description}</p>

                      {/* Features */}
                      <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {template.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-background">
                        {feature}
                      </Badge>
                    ))}
                    {template.features.length > 3 && (
                            <Badge variant="outline" className="text-xs bg-background">
                        +{template.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                      {/* Popularity */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{template.popularity}% popular</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-3 border-t border-border">
                  <Button 
                    variant="outline" 
                    size="sm" 
                        className="flex-1 text-xs hover:bg-primary/20"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                        }}
                  >
                        <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                        className="flex-1 bg-gradient-primary hover:bg-primary/20 text-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUseTemplate(template);
                        }}
                  >
                    Use Template
                        <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
            </div>
          </div>

          {/* Right Side - Template Preview */}
          <div className="w-[30%] bg-gradient-to-br from-gray-50 to-gray-100 border-l border-border p-6 overflow-y-auto">
            {selectedTemplate ? (
              <div className="space-y-4">
                {/* Template Header */}
                <div className="text-center mb-6">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${selectedTemplate.gradient} flex items-center justify-center shadow-lg`}>
                    <selectedTemplate.icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground mb-2">{selectedTemplate.name}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{selectedTemplate.description}</p>
                </div>

                {/* Template Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-border">
                    <div className="flex items-center space-x-2 mb-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium">Rating</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{selectedTemplate.rating}/5.0</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-border">
                    <div className="flex items-center space-x-2 mb-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium">Popularity</span>
                    </div>
                    <p className="text-lg font-bold text-foreground">{selectedTemplate.popularity}%</p>
                  </div>
        </div>

                {/* Features */}
                <div className="bg-white p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center text-sm">
                    <Sparkles className="w-4 h-4 mr-2 text-primary" />
                    Key Features
                  </h3>
                  <div className="space-y-2">
                  {selectedTemplate.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                        <span className="text-xs text-foreground">{feature}</span>
                      </div>
                  ))}
                  </div>
                </div>

                {/* What's Included */}
                <div className="bg-white p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                    What's Included
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-foreground">Pre-configured task board</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-foreground">Custom fields and forms</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-foreground">Progress tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-foreground">Team collaboration tools</span>
              </div>
              </div>
            </div>

                {/* Use Template Button */}
                <div className="pt-4 border-t border-border">
              <Button 
                    size="sm"
                    className="w-full bg-gradient-primary hover:bg-primary/20 text-white shadow-lg"
                onClick={() => handleUseTemplate(selectedTemplate)}
              >
                    <Sparkles className="w-4 h-4 mr-2" />
                Use This Template
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                  <Eye className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Template Preview</h3>
                <p className="text-muted-foreground text-sm">Select a template from the left to see its details and features</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;