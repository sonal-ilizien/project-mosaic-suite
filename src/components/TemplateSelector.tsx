import { useState } from "react";
import { 
  User, 
  Users, 
  DollarSign, 
  Anchor, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Building,
  TrendingUp
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NewProjectModal from "./NewProjectModal";

const TemplateSelector = ({ onBrowseTemplates }: { onBrowseTemplates?: () => void }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const templates = [
    {
      id: 'personal',
      name: 'Personal Productivity',
      description: 'Manage daily tasks, habits, goals, and time-blocking for personal productivity.',
      icon: User,
      color: 'bg-primary',
      gradient: 'from-blue-500 to-blue-600',
      features: ['Daily To-dos', 'Habit Tracking', 'Goal Setting', 'Time Blocking', 'Personal Calendar'],
      useCase: 'Perfect for individuals managing personal projects and daily routines',
      complexity: 'Beginner'
    },
    {
      id: 'agile',
      name: 'Agile Development',
      description: 'Sprint planning, task allocation, team collaboration, and bug tracking for software teams.',
      icon: Users,
      color: 'bg-accent',
      gradient: 'from-green-500 to-green-600',
      features: ['Sprint Planning', 'User Stories', 'Bug Tracking', 'Team Collaboration', 'Velocity Charts'],
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
      features: ['Budget Planning', 'Expense Tracking', 'Invoice Management', 'Financial Reports', 'Payroll Management'],
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
      features: ['Task Breakdown Structure', 'Equipment Tracking', 'Milestone Scheduling', 'Gantt Charts', 'S-curve Analytics'],
      useCase: 'Specialized for shipbuilding and large-scale construction projects',
      complexity: 'Expert'
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-4xl font-bold text-foreground">Choose Your Template</h1>
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
            className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-custom-lg ${
              selectedTemplate === template.id 
                ? 'ring-2 ring-primary shadow-custom-primary' 
                : 'hover:shadow-custom-md'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
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

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          size="lg"
          className="px-8"
          onClick={onBrowseTemplates}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Browse Examples
        </Button>
        
        <Button 
          size="lg"
          className="px-8 bg-gradient-primary hover:opacity-90"
          disabled={!selectedTemplate}
          onClick={handleCreateProject}
        >
          Create Project
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

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
        onProjectCreate={(project) => {
          console.log('Project created:', project);
          setShowNewProjectModal(false);
        }}
      />
    </div>
  );
};

export default TemplateSelector;