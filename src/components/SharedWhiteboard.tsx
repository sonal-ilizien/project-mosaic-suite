import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Search, 
  Tag, 
  FileText, 
  Link, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Filter,
  Paperclip,
  MessageSquare,
  Eye,
  MoreHorizontal,
  X,
  Download,
  ChevronDown,
  User,
  Calendar,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Heart,
  Archive,
  Trash2
} from "lucide-react";

// Utility function to generate initials from any name
const generateInitials = (name: string): string => {
  if (!name || typeof name !== 'string') return '';
  
  // Split the name into parts and filter out empty strings
  const nameParts = name.trim().split(' ').filter(part => part.length > 0);
  
  if (nameParts.length === 0) return '';
  
  if (nameParts.length === 1) {
    // If only one name, take first two letters
    return nameParts[0].substring(0, 2).toUpperCase();
  }
  
  // Take first letter of first name and first letter of last name
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  
  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
};

const SharedWhiteboard = () => {
  // Add custom CSS animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInFromRight {
        0% { transform: translateX(8px) scale(1); opacity: 0.9; }
        50% { transform: translateX(0px) scale(0.98); opacity: 1; }
        100% { transform: translateX(8px) scale(1); opacity: 0.9; }
      }
      @keyframes slideInFromLeft {
        0% { transform: translateX(-8px) scale(1); opacity: 0.9; }
        50% { transform: translateX(0px) scale(0.98); opacity: 1; }
        100% { transform: translateX(-8px) scale(1); opacity: 0.9; }
      }
      @keyframes gentleBounce {
        0% { transform: translateY(0px) scale(1); }
        50% { transform: translateY(-8px) scale(0.98); }
        100% { transform: translateY(0px) scale(1); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof items[0] | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentsExpanded, setCommentsExpanded] = useState(true);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showSidebarOptionsMenu, setShowSidebarOptionsMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showLabelsModal, setShowLabelsModal] = useState(false);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [showReporterModal, setShowReporterModal] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [selectedReporter, setSelectedReporter] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [newItem, setNewItem] = useState({
    type: 'issue',
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    tags: ''
  });

  const [items, setItems] = useState([
    {
      id: '1',
      type: 'issue',
      title: 'Database Connection Timeout',
      description: 'Users experiencing slow query response times during peak hours. The issue occurs specifically during peak traffic periods between 2-4 PM when concurrent users exceed 1000. We need to investigate the connection pooling configuration and potentially increase the pool size.',
      category: 'backend',
      priority: 'high',
      status: 'open',
      tags: ['database', 'performance'],
      author: 'John Smith',
      createdAt: '2024-01-15',
      comments: 3,
      attachments: 1,
      attachmentsList: [
        {
          name: 'database_performance_report.pdf',
          size: '2.1 MB',
          type: 'pdf',
          url: '#',
          description: '',
          file: undefined
        }
      ],
      commentsList: [
        {
          id: '1',
          author: 'Sarah Johnson',
          content: 'I\'ve noticed this issue as well. The connection pool might be exhausted.',
          createdAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          author: 'Mike Chen',
          content: 'Let\'s check the connection pool configuration in the settings.',
          createdAt: '2024-01-15T14:20:00Z'
        },
        {
          id: '3',
          author: 'Alex Rodriguez',
          content: 'I\'ve noticed this issue as well. The connection pool might be exhausted.',
          createdAt: '2024-01-15T10:30:00Z'
        }
      ],
      assignee: 'Sarah Johnson',
      reporter: 'John Smith',
      development: {
        branches: 3,
        commits: 5,
        pullRequests: 2
      }
    },
    {
      id: '2',
      type: 'best-practice',
      title: 'Code Review Checklist',
      description: 'Standardized checklist for all code reviews to ensure quality and consistency across the team. This checklist covers security, performance, and maintainability aspects.',
      category: 'development',
      priority: 'medium',
      status: 'resolved',
      tags: ['code-review', 'quality'],
      author: 'Sarah Johnson',
      createdAt: '2024-01-12',
      comments: 7,
      attachments: 2,
      attachmentsList: [
        {
          name: 'code_review_checklist.pdf',
          size: '1.8 MB',
          type: 'pdf',
          url: '#',
          description: '',
          file: undefined
        },
        {
          name: 'review_examples.docx',
          size: '3.2 MB',
          type: 'docx',
          url: '#',
          description: '',
          file: undefined
        }
      ],
      commentsList: [
        {
          id: '1',
          author: 'Mike Chen',
          content: 'Great checklist! This will help standardize our review process.',
          createdAt: '2024-01-12T11:00:00Z'
        },
        {
          id: '2',
          author: 'Alex Rodriguez',
          content: 'Should we add a section about security best practices?',
          createdAt: '2024-01-12T15:30:00Z'
        }
      ],
      assignee: 'Sarah Johnson',
      reporter: 'Sarah Johnson',
      development: {
        branches: 1,
        commits: 3,
        pullRequests: 1
      }
    },
    {
      id: '3',
      type: 'document',
      title: 'API Documentation Template',
      description: 'Reusable template for documenting REST APIs with consistent formatting and structure.',
      category: 'documentation',
      priority: 'low',
      status: 'draft',
      tags: ['api', 'documentation', 'template'],
      author: 'Mike Chen',
      createdAt: '2024-01-10',
      comments: 2,
      attachments: 0,
      attachmentsList: [],
      commentsList: [
        {
          id: '1',
          author: 'John Smith',
          content: 'This template looks good. Can we add more examples?',
          createdAt: '2024-01-10T16:45:00Z'
        },
        {
          id: '2',
          author: 'Mike Chen',
          content: 'I\'ll add more examples and update the template.',
          createdAt: '2024-01-11T09:20:00Z'
        }
      ],
      assignee: 'Mike Chen',
      reporter: 'Mike Chen',
      development: {
        branches: 0,
        commits: 0,
        pullRequests: 0
      }
    },
    {
      id: '4',
      type: 'issue',
      title: 'Mobile App Crash on iOS 15',
      description: 'App crashes when users try to upload images on iOS 15 devices. The crash occurs specifically when users attempt to upload images larger than 5MB. We need to investigate the image compression and upload handling.',
      category: 'mobile',
      priority: 'urgent',
      status: 'open',
      tags: ['ios', 'crash', 'upload'],
      author: 'Alex Rodriguez',
      createdAt: '2024-01-16',
      comments: 5,
      attachments: 3,
      attachmentsList: [
        {
          name: 'crash_log_ios15.txt',
          size: '156 KB',
          type: 'txt',
          url: '#',
          description: '',
          file: undefined
        },
        {
          name: 'screenshot_crash.png',
          size: '2.4 MB',
          type: 'png',
          url: '#',
          description: '',
          file: undefined
        },
        {
          name: 'ios_user_app_style_guidelines.pdf',
          size: '2.9 MB',
          type: 'pdf',
          url: '#',
          description: '',
          file: undefined
        }
      ],
      commentsList: [
        {
          id: '1',
          author: 'John Smith',
          content: 'I can reproduce this issue on my iOS 15 device.',
          createdAt: '2024-01-16T10:15:00Z'
        },
        {
          id: '2',
          author: 'Sarah Johnson',
          content: 'Let\'s check the image compression settings.',
          createdAt: '2024-01-16T14:30:00Z'
        }
      ],
      assignee: 'Alex Rodriguez',
      reporter: 'Alex Rodriguez',
      development: {
        branches: 2,
        commits: 8,
        pullRequests: 3
      }
    }
  ]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'backend', label: 'Backend' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'qa', label: 'QA Testing' },
    { value: 'deployment', label: 'Deployment' },
    { value: 'development', label: 'Development' },
    { value: 'documentation', label: 'Documentation' }
  ];

  const itemTypes = [
    { value: 'issue', label: 'Issue', icon: AlertTriangle },
    { value: 'best-practice', label: 'Best Practice', icon: CheckCircle },
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'link', label: 'Link', icon: Link }
  ];

  const priorityColors = {
    low: 'bg-muted text-muted-foreground',
    medium: 'bg-warning text-white',
    high: 'bg-destructive text-white',
    urgent: 'bg-red-600 text-white'
  };

  const statusColors = {
    open: 'bg-warning text-white',
    'in-progress': 'bg-primary text-white',
    resolved: 'bg-success text-white',
    draft: 'bg-muted text-muted-foreground'
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    const item = {
      id: Date.now().toString(),
      ...newItem,
      tags: newItem.tags.split(',').map(t => t.trim()).filter(t => t),
      status: newItem.type === 'best-practice' ? 'resolved' : 'open',
      author: 'Current User',
      createdAt: new Date().toISOString().split('T')[0],
      comments: 0,
      attachments: 0,
      attachmentsList: [],
      commentsList: [],
      assignee: 'Current User',
      reporter: 'Current User',
      development: {
        branches: 0,
        commits: 0,
        pullRequests: 0
      }
    };
    
    setItems([item, ...items]);
    setNewItem({ type: 'issue', title: '', description: '', category: '', priority: 'medium', tags: '' });
    setShowAddModal(false);
  };

  const getItemIcon = (type: string) => {
    const itemType = itemTypes.find(t => t.value === type);
    return itemType ? itemType.icon : AlertTriangle;
  };

  const handleOpenDetail = (item: typeof items[0]) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedItem) return;
    
    const comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, commentsList: [...item.commentsList, comment], comments: item.comments + 1 }
        : item
    ));
    
    setSelectedItem({
      ...selectedItem,
      commentsList: [...selectedItem.commentsList, comment],
      comments: selectedItem.comments + 1
    });
    
    setNewComment('');
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedItem) return;
    
    setItems(items.map(item => 
      item.id === selectedItem.id 
        ? { ...item, status: newStatus }
        : item
    ));
    
    setSelectedItem({
      ...selectedItem,
      status: newStatus
    });
    
    setShowStatusDropdown(false);
  };

  const handleDevelopmentAdd = () => {
    setShowDevelopmentModal(true);
  };

  const handleUploadDocument = () => {
    setShowUploadModal(true);
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  const handleOptionsMenu = () => {
    setShowOptionsMenu(!showOptionsMenu);
  };

  const handleSidebarOptionsMenu = () => {
    setShowSidebarOptionsMenu(!showSidebarOptionsMenu);
  };

  const handleViewMenu = () => {
    setShowViewMenu(!showViewMenu);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleUpload = () => {
    // Here you would typically upload the files to your server
    console.log('Uploading files:', selectedFiles);
    console.log('Description:', uploadDescription);
    
    // Add uploaded files to the selected item
    if (selectedItem) {
      const newAttachments = selectedFiles.map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.name.split('.').pop() || 'unknown',
        url: '#',
        description: uploadDescription,
        file: file // Store the actual file object for download
      }));
      
      setItems(items.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              attachmentsList: [...item.attachmentsList, ...newAttachments],
              attachments: item.attachments + selectedFiles.length
            }
          : item
      ));
      
      setSelectedItem({
        ...selectedItem,
        attachmentsList: [...selectedItem.attachmentsList, ...newAttachments],
        attachments: selectedItem.attachments + selectedFiles.length
      });
    }
    
    // Reset form and close modal
    setSelectedFiles([]);
    setUploadDescription('');
    setShowUploadModal(false);
  };

  const handleDownload = (attachment: { name: string; url: string; file?: File }) => {
    if (attachment.file) {
      // For newly uploaded files, create download link from file object
      const url = URL.createObjectURL(attachment.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // For existing files, try to download from URL
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Click outside handler for status dropdown
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const sidebarOptionsMenuRef = useRef<HTMLDivElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
        setShowOptionsMenu(false);
      }
      if (sidebarOptionsMenuRef.current && !sidebarOptionsMenuRef.current.contains(event.target as Node)) {
        setShowSidebarOptionsMenu(false);
      }
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setShowViewMenu(false);
      }
    };

    if (showStatusDropdown || showOptionsMenu || showSidebarOptionsMenu || showViewMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showStatusDropdown, showOptionsMenu, showSidebarOptionsMenu, showViewMenu]);

  return (
    <div 
      className="p-6 space-y-6 min-h-screen"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--background)) 0%, hsl(var(--background-secondary)) 50%, hsl(var(--background-tertiary)) 100%)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Company Whiteboard</h1>
          <p className="text-muted-foreground mt-1">Shared knowledge base for team collaboration</p>
        </div>
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-none">
            <DialogHeader>
              <DialogTitle>Add New Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Type</Label>
                <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          <type.icon className="w-4 h-4 mr-2" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Title</Label>
                <Input
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({ ...newItem, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Priority</Label>
                  <Select value={newItem.priority} onValueChange={(value) => setNewItem({ ...newItem, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Tags (comma-separated)</Label>
                <Input
                  value={newItem.tags}
                  onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                  placeholder="e.g., backend, performance, database"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem} disabled={!newItem.title || !newItem.description}>
                Add Item
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex space-x-3">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const ItemIcon = getItemIcon(item.type);
          return (
            <Card 
              key={item.id} 
              className="p-4 hover:shadow-custom-md transition-all cursor-pointer"
              onClick={() => handleOpenDetail(item)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ItemIcon className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline" className="text-xs">
                    {itemTypes.find(t => t.value === item.type)?.label}
                  </Badge>
                </div>
                <div className="flex space-x-1">
                  <Badge className={`text-xs ${priorityColors[item.priority as keyof typeof priorityColors]}`}>
                    {item.priority}
                  </Badge>
                  <Badge className={`text-xs ${statusColors[item.status as keyof typeof statusColors]}`}>
                    {item.status}
                  </Badge>
                </div>
              </div>

              <h3 className="font-medium text-foreground mb-2 line-clamp-2">
                {item.title}
              </h3>

              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {item.description}
              </p>

              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-3">
                  <span>{item.author}</span>
                  <span>{item.createdAt}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.comments > 0 && (
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>{item.comments}</span>
                    </div>
                  )}
                  {item.attachments > 0 && (
                    <div className="flex items-center space-x-1">
                      <Paperclip className="w-3 h-3" />
                      <span>{item.attachments}</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No items found</h3>
            <p>Try adjusting your search terms or filters, or add a new item.</p>
          </div>
        </Card>
      )}

      {/* Upload Document Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Paperclip className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                ref={(input) => {
                  if (input) {
                    input.style.display = 'none';
                  }
                }}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="cursor-pointer"
                onClick={() => {
                  const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                  if (fileInput) {
                    fileInput.click();
                  }
                }}
              >
                Choose Files
              </Button>
              {selectedFiles.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                  <div className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea 
                placeholder="Add a description for the document" 
                rows={2}
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedFiles([]);
                setUploadDescription('');
                setShowUploadModal(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
            >
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Labels Modal */}
      <Dialog open={showLabelsModal} onOpenChange={setShowLabelsModal}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Add Labels</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Labels (comma-separated)</Label>
              <Input
                placeholder="e.g., bug, feature, high-priority"
                className="mt-1"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.currentTarget.value;
                    if (value.trim()) {
                      setSelectedLabels([...selectedLabels, value.trim()]);
                      e.currentTarget.value = '';
                    }
                  }
                }}
              />
            </div>
            <div>
              <Label>Available Labels</Label>
              <div className="mt-2 space-y-2">
                {['bug', 'feature', 'high-priority', 'documentation'].map((label) => (
                  <div key={label} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={label} 
                      className="rounded"
                      checked={selectedLabels.includes(label)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedLabels([...selectedLabels, label]);
                        } else {
                          setSelectedLabels(selectedLabels.filter(l => l !== label));
                        }
                      }}
                    />
                    <label htmlFor={label} className="text-sm">{label}</label>
                  </div>
                ))}
              </div>
            </div>
            {selectedLabels.length > 0 && (
              <div>
                <Label>Selected Labels</Label>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedLabels.map((label, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                      {label}
                      <button
                        onClick={() => setSelectedLabels(selectedLabels.filter((_, i) => i !== index))}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowLabelsModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowLabelsModal(false)}>
              Add Labels
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Assignee Modal */}
      <Dialog open={showAssigneeModal} onOpenChange={setShowAssigneeModal}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Change Assignee</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Assignee</Label>
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                  <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowAssigneeModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAssigneeModal(false)}>
              Change Assignee
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reporter Modal */}
      <Dialog open={showReporterModal} onOpenChange={setShowReporterModal}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Change Reporter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Reporter</Label>
              <Select value={selectedReporter} onValueChange={setSelectedReporter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose reporter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                  <SelectItem value="John Smith">John Smith</SelectItem>
                  <SelectItem value="Mike Chen">Mike Chen</SelectItem>
                  <SelectItem value="Alex Rodriguez">Alex Rodriguez</SelectItem>
                  <SelectItem value="Emily Davis">Emily Davis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowReporterModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowReporterModal(false)}>
              Change Reporter
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Development Modal */}
      <Dialog open={showDevelopmentModal} onOpenChange={setShowDevelopmentModal}>
        <DialogContent className="max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle>Add Development Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="branch">Branch</SelectItem>
                  <SelectItem value="commit">Commit</SelectItem>
                  <SelectItem value="pull-request">Pull Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input placeholder="Enter title" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea placeholder="Enter description" rows={3} />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <Button variant="outline" onClick={() => setShowDevelopmentModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowDevelopmentModal(false)}>
              Add Item
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detailed View Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-8xl w-[98vw] max-h-[98vh] overflow-hidden p-0 rounded-none animate-in fade-in-0 zoom-in-95 duration-500">
          {selectedItem && (
            <div className="flex h-full max-h-[95vh]">
              {/* Main Content */}
              <div className="w-[70%] overflow-y-auto p-6 min-w-0">
                {/* Header */}
                <div className="mb-6 bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 -mx-6 -mt-6 px-6 py-3 animate-in slide-in-from-top-2 duration-700">
                  <div className="mb-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center animate-in bounce-in duration-800 delay-300 hover:scale-110 hover:rotate-12 transition-all duration-300">
                        <FileText className="w-5 h-5 text-white animate-pulse" />
                    </div>
                      <h2 className="text-3xl font-bold text-slate-800 break-words animate-in slide-in-from-left-4 duration-1000 delay-600">{selectedItem.title}</h2>
                  </div>
                    <div className="text-sm text-slate-200 mb-1"></div>
                  </div>
                  <div className="flex items-center space-x-1 animate-in slide-in-from-right-4 duration-700 delay-1200">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                      onClick={handleUploadDocument}
                      title="Upload document"
                    >
                      <Paperclip className="w-4 h-4 text-slate-700 hover:animate-spin" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300 ${isLiked ? 'text-red-500' : ''}`}
                      onClick={handleLikeToggle}
                      title={isLiked ? "Unlike" : "Like"}
                    >
                      <Heart className={`w-4 h-4 text-slate-700 hover:animate-pulse ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                      onClick={() => setShowDetailModal(false)}
                      title="Close"
                    >
                      <X className="w-4 h-4 text-slate-700 hover:animate-spin" />
                    </Button>
                    <div className="relative" ref={optionsMenuRef}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                          className="h-8 w-8 p-0 hover:bg-white/20 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                        onClick={handleOptionsMenu}
                        title="More options"
                      >
                          <MoreHorizontal className="w-4 h-4 text-slate-700 hover:animate-pulse" />
                      </Button>
                      
                      {showOptionsMenu && (
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                          <div className="py-2">
                            <button
                              onClick={() => {
                                // Copy link functionality
                                navigator.clipboard.writeText(window.location.href);
                                setShowOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                            >
                              <Link className="w-4 h-4 mr-3 text-gray-500" />
                              Copy link
                            </button>
                            <button
                              onClick={() => {
                                // Export functionality
                                setShowOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                            >
                              <Download className="w-4 h-4 mr-3 text-gray-500" />
                              Export
                            </button>
                            <button
                              onClick={() => {
                                // Archive functionality
                                setShowOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                            >
                              <Archive className="w-4 h-4 mr-3 text-gray-500" />
                              Archive
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              onClick={() => {
                                // Delete functionality
                                setShowOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-5 animate-in zoom-in-50 duration-1000 delay-1500">
                  <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-6 rounded-xl border border-slate-300/50 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200">
                    <p className="text-slate-800 leading-relaxed text-base break-words animate-in fade-in-0 duration-1000 delay-2000">
                      {selectedItem.description.split(' ').map((word, index) => (
                        <span 
                          key={index} 
                          className="inline-block animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
                          style={{ animationDelay: `${2000 + (index * 50)}ms` }}
                        >
                          {word}&nbsp;
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                {/* Attachments */}
                {selectedItem.attachmentsList.length > 0 && (
                  <div className="mb-4 animate-in slide-in-from-left-4 duration-1000 delay-2000">
                    <h3 className="font-semibold text-foreground mb-4 text-lg">Attachments</h3>
                    <div className={`grid gap-4 ${selectedItem.attachmentsList.length === 1 ? 'grid-cols-1' : selectedItem.attachmentsList.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} ${selectedItem.attachmentsList.length > 3 ? 'max-h-40 overflow-y-auto pr-2' : ''}`}>
                      {selectedItem.attachmentsList.map((attachment, index) => (
                        <div key={index} className="flex flex-col items-center p-3 border border-gray-200 rounded-lg bg-gray-50 min-w-0 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200">
                          <div className="w-16 h-12 bg-white rounded-lg border flex items-center justify-center flex-shrink-0 mb-2">
                            <FileText className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0 text-center">
                            <div className="font-medium text-foreground text-sm break-words line-clamp-2">{attachment.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{attachment.size}</div>
                            {attachment.description && (
                              <div className="text-xs text-gray-600 mt-1 italic break-words line-clamp-1">
                                "{attachment.description}"
                              </div>
                            )}
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-primary/20 hover:text-foreground mt-2"
                            onClick={() => handleDownload(attachment)}
                            title={`Download ${attachment.name}`}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity/Comments */}
                <div className="bg-gradient-to-r from-slate-100 to-slate-200 rounded-lg border border-slate-300 p-4 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 animate-in slide-in-from-right-4 duration-1000 delay-2500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground text-lg">Activity</h3>
                                          <Button 
                      variant="outline" 
                        size="sm" 
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                      className="flex items-center space-x-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-slate-300"
                      >
                      <span className="text-sm font-medium">Comments</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${commentsExpanded ? 'rotate-180' : ''}`} />
                    </Button>
                  </div>
                  
                  {/* Comments List - Show above input when expanded */}
                  {commentsExpanded && (
                                          <div className={`space-y-4 ${selectedItem.commentsList.length > 2 ? 'max-h-32 overflow-y-auto pr-2' : ''}`}>
                      {selectedItem.commentsList.map((comment) => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback>{generateInitials(comment.author)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-foreground">{comment.author}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-foreground leading-relaxed break-words">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  
                {/* Comment Input - Outside the Activity card */}
                <div className="flex items-center space-x-3 mt-4">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback>{generateInitials('Current User')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newComment.trim()) {
                            handleAddComment();
                          }
                        }}
                        className="flex-1"
                      />
                    </div>
                    <Button 
                      onClick={handleAddComment} 
                      disabled={!newComment.trim()} 
                      className="px-4"
                    >
                      Add Comment
                    </Button>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="w-[30%] border-l border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 p-6 flex flex-col min-w-0 h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 bg-gradient-to-r from-blue-100 via-blue-50 to-indigo-100 -mx-6 -mt-6 px-6 py-7 animate-in slide-in-from-top-2 duration-700">
                  <div className="animate-in slide-in-from-left-4 duration-1000 delay-800">
                                          <h3 className="font-bold text-slate-800 text-xl">Details</h3>
                      <p className="text-slate-600 text-sm mt-1">Item information & actions</p>
                  </div>
                  <div className="flex space-x-1">
                  <div className="relative" ref={viewMenuRef}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                        className="h-9 w-9 p-0 hover:bg-white/20 hover:text-white rounded-lg transition-all hover:scale-110 hover:rotate-6 duration-300"
                      onClick={handleViewMenu}
                      title="View options"
                    >
                        <Eye className="w-4 h-4 text-slate-700 hover:animate-pulse" />
                    </Button>
                    
                    {showViewMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowViewMenu(false);
                            }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                          >
                              <Eye className="w-4 h-4 mr-3 text-slate-500" />
                            View details
                          </button>
                          <button
                            onClick={() => {
                              setShowViewMenu(false);
                            }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                          >
                              <User className="w-4 h-4 mr-3 text-slate-500" />
                            View assignee
                          </button>
                          <button
                            onClick={() => {
                              setShowViewMenu(false);
                            }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                          >
                              <Calendar className="w-4 h-4 mr-3 text-slate-500" />
                            View timeline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="relative" ref={sidebarOptionsMenuRef}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                        className="h-9 w-9 p-0 hover:bg-white/20 hover:text-white rounded-lg transition-all hover:scale-110 hover:rotate-6 duration-300"
                      onClick={handleSidebarOptionsMenu}
                      title="More options"
                    >
                        <MoreHorizontal className="w-4 h-4 text-slate-700 hover:animate-pulse" />
                    </Button>
                    
                    {showSidebarOptionsMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-50">
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setShowSidebarOptionsMenu(false);
                            }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                          >
                              <User className="w-4 h-4 mr-3 text-slate-500" />
                            Change assignee
                          </button>
                          <button
                            onClick={() => {
                              setShowSidebarOptionsMenu(false);
                            }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                          >
                              <Tag className="w-4 h-4 mr-3 text-slate-500" />
                            Add labels
                          </button>
                          <button
                            onClick={() => {
                              setShowSidebarOptionsMenu(false);
                            }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                          >
                              <Clock className="w-4 h-4 mr-3 text-slate-500" />
                            Set due date
                          </button>
                            <div className="border-t border-slate-100 my-1"></div>
                          <button
                            onClick={() => {
                              setShowSidebarOptionsMenu(false);
                            }}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-red-50 text-red-600 flex items-center transition-colors"
                          >
                            <Trash2 className="w-4 h-4 mr-3" />
                            Delete item
                          </button>
                        </div>
                      </div>
                    )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* First Row: Status and Assignee */}
                  <div className="grid grid-cols-2 gap-4 animate-in zoom-in-50 duration-800 delay-3000">
                  {/* Status */}
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 relative z-10" style={{ animation: 'gentleBounce 4s ease-in-out infinite', animationDelay: '0s' }}>
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" style={{ animation: 'ping 4s ease-in-out infinite' }}></div>
                        Status
                      </h4>
                    <div className="relative" ref={statusDropdownRef}>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="default" 
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shadow-md hover:shadow-lg ${
                              selectedItem.status === 'resolved' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' :
                              selectedItem.status === 'open' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' :
                              selectedItem.status === 'in-progress' ? 'bg-blue-500 hover:bg-blue-600 shadow-blue-200' :
                              'bg-slate-500 hover:bg-slate-600 shadow-slate-200'
                          } text-white`}
                          onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                        >
                          {selectedItem.status === 'resolved' ? 'Done' : 
                           selectedItem.status === 'open' ? 'Open' : 
                           selectedItem.status === 'in-progress' ? 'In Progress' :
                           selectedItem.status}
                        </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-slate-100 rounded-lg transition-all"
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                          >
                            <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                          </Button>
                      </div>
                      
                      {showStatusDropdown && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-[9999]">
                            <div className="py-2">
                            <button
                              onClick={() => handleStatusChange('open')}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-orange-50 hover:text-orange-700 flex items-center transition-colors"
                            >
                              <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                              Open
                            </button>
                            <button
                              onClick={() => handleStatusChange('in-progress')}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-700 flex items-center transition-colors"
                            >
                              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                              In Progress
                            </button>
                            <button
                              onClick={() => handleStatusChange('resolved')}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-emerald-50 hover:text-emerald-700 flex items-center transition-colors"
                            >
                                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                              Done
                            </button>
                            <button
                              onClick={() => handleStatusChange('draft')}
                                className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 hover:text-slate-700 flex items-center transition-colors"
                            >
                                <div className="w-3 h-3 bg-slate-500 rounded-full mr-3"></div>
                              Draft
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Assignee */}
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 cursor-pointer" onClick={() => setShowAssigneeModal(true)} style={{ animation: 'gentleBounce 4s ease-in-out infinite', animationDelay: '0s' }}>
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-slate-500" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
                        Assignee
                      </h4>
                                              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                          <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm hover:scale-110 transition-transform duration-200">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-xs animate-pulse">
                              {generateInitials(selectedAssignee || selectedItem.assignee)}
                            </AvatarFallback>
                      </Avatar>
                        <div>
                          <span className="font-medium text-slate-800 text-sm">
                            {selectedAssignee || selectedItem.assignee}
                          </span>
                          <div className="text-xs text-slate-500">Assigned</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">Click to change assignee</div>
                    </div>
                  </div>

                  {/* Second Row: Labels and Reporter */}
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-800 delay-3500">
                  {/* Labels */}
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 cursor-pointer" onClick={() => setShowLabelsModal(true)} style={{ animation: 'gentleBounce 4s ease-in-out infinite', animationDelay: '0s' }}>
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                        <Tag className="w-4 h-4 mr-2 text-slate-500" style={{ animation: 'spin 6s linear infinite' }} />
                        Labels
                      </h4>
                      <div className="text-slate-500 text-sm italic">
                        {selectedLabels.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedLabels.map((label, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "No labels added"
                        )}
                      </div>
                      <div className="mt-2 text-xs text-slate-400">Click to add labels</div>
                  </div>

                  {/* Reporter */}
                    <div className="bg-white rounded-xl p-2 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 cursor-pointer" onClick={() => setShowReporterModal(true)} style={{ animation: 'gentleBounce 4s ease-in-out infinite', animationDelay: '0s' }}>
                      <h4 className="font-semibold text-slate-800 mb-2 flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-slate-500" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
                        Reporter
                      </h4>
                                              <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200">
                          <Avatar className="w-8 h-8 ring-2 ring-white shadow-sm hover:scale-110 transition-transform duration-200">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white font-semibold text-xs animate-pulse">
                              {generateInitials(selectedReporter || selectedItem.reporter)}
                            </AvatarFallback>
                      </Avatar>
                        <div>
                          <span className="font-medium text-slate-800 text-sm">
                            {selectedReporter || selectedItem.reporter}
                          </span>
                          <div className="text-xs text-slate-500">Reporter</div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-slate-400">Click to change reporter</div>
                    </div>
                  </div>

                  {/* Development */}
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 animate-in slide-in-from-left-4 duration-800 delay-4000" style={{ animation: 'slideInFromLeft 4s ease-in-out infinite', animationDelay: '0s' }}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-slate-800 flex items-center">
                        <GitBranch className="w-4 h-4 mr-2 text-slate-500" />
                        Development
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition-all hover:scale-110 hover:rotate-90 duration-300"
                        onClick={handleDevelopmentAdd}
                      >
                        <Plus className="w-4 h-4 hover:animate-pulse" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <GitBranch className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{selectedItem.development.branches} branches</span>
                      </div>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <GitCommit className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{selectedItem.development.commits} commits</span>
                        </div>
                        <span className="text-xs text-slate-500">9 days ago</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <GitPullRequest className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-700">{selectedItem.development.pullRequests} pull requests</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-6 px-3 text-xs font-medium hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all">
                          OPEN
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Share and Embed */}
                  <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 hover:shadow-lg hover:shadow-blue-200/50 transition-all duration-200 animate-in slide-in-from-right-4 duration-800 delay-4500" style={{ animation: 'slideInFromRight 4s ease-in-out infinite', animationDelay: '0s' }}>
                    <h4 className="font-semibold text-slate-800 mb-3 flex items-center">
                                              <Link className="w-4 h-4 mr-2 text-slate-500" style={{ animation: 'pulse 3s ease-in-out infinite' }} />
                      Share and Embed
                    </h4>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-all hover:scale-105 duration-200"
                    >
                      <Link className="w-4 h-4 mr-2 hover:animate-pulse" />
                      Open Share and Embed
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharedWhiteboard;