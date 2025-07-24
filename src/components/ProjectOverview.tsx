import { useState } from "react";
import { ArrowLeft, Calendar, Users, Target, FileText, Settings, BarChart3, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KanbanBoard from "./KanbanBoard";
import AddTaskModal from "./AddTaskModal";
import CalendarView from "./CalendarView";
import ProjectFiles from "./ProjectFiles";
import ProjectTeam from "./ProjectTeam";
import { Project } from "@/lib/projectData";

interface ProjectOverviewProps {
  project: Project;
  onBack: () => void;
}

const ProjectOverview = ({ project, onBack }: ProjectOverviewProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // Get template data based on the actual project template
  const getTemplateData = (templateId: string) => {
    switch (templateId) {
      case 'agile':
        return {
          sections: ['Backlog', 'Sprint 1', 'Sprint 2', 'In Progress', 'Testing', 'Done'],
          customFields: ['Story Points', 'Sprint', 'Epic', 'Assignee'],
          tasks: [] // Start with empty tasks
        };
      case 'finance':
        return {
          sections: ['Budget Planning', 'Expense Tracking', 'Invoice Management', 'Reports', 'Approval'],
          customFields: ['Amount', 'Category', 'Due Date', 'Approver'],
          tasks: [] // Start with empty tasks
        };
      case 'personal':
        return {
          sections: ['To Do', 'In Progress', 'Review', 'Done'],
          customFields: ['Priority', 'Due Date', 'Assignee'],
          tasks: [] // Start with empty tasks
        };
      case 'event':
        return {
          sections: ['Planning', 'Vendor Management', 'Budget Tracking', 'Execution', 'Wrap-up'],
          customFields: ['Budget', 'Vendor', 'Due Date', 'Status'],
          tasks: [] // Start with empty tasks
        };
      case 'hr':
        return {
          sections: ['Recruitment', 'Onboarding', 'Training', 'Performance', 'Completed'],
          customFields: ['Candidate', 'Department', 'Due Date', 'Status'],
          tasks: [] // Start with empty tasks
        };
      case 'construction':
        return {
          sections: ['Planning', 'Permits', 'Construction', 'Inspections', 'Completion'],
          customFields: ['Contractor', 'Budget', 'Due Date', 'Status'],
          tasks: [] // Start with empty tasks
        };
      case 'consulting':
        return {
          sections: ['Discovery', 'Analysis', 'Implementation', 'Review', 'Delivery'],
          customFields: ['Client', 'Deliverable', 'Due Date', 'Status'],
          tasks: [] // Start with empty tasks
        };
      case 'education':
        return {
          sections: ['Curriculum Design', 'Content Creation', 'Testing', 'Deployment', 'Evaluation'],
          customFields: ['Module', 'Duration', 'Due Date', 'Status'],
          tasks: [] // Start with empty tasks
        };
      case 'product':
        return {
          sections: ['Research', 'Design', 'Development', 'Testing', 'Launch'],
          customFields: ['Feature', 'Sprint', 'Due Date', 'Status'],
          tasks: [] // Start with empty tasks
        };
      case 'shipbuilding':
        return {
          sections: ['Design', 'Construction', 'Assembly', 'Testing', 'Delivery'],
          customFields: ['Component', 'Phase', 'Due Date', 'Status'],
          tasks: [] // Start with empty tasks
        };
      default:
        return {
          sections: ['To Do', 'In Progress', 'Review', 'Done'],
          customFields: ['Priority', 'Due Date', 'Assignee'],
          tasks: [] // Start with empty tasks
        };
    }
  };

  const templateData = getTemplateData(project.template);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline">{project.template}</Badge>
          <Badge className="bg-success text-white">Active</Badge>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Progress</div>
              <div className="text-2xl font-bold text-foreground">{project.progress}%</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-light rounded-lg">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Tasks</div>
              <div className="text-2xl font-bold text-foreground">{project.tasks || 0}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success-light rounded-lg">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Assignee</div>
              <div className="text-lg font-bold text-foreground">{project.assignee || 'Unassigned'}</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-light rounded-lg">
              <Calendar className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Due Date</div>
              <div className="text-lg font-bold text-foreground">{project.dueDate || 'Not set'}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Task Board</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Progress Overview */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Project Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Overall Progress</span>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>
                
                {templateData.sections.map((section, index) => (
                  <div key={section}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{section}</span>
                      <span className="text-sm font-medium">{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <Progress value={Math.floor(Math.random() * 100)} className="h-1" />
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Activity */}
            <Card className="p-6">
              <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { action: 'Project created', item: project.name, time: 'Just now' },
                  { action: 'Template applied', item: `${project.template || project.type} template`, time: 'Just now' },
                  { action: 'Assignee set', item: project.assignee || 'Unassigned', time: 'Just now' },
                  { action: 'Status updated', item: project.status || 'Planning', time: 'Just now' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <span className="text-sm text-foreground">{activity.action}: </span>
                      <span className="text-sm font-medium text-foreground">{activity.item}</span>
                      <div className="text-xs text-muted-foreground">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Template-specific sections */}
          <Card className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Template Structure</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {templateData.sections.map((section) => (
                <div key={section} className="p-3 bg-background-secondary rounded-lg text-center">
                  <div className="font-medium text-foreground">{section}</div>
                  <div className="text-sm text-muted-foreground">
                    {Math.floor(Math.random() * 5) + 1} tasks
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Task Board</h3>
              <Button 
                onClick={() => setShowAddTaskModal(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
            <KanbanBoard projectId={project.id} />
          </div>
        </TabsContent>

        <TabsContent value="calendar">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Project Calendar</h3>
              <Badge variant="outline" className="text-sm">
                {project.name} Timeline
              </Badge>
            </div>
            <CalendarView />
          </div>
        </TabsContent>

        <TabsContent value="files">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Project Files</h3>
              <Badge variant="outline" className="text-sm">
                {project.name} Assets
              </Badge>
            </div>
            <ProjectFiles projectId={project.id} projectName={project.name} />
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Project Team</h3>
              <Badge variant="outline" className="text-sm">
                {project.name} Team
              </Badge>
            </div>
            <ProjectTeam projectId={project.id} projectName={project.name} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        defaultProject={project.id?.toString()}
        projectId={project.id}
        onTaskCreate={(task) => {
          console.log('Task created for project:', project.name, task);
          setShowAddTaskModal(false);
        }}
      />
    </div>
  );
};

export default ProjectOverview;