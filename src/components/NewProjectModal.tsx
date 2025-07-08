import { useState } from "react";
import { Calendar, Users, Folder, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate?: any;
  onProjectCreate: (project: any) => void;
}

const NewProjectModal = ({ open, onOpenChange, selectedTemplate, onProjectCreate }: NewProjectModalProps) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    template: selectedTemplate?.id || '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    team: [] as string[]
  });

  const templates = [
    { id: 'personal', name: 'Personal Productivity' },
    { id: 'agile', name: 'Agile Development' },
    { id: 'finance', name: 'Finance Management' },
    { id: 'shipbuilding', name: 'Shipbuilding Projects' },
    { id: 'event', name: 'Event Planning' },
    { id: 'hr', name: 'HR / Recruitment' },
    { id: 'construction', name: 'Construction / Real Estate' },
    { id: 'consulting', name: 'Client Service / Consulting' },
    { id: 'education', name: 'Education / Course Planning' },
    { id: 'product', name: 'Product Launch Roadmaps' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData.name || !projectData.template) return;

    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date(),
      status: 'active',
      progress: 0
    };

    onProjectCreate(newProject);
    onOpenChange(false);
    
    // Reset form
    setProjectData({
      name: '',
      description: '',
      template: '',
      startDate: undefined,
      endDate: undefined,
      team: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Folder className="w-5 h-5 text-primary" />
            <span>Create New Project</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={projectData.name}
                onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="template">Choose Template *</Label>
              <Select
                value={projectData.template}
                onValueChange={(value) => setProjectData(prev => ({ ...prev, template: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {projectData.startDate ? format(projectData.startDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={projectData.startDate}
                    onSelect={(date) => setProjectData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    {projectData.endDate ? format(projectData.endDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={projectData.endDate}
                    onSelect={(date) => setProjectData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                    disabled={(date) => projectData.startDate ? date < projectData.startDate : false}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;