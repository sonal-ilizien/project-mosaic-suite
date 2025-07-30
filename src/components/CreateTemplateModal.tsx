import { useState } from "react";
import { 
  X,
  Plus,
  Tag,
  FileText,
  Calendar,
  Users,
  Sparkles
} from "lucide-react";
import { 
  CommonDialog,
  CommonInput,
  CommonTextarea,
  CommonSelect,
  CommonButton,
  CommonSectionHeader,
  CommonFormGrid,
  CommonFormActions,
  CommonTags
} from "./ui/common-dialog";

interface CreateTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (templateData: {
    name: string;
    category: string;
    domain: string;
    description: string;
    json_structure: { ideal: string };
    metadata: { estimated_duration: string; team_size: string };
    tags: string[];
  }) => void;
  isCreating?: boolean;
}

const CreateTemplateModal = ({ open, onOpenChange, onSubmit, isCreating = false }: CreateTemplateModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'project',
    domain: 'software',
    description: '',
    ideal: '',
    estimated_duration: '',
    team_size: '',
    tags: [] as string[]
  });

  const [newTag, setNewTag] = useState('');

  const categories = [
    { value: 'project', label: 'Project Management' },
    { value: 'task', label: 'Task Management' },
    { value: 'workflow', label: 'Workflow' },
    { value: 'process', label: 'Process' }
  ];

  const domains = [
    { value: 'software', label: 'Software Development' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'construction', label: 'Construction' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'event', label: 'Event Planning' },
    { value: 'product', label: 'Product Management' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateData = {
      name: formData.name,
      category: formData.category,
      domain: formData.domain,
      description: formData.description,
      json_structure: {
        ideal: formData.ideal
      },
      metadata: {
        estimated_duration: formData.estimated_duration,
        team_size: formData.team_size
      },
      tags: formData.tags
    };

    onSubmit(templateData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Create New Template"
      subtitle="Design a custom template for your projects"
      icon={Sparkles}
      maxWidth="max-w-6xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <CommonSectionHeader title="Basic Information" icon={FileText} />
          
          <div className="space-y-4">
            <CommonInput
              id="name"
              label="Template Name"
              value={formData.name}
              onChange={(value) => setFormData({...formData, name: value})}
              placeholder="e.g., Agile Development"
              required
            />

            <CommonFormGrid cols={2}>
              <CommonSelect
                id="category"
                label="Category"
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value})}
                placeholder="Select category"
                required
                options={categories}
              />

              <CommonSelect
                id="domain"
                label="Domain"
                value={formData.domain}
                onValueChange={(value) => setFormData({...formData, domain: value})}
                placeholder="Select domain"
                required
                options={domains}
              />
            </CommonFormGrid>

            <CommonTextarea
              id="description"
              label="Description"
              value={formData.description}
              onChange={(value) => setFormData({...formData, description: value})}
              placeholder="Describe what this template is for and its key features..."
              required
              rows={4}
            />
          </div>
        </div>

        {/* Template Structure */}
        <div className="space-y-4">
          <CommonSectionHeader title="Template Structure" icon={Sparkles} />
          
          <CommonTextarea
            id="ideal"
            label="Ideal Use Case"
            value={formData.ideal}
            onChange={(value) => setFormData({...formData, ideal: value})}
            placeholder="e.g., Ideal for software development teams using Agile methodologies"
            required
            rows={3}
          />
        </div>

        {/* Metadata */}
        <div className="space-y-4">
          <CommonSectionHeader title="Metadata" icon={Calendar} />
          
          <CommonFormGrid cols={2}>
            <CommonInput
              id="estimated_duration"
              label="Estimated Duration"
              value={formData.estimated_duration}
              onChange={(value) => setFormData({...formData, estimated_duration: value})}
              placeholder="e.g., 2 months"
            />

            <CommonInput
              id="team_size"
              label="Team Size"
              value={formData.team_size}
              onChange={(value) => setFormData({...formData, team_size: value})}
              placeholder="e.g., 10-50 people"
            />
          </CommonFormGrid>
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <CommonSectionHeader title="Tags" icon={Tag} />
          
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag..."
                className="flex-1 h-12 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-500 px-4"
              />
              <CommonButton
                type="button"
                onClick={handleAddTag}
                variant="outline"
                size="default"
                className="h-12 px-4"
              >
                <Plus className="w-4 h-4" />
              </CommonButton>
            </div>

            {formData.tags.length > 0 && (
              <CommonTags
                tags={formData.tags}
                onRemove={handleRemoveTag}
              />
            )}
          </div>
        </div>

        {/* Form Actions */}
        <CommonFormActions>
          <CommonButton
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isCreating}
          >
            Cancel
          </CommonButton>
          <CommonButton
            type="submit"
            disabled={!formData.name || !formData.description || !formData.ideal || isCreating}
            loading={isCreating}
          >
            {isCreating ? "Creating..." : "Create Template"}
          </CommonButton>
        </CommonFormActions>
      </form>
    </CommonDialog>
  );
};

export default CreateTemplateModal; 