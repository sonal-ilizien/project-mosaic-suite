import { useState } from "react";
import { 
  Plus, 
  MoreHorizontal, 
  User, 
  Calendar, 
  Flag,
  MessageSquare,
  Paperclip,
  Settings,
  Eye,
  Filter,
  List
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddTaskModal from "./AddTaskModal";

interface KanbanBoardProps {
  tasks?: any[];
}

const KanbanBoard = ({ tasks = [] }: KanbanBoardProps) => {
  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    viewType: 'flat', // 'flat' or 'nested'
    showCompleted: true,
    groupBy: 'status' // 'status', 'priority', 'assignee'
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [columns] = useState([
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-muted',
      tasks: [
        {
          id: '1',
          title: 'Design new landing page',
          description: 'Create wireframes and mockups for the new marketing site',
          priority: 'High',
          assignee: { name: 'Sarah Chen', avatar: 'SC' },
          dueDate: 'Dec 15',
          comments: 3,
          attachments: 2,
          tags: ['Design', 'Marketing']
        },
        {
          id: '2',
          title: 'API Integration Research',
          description: 'Research third-party APIs for payment processing',
          priority: 'Medium',
          assignee: { name: 'Mike Johnson', avatar: 'MJ' },
          dueDate: 'Dec 18',
          comments: 1,
          attachments: 0,
          tags: ['Development', 'Research']
        }
      ]
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      color: 'bg-primary',
      tasks: [
        {
          id: '3',
          title: 'User Authentication System',
          description: 'Implement secure login and registration functionality',
          priority: 'High',
          assignee: { name: 'Alex Kim', avatar: 'AK' },
          dueDate: 'Dec 20',
          comments: 8,
          attachments: 3,
          tags: ['Development', 'Security']
        },
        {
          id: '4',
          title: 'Database Migration',
          description: 'Migrate user data from old system to new infrastructure',
          priority: 'Critical',
          assignee: { name: 'Emma Wilson', avatar: 'EW' },
          dueDate: 'Dec 16',
          comments: 5,
          attachments: 1,
          tags: ['Database', 'Migration']
        }
      ]
    },
    {
      id: 'review',
      title: 'In Review',
      color: 'bg-warning',
      tasks: [
        {
          id: '5',
          title: 'Mobile App Testing',
          description: 'Complete QA testing for iOS and Android versions',
          priority: 'Medium',
          assignee: { name: 'David Park', avatar: 'DP' },
          dueDate: 'Dec 14',
          comments: 12,
          attachments: 4,
          tags: ['Testing', 'Mobile']
        }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      color: 'bg-success',
      tasks: [
        {
          id: '6',
          title: 'Project Documentation',
          description: 'Create comprehensive documentation for the new features',
          priority: 'Low',
          assignee: { name: 'Lisa Rodriguez', avatar: 'LR' },
          dueDate: 'Dec 12',
          comments: 2,
          attachments: 5,
          tags: ['Documentation']
        },
        {
          id: '7',
          title: 'Brand Guidelines Update',
          description: 'Update brand guidelines with new color palette and fonts',
          priority: 'Medium',
          assignee: { name: 'Tom Anderson', avatar: 'TA' },
          dueDate: 'Dec 10',
          comments: 4,
          attachments: 8,
          tags: ['Design', 'Branding']
        }
      ]
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-destructive text-white';
      case 'High': return 'bg-warning text-white';
      case 'Medium': return 'bg-primary text-white';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Project Board</h1>
          <p className="text-muted-foreground">Mobile App Redesign Sprint</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={showDisplaySettings} onOpenChange={setShowDisplaySettings}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Display Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Display Settings</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">View Type</label>
                  <Select 
                    value={displaySettings.viewType} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, viewType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat View</SelectItem>
                      <SelectItem value="nested">Nested View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Group By</label>
                  <Select 
                    value={displaySettings.groupBy} 
                    onValueChange={(value) => setDisplaySettings({...displaySettings, groupBy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="assignee">Assignee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={displaySettings.showCompleted}
                    onChange={(e) => setDisplaySettings({...displaySettings, showCompleted: e.target.checked})}
                  />
                  <label className="text-sm">Show Completed Tasks</label>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <User className="w-4 h-4 mr-2" />
            Assign
          </Button>
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            Timeline
          </Button>
          <Button 
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => setShowAddTaskModal(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex space-x-6 overflow-x-auto pb-6">
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${column.color}`} />
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <Badge variant="outline" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {column.tasks.map((task) => (
                <Card key={task.id} className="p-4 hover:shadow-custom-md transition-all cursor-pointer">
                  {/* Task Header */}
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-foreground text-sm leading-tight">
                      {task.title}
                    </h4>
                    <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                      {task.priority}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    {task.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Task Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-6 h-6 bg-primary text-primary-foreground text-xs">
                        {task.assignee.avatar}
                      </Avatar>
                      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{task.dueDate}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {task.comments > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          <span>{task.comments}</span>
                        </div>
                      )}
                      {task.attachments > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          <Paperclip className="w-3 h-3" />
                          <span>{task.attachments}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add Task Button */}
              <Button 
                variant="ghost" 
                className="w-full border-2 border-dashed border-muted-foreground/30 hover:border-primary hover:bg-primary-light text-muted-foreground hover:text-primary"
                onClick={() => setShowAddTaskModal(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        open={showAddTaskModal}
        onOpenChange={setShowAddTaskModal}
        onTaskCreate={(task) => {
          console.log('Task created:', task);
          setShowAddTaskModal(false);
        }}
      />
    </div>
  );
};

export default KanbanBoard;