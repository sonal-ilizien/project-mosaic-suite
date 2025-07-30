import { useState } from "react";
import { 
  User, 
  Users, 
  DollarSign, 
  Anchor, 
  CheckCircle, 
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Building,
  TrendingUp,
  Calendar,
  UserCheck,
  Briefcase,
  GraduationCap,
  Rocket,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NewProjectModal from "./NewProjectModal";
import CreateTemplateModal from "./CreateTemplateModal";
import { useProjects } from "../contexts/ProjectContext";
import apiService from "../services/apiService";
import { useToast } from "@/hooks/use-toast";

const TemplateSelector = ({ 
  onBrowseTemplates, 
  onProjectCreate,
  onBackToDashboard
}: { 
  onBrowseTemplates?: () => void;
  onProjectCreate?: (project: any) => void;
  onBackToDashboard?: () => void;
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [creatingTemplate, setCreatingTemplate] = useState(false);
  const { addProject } = useProjects();
  const { toast } = useToast();

  const templates = [
    {
      id: 'personal',
      name: 'Personal Productivity',
      description: 'Manage daily tasks, habits, goals, and time-blocking for personal productivity.',
      icon: User,
      color: 'bg-primary',
      gradient: 'from-blue-500 to-blue-600',
      features: ['Daily To-dos', 'Habit Tracking', 'Goal Setting', 'Time Blocking'],
      useCase: 'Perfect for individuals managing personal projects and daily routines',
      complexity: 'Beginner'
    },
    {
      id: 'agile',
      name: 'Agile Development',
      description: 'Sprint planning, task allocation, team collaboration, and bug tracking.',
      icon: Users,
      color: 'bg-accent',
      gradient: 'from-green-500 to-green-600',
      features: ['Sprint Planning', 'User Stories', 'Bug Tracking', 'Team Collaboration'],
      useCase: 'Ideal for software development teams using Agile methodologies',
      complexity: 'Intermediate'
    },
    {
      id: 'finance',
      name: 'Finance Management',
      description: 'Budget planning, expense tracking, invoice management, and financial reporting.',
      icon: DollarSign,
      color: 'bg-warning',
      gradient: 'from-yellow-500 to-orange-500',
      features: ['Budget Planning', 'Expense Tracking', 'Invoice Management', 'Financial Reports'],
      useCase: 'Essential for businesses managing finances and accounting processes',
      complexity: 'Advanced'
    },
    {
      id: 'shipbuilding',
      name: 'Shipbuilding Projects',
      description: 'Complex project management for maritime construction with specialized tracking.',
      icon: Anchor,
      color: 'bg-destructive',
      gradient: 'from-red-500 to-red-600',
      features: ['Task Breakdown', 'Equipment Tracking', 'Milestone Scheduling', 'Gantt Charts'],
      useCase: 'Specialized for shipbuilding and large-scale construction projects',
      complexity: 'Expert'
    },
    {
      id: 'event',
      name: 'Event Planning',
      description: 'Track vendors, dates, budgets, guests, tasks for weddings, conferences.',
      icon: Calendar,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
      features: ['Vendor Management', 'Budget Tracking', 'Guest Lists', 'Timeline Planning'],
      useCase: 'Perfect for event coordinators and wedding planners',
      complexity: 'Intermediate'
    },
    {
      id: 'hr',
      name: 'HR / Recruitment',
      description: 'Hiring pipelines, onboarding checklists, employee databases.',
      icon: UserCheck,
      color: 'bg-indigo-500',
      gradient: 'from-indigo-500 to-indigo-600',
      features: ['Hiring Pipeline', 'Onboarding', 'Employee Database', 'Performance Reviews'],
      useCase: 'Essential for HR departments and recruitment agencies',
      complexity: 'Intermediate'
    },
    {
      id: 'construction',
      name: 'Construction / Real Estate',
      description: 'Milestones for permits, contractors, inspection stages, payments.',
      icon: Building,
      color: 'bg-amber-500',
      gradient: 'from-amber-500 to-amber-600',
      features: ['Permit Tracking', 'Contractor Management', 'Inspections', 'Payment Schedule'],
      useCase: 'Ideal for construction companies and real estate developers',
      complexity: 'Advanced'
    },
    {
      id: 'consulting',
      name: 'Client Service / Consulting',
      description: 'Per-client templates: deliverables, billing, tasks, communication logs.',
      icon: Briefcase,
      color: 'bg-teal-500',
      gradient: 'from-teal-500 to-teal-600',
      features: ['Client Management', 'Deliverables', 'Billing', 'Communication Logs'],
      useCase: 'Perfect for consulting firms and service providers',
      complexity: 'Intermediate'
    },
    {
      id: 'education',
      name: 'Education / Course Planning',
      description: 'Syllabus design, module breakdown, student tracking.',
      icon: GraduationCap,
      color: 'bg-pink-500',
      gradient: 'from-pink-500 to-pink-600',
      features: ['Syllabus Design', 'Module Planning', 'Student Tracking', 'Assignment Management'],
      useCase: 'Ideal for educators and training organizations',
      complexity: 'Beginner'
    },
    {
      id: 'product',
      name: 'Product Launch Roadmaps',
      description: 'Beta testing, stakeholder feedback, feature rollouts, release logs.',
      icon: Rocket,
      color: 'bg-cyan-500',
      gradient: 'from-cyan-500 to-cyan-600',
      features: ['Beta Testing', 'Feedback Collection', 'Feature Rollouts', 'Release Planning'],
      useCase: 'Essential for product managers and development teams',
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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleCreateProject = () => {
    if (selectedTemplate) {
      setShowNewProjectModal(true);
    }
  };

  const handleCreateTemplate = async (templateData: {
    name: string;
    category: string;
    domain: string;
    description: string;
    json_structure: { ideal: string };
    metadata: { estimated_duration: string; team_size: string };
    tags: string[];
  }) => {
    setCreatingTemplate(true);
    try {
      const payload = {
        name: templateData.name,
        category: templateData.category,
        domain: templateData.domain,
        description: templateData.description,
        json_structure: templateData.json_structure,
        metadata: templateData.metadata,
        tags: templateData.tags
      };

      await apiService.post('/templates/', payload);
      
      toast({
        title: "Success",
        description: "Template created successfully!",
        variant: "default",
      });
      
      setShowCreateTemplateModal(false);
    } catch (error) {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCreatingTemplate(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto overflow-y-auto h-full force-scrollbar">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="outline" 
            size="lg"
            className="px-6"
            onClick={onBackToDashboard}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center justify-center flex-1">
            <Sparkles className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Choose Your Template</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="lg"
              className="px-6"
              onClick={onBrowseTemplates}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Browse Examples
            </Button>
            <Button 
              size="lg"
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={() => setShowCreateTemplateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select a pre-configured template to get started quickly, or customize your own workflow
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {templates.map((template) => (
          <Card 
            key={template.id}
            className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-custom-lg relative ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary shadow-custom-primary' 
                : 'hover:shadow-custom-md'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            {/* Create Project Button - Only show on selected template */}
            {selectedTemplate === template.id && (
              <div className="absolute bottom-4 right-4 z-1">
                <Button 
                  size="sm"
                  className="bg-gradient-primary hover:opacity-90 text-white shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateProject();
                  }}
                >
                  Create New Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div className={`p-4 rounded-xl bg-gradient-to-br ${template.gradient} shadow-custom-md`}>
                <template.icon className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-foreground">{template.name}</h3>
                  <Badge className={getComplexityColor(template.complexity)}>
                    {template.complexity}
                  </Badge>
                </div>
                
                <p className="text-muted-foreground mb-4">{template.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-foreground mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 text-sm text-muted-foreground">
                  <Building className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{template.useCase}</p>
                </div>
              </div>
            </div>

            {selectedTemplate === template.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center text-primary">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-medium">Selected Template</span>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Browse Examples Button */}
      {/* This button is now moved to the top right */}

      {selectedTemplate && (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            You can customize all features and workflows after creating your project
          </p>
        </div>
      )}

      {/* New Project Modal */}
      <NewProjectModal
        open={showNewProjectModal}
        onOpenChange={setShowNewProjectModal}
        selectedTemplate={templates.find(t => t.id === selectedTemplate)}
        onProjectCreate={(projectData: {id: string; name: string; description: string; template: string; startDate?: Date; endDate?: Date; team: string[]; lead: string; milestones: any[]; labels: string[]; priority: string; status: string; createdAt: Date; progress: number}) => {
          // Convert the modal project data to ListView Project format
          const project = {
            id: parseInt(projectData.id), // Convert string ID to number
            name: projectData.name,
            type: projectData.template || 'General',
            template: projectData.template || 'General', // Keep template field for ProjectOverview
            status: projectData.status || 'Planning',
            priority: projectData.priority || 'Medium',
            assignee: projectData.lead || 'Unassigned',
            dueDate: projectData.endDate ? new Date(projectData.endDate).toISOString().split('T')[0] : '',
            progress: projectData.progress || 0,
            tasks: 0, // Default value for new projects
            completedTasks: 0, // Default value for new projects
            description: projectData.description || ''
          };
          
          addProject(project);
          setShowNewProjectModal(false);
          
          // Call the redirect callback if provided
          if (onProjectCreate) {
            onProjectCreate(project);
          }
        }}
      />

      {/* Create Template Modal */}
      <CreateTemplateModal
        open={showCreateTemplateModal}
        onOpenChange={setShowCreateTemplateModal}
        onSubmit={handleCreateTemplate}
        isCreating={creatingTemplate}
      />
    </div>
  );
};

export default TemplateSelector;