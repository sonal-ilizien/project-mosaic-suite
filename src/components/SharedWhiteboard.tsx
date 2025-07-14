import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  MessageSquare
} from "lucide-react";

const SharedWhiteboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
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
      description: 'Users experiencing slow query response times during peak hours',
      category: 'backend',
      priority: 'high',
      status: 'open',
      tags: ['database', 'performance'],
      author: 'John Smith',
      createdAt: '2024-01-15',
      comments: 3,
      attachments: 1
    },
    {
      id: '2',
      type: 'best-practice',
      title: 'Code Review Checklist',
      description: 'Standardized checklist for all code reviews to ensure quality',
      category: 'development',
      priority: 'medium',
      status: 'resolved',
      tags: ['code-review', 'quality'],
      author: 'Sarah Johnson',
      createdAt: '2024-01-12',
      comments: 7,
      attachments: 2
    },
    {
      id: '3',
      type: 'document',
      title: 'API Documentation Template',
      description: 'Reusable template for documenting REST APIs',
      category: 'documentation',
      priority: 'low',
      status: 'draft',
      tags: ['api', 'documentation', 'template'],
      author: 'Mike Chen',
      createdAt: '2024-01-10',
      comments: 2,
      attachments: 0
    },
    {
      id: '4',
      type: 'issue',
      title: 'Mobile App Crash on iOS 15',
      description: 'App crashes when users try to upload images on iOS 15 devices',
      category: 'mobile',
      priority: 'urgent',
      status: 'open',
      tags: ['ios', 'crash', 'upload'],
      author: 'Alex Rodriguez',
      createdAt: '2024-01-16',
      comments: 5,
      attachments: 3
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
      attachments: 0
    };
    
    setItems([item, ...items]);
    setNewItem({ type: 'issue', title: '', description: '', category: '', priority: 'medium', tags: '' });
    setShowAddModal(false);
  };

  const getItemIcon = (type: string) => {
    const itemType = itemTypes.find(t => t.value === type);
    return itemType ? itemType.icon : AlertTriangle;
  };

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
          <DialogContent className="max-w-2xl">
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
            <Card key={item.id} className="p-4 hover:shadow-custom-md transition-all cursor-pointer">
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
    </div>
  );
};

export default SharedWhiteboard;