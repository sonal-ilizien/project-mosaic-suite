import { useState, useEffect, useRef } from "react";
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
  List,
  X,
  Download,
  ChevronDown,
  Heart,
  Archive,
  Trash2,
  Link,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Tag,
  Clock,
  FileText
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import AddTaskModal from "./AddTaskModal";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignee: { name: string; avatar: string };
  dueDate: string;
  comments: number;
  attachments: number;
  tags: string[];
  status: string;
  parentId: string | null;
  subtasks: string[];
  attachmentsList?: Array<{
    name: string;
    size: string;
    type: string;
    url: string;
    description: string;
    file?: File;
  }>;
  commentsList?: Array<{
    id: string;
    author: string;
    content: string;
    createdAt: string;
  }>;
  development?: {
    branches: number;
    commits: number;
    pullRequests: number;
  };
}

interface KanbanBoardProps {
  tasks?: Task[];
}

const KanbanBoard = ({ tasks = [] }: KanbanBoardProps) => {
  // Add custom CSS animations for card entrance
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes cardSlideIn {
        0% {
          opacity: 0;
          transform: translateY(-15px) scale(0.98);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .card-animate-in {
        animation: cardSlideIn 0.8s ease-out forwards;
        opacity: 1 !important;
      }
      
      .card-top-highlight {
        border: 2px solid #1e40af !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3) !important;
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
      }
      
      .card-top-highlight:hover {
        box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4) !important;
        transform: translateY(-3px);
      }
      
      .card-hover-highlight {
        border: 2px solid #1e40af !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3) !important;
        transform: translateY(-2px);
        transition: all 0.2s ease-in-out;
      }
      
      .card-hover-highlight:hover {
        box-shadow: 0 6px 16px rgba(30, 64, 175, 0.4) !important;
        transform: translateY(-3px);
      }
      
      .card-sequential-highlight {
        border: 2px solid #1e40af !important;
        box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3) !important;
        transform: translateY(-2px);
        transition: all 0.3s ease-in-out;
        animation: pulseBorder 2s ease-in-out infinite;
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      @keyframes pulseBorder {
        0%, 100% {
          box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
          opacity: 1;
        }
        50% {
          box-shadow: 0 6px 16px rgba(30, 64, 175, 0.5);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const [showDisplaySettings, setShowDisplaySettings] = useState(false);
  const [displaySettings, setDisplaySettings] = useState({
    viewType: 'flat', // 'flat' or 'nested'
    showCompleted: true,
    groupBy: 'status' // 'status', 'priority', 'assignee'
  });
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentsExpanded, setCommentsExpanded] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showSidebarOptionsMenu, setShowSidebarOptionsMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadDescription, setUploadDescription] = useState('');
  const [animationKey, setAnimationKey] = useState(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);
  const [columns, setColumns] = useState([
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-muted',
      tasks: [
          {
            id: '1',
            title: 'Design new landing page',
            description: 'Create wireframes and mockups for the new marketing site. This involves creating both low-fidelity wireframes and high-fidelity mockups for the new marketing site. The design should focus on user experience and conversion optimization.',
            priority: 'High',
            assignee: { name: 'Sarah Chen', avatar: 'SC' },
            dueDate: 'Dec 15',
            comments: 3,
            attachments: 2,
            tags: ['Design', 'Marketing'],
            status: 'todo',
            parentId: null,
            subtasks: ['1-1', '1-2'],
            attachmentsList: [
              {
                name: 'design_mockups.pdf',
                size: '2.1 MB',
                type: 'pdf',
                url: '#',
                description: '',
                file: undefined
              },
              {
                name: 'wireframes.sketch',
                size: '1.8 MB',
                type: 'sketch',
                url: '#',
                description: '',
                file: undefined
              }
            ],
            commentsList: [
              {
                id: '1',
                author: 'Mike Johnson',
                content: 'Great start on the wireframes! Can we add more mobile-first considerations?',
                createdAt: '2024-01-15T10:30:00Z'
              },
              {
                id: '2',
                author: 'Sarah Chen',
                content: 'I\'ll update the wireframes to be more mobile-responsive.',
                createdAt: '2024-01-15T14:20:00Z'
              },
              {
                id: '3',
                author: 'Alex Kim',
                content: 'The color scheme looks good. Should we test it with users?',
                createdAt: '2024-01-15T16:45:00Z'
              }
            ],
            development: {
              branches: 2,
              commits: 5,
              pullRequests: 1
            }
          },
          {
            id: '1-1',
            title: 'Create wireframes',
            description: 'Low-fidelity wireframes for main pages',
            priority: 'Medium',
            assignee: { name: 'Sarah Chen', avatar: 'SC' },
            dueDate: 'Dec 13',
            comments: 1,
            attachments: 0,
            tags: ['Design'],
            status: 'todo',
            parentId: '1',
            subtasks: [],
            attachmentsList: [],
            commentsList: [
              {
                id: '1',
                author: 'Sarah Chen',
                content: 'Started working on the wireframes for the homepage.',
                createdAt: '2024-01-13T09:15:00Z'
              }
            ],
            development: {
              branches: 1,
              commits: 2,
              pullRequests: 0
            }
          },
          {
            id: '1-2', 
            title: 'Design mockups',
            description: 'High-fidelity mockups based on wireframes',
            priority: 'Medium',
            assignee: { name: 'Sarah Chen', avatar: 'SC' },
            dueDate: 'Dec 15',
            comments: 0,
            attachments: 0,
            tags: ['Design'],
            status: 'todo',
            parentId: '1',
            subtasks: [],
            attachmentsList: [],
            commentsList: [],
            development: {
              branches: 0,
              commits: 0,
              pullRequests: 0
            }
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
            tags: ['Development', 'Research'],
            status: 'todo',
            parentId: null,
            subtasks: [],
            attachmentsList: [],
            commentsList: [
              {
                id: '1',
                author: 'Mike Johnson',
                content: 'Started researching Stripe and PayPal APIs.',
                createdAt: '2024-01-14T11:30:00Z'
              }
            ],
            development: {
              branches: 0,
              commits: 0,
              pullRequests: 0
            }
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
          description: 'Implement secure login and registration functionality with JWT tokens, password hashing, and multi-factor authentication support.',
          priority: 'High',
          assignee: { name: 'Alex Kim', avatar: 'AK' },
          dueDate: 'Dec 20',
          comments: 8,
          attachments: 3,
          tags: ['Development', 'Security'],
          status: 'inprogress',
          parentId: null,
          subtasks: [],
          attachmentsList: [
            {
              name: 'auth_specification.pdf',
              size: '1.2 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'security_requirements.docx',
              size: '856 KB',
              type: 'docx',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'jwt_implementation.md',
              size: '45 KB',
              type: 'md',
              url: '#',
              description: '',
              file: undefined
            }
          ],
          commentsList: [
            {
              id: '1',
              author: 'Alex Kim',
              content: 'Started implementing JWT token authentication.',
              createdAt: '2024-01-10T09:00:00Z'
            },
            {
              id: '2',
              author: 'Sarah Chen',
              content: 'Great progress! How are we handling password reset?',
              createdAt: '2024-01-10T14:30:00Z'
            },
            {
              id: '3',
              author: 'Alex Kim',
              content: 'I\'ll add password reset functionality next.',
              createdAt: '2024-01-11T10:15:00Z'
            },
            {
              id: '4',
              author: 'Mike Johnson',
              content: 'Should we implement OAuth for social login?',
              createdAt: '2024-01-11T16:45:00Z'
            },
            {
              id: '5',
              author: 'Alex Kim',
              content: 'Yes, that\'s a good idea. I\'ll add Google OAuth first.',
              createdAt: '2024-01-12T11:20:00Z'
            },
            {
              id: '6',
              author: 'David Park',
              content: 'The security audit looks good so far.',
              createdAt: '2024-01-12T15:30:00Z'
            },
            {
              id: '7',
              author: 'Alex Kim',
              content: 'Added multi-factor authentication support.',
              createdAt: '2024-01-13T09:45:00Z'
            },
            {
              id: '8',
              author: 'Sarah Chen',
              content: 'Excellent! This will greatly improve security.',
              createdAt: '2024-01-13T17:20:00Z'
            }
          ],
          development: {
            branches: 3,
            commits: 12,
            pullRequests: 2
          }
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
          tags: ['Database', 'Migration'],
          status: 'inprogress',
          parentId: null,
          subtasks: [],
          attachmentsList: [
            {
              name: 'migration_script.sql',
              size: '156 KB',
              type: 'sql',
              url: '#',
              description: '',
              file: undefined
            }
          ],
          commentsList: [
            {
              id: '1',
              author: 'Emma Wilson',
              content: 'Started the migration process. Taking backup first.',
              createdAt: '2024-01-12T08:00:00Z'
            },
            {
              id: '2',
              author: 'Alex Kim',
              content: 'Make sure to test the migration on staging first.',
              createdAt: '2024-01-12T10:30:00Z'
            },
            {
              id: '3',
              author: 'Emma Wilson',
              content: 'Backup completed successfully. Starting migration.',
              createdAt: '2024-01-12T14:15:00Z'
            },
            {
              id: '4',
              author: 'David Park',
              content: 'How long will the migration take?',
              createdAt: '2024-01-12T16:45:00Z'
            },
            {
              id: '5',
              author: 'Emma Wilson',
              content: 'Estimated 2-3 hours for the full migration.',
              createdAt: '2024-01-12T17:30:00Z'
            }
          ],
          development: {
            branches: 1,
            commits: 8,
            pullRequests: 1
          }
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
          tags: ['Testing', 'Mobile'],
          status: 'review',
          parentId: null,
          subtasks: [],
          attachmentsList: [
            {
              name: 'test_plan.pdf',
              size: '2.4 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'bug_report.xlsx',
              size: '1.8 MB',
              type: 'xlsx',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'screenshots.zip',
              size: '5.2 MB',
              type: 'zip',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'performance_report.pdf',
              size: '3.1 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            }
          ],
          commentsList: [
            {
              id: '1',
              author: 'David Park',
              content: 'Started testing on iOS devices.',
              createdAt: '2024-01-08T09:00:00Z'
            },
            {
              id: '2',
              author: 'Sarah Chen',
              content: 'Found a UI issue on iPhone 12. Will document.',
              createdAt: '2024-01-08T11:30:00Z'
            },
            {
              id: '3',
              author: 'David Park',
              content: 'Android testing completed. No major issues found.',
              createdAt: '2024-01-09T14:15:00Z'
            },
            {
              id: '4',
              author: 'Alex Kim',
              content: 'Great! How about performance testing?',
              createdAt: '2024-01-09T16:45:00Z'
            },
            {
              id: '5',
              author: 'David Park',
              content: 'Performance testing shows good results on both platforms.',
              createdAt: '2024-01-10T10:20:00Z'
            },
            {
              id: '6',
              author: 'Emma Wilson',
              content: 'Security testing completed. All checks passed.',
              createdAt: '2024-01-10T15:30:00Z'
            },
            {
              id: '7',
              author: 'David Park',
              content: 'Accessibility testing in progress.',
              createdAt: '2024-01-11T09:45:00Z'
            },
            {
              id: '8',
              author: 'Sarah Chen',
              content: 'Found some accessibility issues. Will create tickets.',
              createdAt: '2024-01-11T13:20:00Z'
            },
            {
              id: '9',
              author: 'David Park',
              content: 'Regression testing completed.',
              createdAt: '2024-01-12T11:00:00Z'
            },
            {
              id: '10',
              author: 'Alex Kim',
              content: 'Ready for final review and approval.',
              createdAt: '2024-01-12T16:30:00Z'
            },
            {
              id: '11',
              author: 'David Park',
              content: 'All test cases passed. Ready for production.',
              createdAt: '2024-01-13T14:15:00Z'
            },
            {
              id: '12',
              author: 'Sarah Chen',
              content: 'Excellent work! The app is ready for release.',
              createdAt: '2024-01-13T17:45:00Z'
            }
          ],
          development: {
            branches: 2,
            commits: 6,
            pullRequests: 1
          }
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
          tags: ['Documentation'],
          status: 'done',
          parentId: null,
          subtasks: [],
          attachmentsList: [
            {
              name: 'user_guide.pdf',
              size: '3.2 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'api_documentation.pdf',
              size: '2.8 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'deployment_guide.md',
              size: '156 KB',
              type: 'md',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'troubleshooting.pdf',
              size: '1.5 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'changelog.md',
              size: '89 KB',
              type: 'md',
              url: '#',
              description: '',
              file: undefined
            }
          ],
          commentsList: [
            {
              id: '1',
              author: 'Lisa Rodriguez',
              content: 'Completed user guide and API documentation.',
              createdAt: '2024-01-10T14:00:00Z'
            },
            {
              id: '2',
              author: 'Alex Kim',
              content: 'Great documentation! Very comprehensive.',
              createdAt: '2024-01-11T09:30:00Z'
            }
          ],
          development: {
            branches: 0,
            commits: 0,
            pullRequests: 0
          }
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
          tags: ['Design', 'Branding'],
          status: 'done',
          parentId: null,
          subtasks: [],
          attachmentsList: [
            {
              name: 'brand_guidelines.pdf',
              size: '4.2 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'color_palette.ai',
              size: '2.8 MB',
              type: 'ai',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'typography_guide.pdf',
              size: '1.5 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'logo_variations.zip',
              size: '8.5 MB',
              type: 'zip',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'icon_set.sketch',
              size: '3.1 MB',
              type: 'sketch',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'brand_assets.zip',
              size: '12.3 MB',
              type: 'zip',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'style_guide.pdf',
              size: '6.7 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            },
            {
              name: 'brand_manual.pdf',
              size: '9.8 MB',
              type: 'pdf',
              url: '#',
              description: '',
              file: undefined
            }
          ],
          commentsList: [
            {
              id: '1',
              author: 'Tom Anderson',
              content: 'Updated the color palette with new primary colors.',
              createdAt: '2024-01-08T10:00:00Z'
            },
            {
              id: '2',
              author: 'Sarah Chen',
              content: 'The new typography looks great!',
              createdAt: '2024-01-08T14:30:00Z'
            },
            {
              id: '3',
              author: 'Tom Anderson',
              content: 'Added comprehensive icon set and logo variations.',
              createdAt: '2024-01-09T11:15:00Z'
            },
            {
              id: '4',
              author: 'Alex Kim',
              content: 'Perfect! This will ensure brand consistency.',
              createdAt: '2024-01-09T16:45:00Z'
            }
          ],
          development: {
            branches: 0,
            commits: 0,
            pullRequests: 0
          }
        }
      ]
    }
  ]);

  // Trigger animations when component mounts or tasks change
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [columns]);

  // Sequential border animation through columns
  useEffect(() => {
    // Start the sequential animation after cards have finished animating in
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setActiveColumnIndex(prev => (prev + 1) % 4); // 4 columns: todo, inprogress, review, done
      }, 5000); // Change every 15 seconds

      return () => clearInterval(interval);
    }, 2000); // Wait 2 seconds for cards to finish animating

    return () => clearTimeout(timer);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-destructive text-white';
      case 'High': return 'bg-warning text-white';
      case 'Medium': return 'bg-primary text-white';
      case 'Low': return 'bg-muted text-muted-foreground';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  // Get filtered and grouped tasks based on display settings
  const getFilteredTasks = () => {
    let allTasks = [];
    columns.forEach(column => {
      allTasks.push(...column.tasks);
    });

    // Filter completed tasks if needed
    if (!displaySettings.showCompleted) {
      allTasks = allTasks.filter(task => task.status !== 'done');
    }

    return allTasks;
  };

  // Get tasks for specific column based on grouping
  const getTasksForColumn = (columnId: string) => {
    const allTasks = getFilteredTasks();
    
    if (displaySettings.groupBy === 'status') {
      return allTasks.filter(task => task.status === columnId);
    } else if (displaySettings.groupBy === 'priority') {
      return allTasks.filter(task => task.priority === columnId);
    } else if (displaySettings.groupBy === 'assignee') {
      return allTasks.filter(task => task.assignee.name === columnId);
    }
    
    return [];
  };

  // Get columns based on grouping
  const getDisplayColumns = () => {
    if (displaySettings.groupBy === 'priority') {
      return [
        { id: 'Critical', title: 'Critical', color: 'bg-destructive', tasks: [] },
        { id: 'High', title: 'High Priority', color: 'bg-warning', tasks: [] },
        { id: 'Medium', title: 'Medium Priority', color: 'bg-primary', tasks: [] },
        { id: 'Low', title: 'Low Priority', color: 'bg-muted', tasks: [] }
      ];
    } else if (displaySettings.groupBy === 'assignee') {
      const allTasks = getFilteredTasks();
      const assignees = [...new Set(allTasks.map(task => task.assignee.name))];
      return assignees.map(assignee => ({
        id: assignee,
        title: assignee,
        color: 'bg-primary',
        tasks: []
      }));
    } else {
      return columns;
    }
  };

  // Render nested task view
  const renderNestedTask = (task: Task, level: number = 0, index: number = 0, columnIndex: number = 0) => {
    const allTasks = getFilteredTasks();
    const subtasks = allTasks.filter(t => t.parentId === task.id);
    
    return (
      <div key={task.id} className={`${level > 0 ? 'ml-4 border-l border-border pl-3' : ''}`}>
        <Card 
          className={`p-4 hover:shadow-custom-md transition-all cursor-pointer mb-2 w-full card-animate-in ${
            hoveredCardId === task.id ? 'card-hover-highlight' : 
            index === 0 && activeColumnIndex === columnIndex ? 'card-sequential-highlight' : ''
          }`}
          style={{ 
            animationDelay: `${index * 300}ms`
          }}
          onMouseEnter={() => setHoveredCardId(task.id)}
          onMouseLeave={() => setHoveredCardId(null)}
        >
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
              <Avatar className="w-6 h-6 bg-primary text-primary-foreground text-xs flex items-center justify-center">
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

        {/* Render subtasks */}
        {displaySettings.viewType === 'nested' && subtasks.map((subtask, subIndex) => 
          renderNestedTask(subtask, level + 1, subIndex)
        )}
      </div>
    );
  };

  const addNewTask = (task: Task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      comments: 0,
      attachments: 0,
      status: 'todo',
      subtasks: [],
      attachmentsList: [],
      commentsList: [],
      development: {
        branches: 0,
        commits: 0,
        pullRequests: 0
      }
    };

    const targetColumnId = newTask.status;
    const updatedColumns = columns.map(column => {
      if (column.id === targetColumnId) {
        return {
          ...column,
          tasks: [...column.tasks, newTask]
        };
      }
      return column;
    });
    
    setColumns(updatedColumns);
  };

  const handleOpenDetail = (task: Task) => {
    setSelectedTask(task);
    setShowDetailModal(true);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedTask) return;
    
    const comment = {
      id: Date.now().toString(),
      author: 'Current User',
      content: newComment,
      createdAt: new Date().toISOString()
    };
    
    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, commentsList: [...(task.commentsList || []), comment], comments: task.comments + 1 }
          : task
      )
    })));
    
    setSelectedTask({
      ...selectedTask,
      commentsList: [...(selectedTask.commentsList || []), comment],
      comments: selectedTask.comments + 1
    });
    
    setNewComment('');
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedTask) return;
    
    setColumns(columns.map(column => ({
      ...column,
      tasks: column.tasks.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: newStatus }
          : task
      )
    })));
    
    setSelectedTask({
      ...selectedTask,
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
    if (selectedTask) {
      const newAttachments = selectedFiles.map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        type: file.name.split('.').pop() || 'unknown',
        url: '#',
        description: uploadDescription,
        file: file
      }));
      
      setColumns(columns.map(column => ({
        ...column,
        tasks: column.tasks.map(task => 
          task.id === selectedTask.id 
            ? { 
                ...task, 
                attachmentsList: [...(task.attachmentsList || []), ...newAttachments],
                attachments: task.attachments + selectedFiles.length
              }
            : task
        )
      })));
      
      setSelectedTask({
        ...selectedTask,
        attachmentsList: [...(selectedTask.attachmentsList || []), ...newAttachments],
        attachments: selectedTask.attachments + selectedFiles.length
      });
    }
    
    setSelectedFiles([]);
    setUploadDescription('');
    setShowUploadModal(false);
  };

  const handleDownload = (attachment: { name: string; url: string; file?: File }) => {
    if (attachment.file) {
      const url = URL.createObjectURL(attachment.file);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = attachment.url;
      link.download = attachment.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Click outside handlers
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
    <TooltipProvider>
      <div className="p-6 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Project Board</h1>
            <p className="text-muted-foreground">Mobile App Redesign Sprint</p>
          </div>
          <div className="flex space-x-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Dialog open={showDisplaySettings} onOpenChange={setShowDisplaySettings}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Display Settings</span>
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
              </TooltipTrigger>
              <TooltipContent>
                <p>Display Settings</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <User className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Assign</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Assign</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Timeline</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Timeline</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  className="bg-gradient-primary hover:opacity-90"
                  onClick={() => setShowAddTaskModal(true)}
                >
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Add Task</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Task</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-6">
          {getDisplayColumns().map((column, columnIndex) => {
            const columnTasks = getTasksForColumn(column.id);
            const parentTasks = columnTasks.filter(task => !task.parentId);
            
            return (
              <div key={column.id} className="min-w-0">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                    <h3 className="font-semibold text-foreground">{column.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {columnTasks.length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                  {displaySettings.viewType === 'nested' ? (
                    parentTasks.map((task, index) => renderNestedTask(task, 0, index, columnIndex))
                  ) : (
                    columnTasks.map((task, index) => (
                      <Card 
                        key={`${task.id}-${animationKey}`}
                        className={`p-4 hover:shadow-custom-md transition-all cursor-pointer w-full card-animate-in ${
                          hoveredCardId === task.id ? 'card-hover-highlight' : 
                          index === 0 && activeColumnIndex === columnIndex ? 'card-sequential-highlight' : ''
                        }`}
                        style={{ 
                          animationDelay: `${index * 300}ms`,
                          animationPlayState: 'running'
                        }}
                        onClick={() => handleOpenDetail(task)}
                        onMouseEnter={() => setHoveredCardId(task.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                      >
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
                            <Avatar className="w-6 h-6 bg-primary text-primary-foreground text-xs flex items-center justify-center">
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
                    ))
                  )}

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
            );
          })}
        </div>

        {/* Add Task Modal */}
        <AddTaskModal
          open={showAddTaskModal}
          onOpenChange={setShowAddTaskModal}
          onTaskCreate={(task) => {
            addNewTask(task);
            setShowAddTaskModal(false);
          }}
        />

        {/* Upload Document Modal */}
        <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
          <DialogContent className="max-w-md">
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

        {/* Development Modal */}
        <Dialog open={showDevelopmentModal} onOpenChange={setShowDevelopmentModal}>
          <DialogContent className="max-w-md">
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
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden p-0">
            {selectedTask && (
              <div className="flex h-full">
                {/* Main Content */}
                <div className="w-[70%] overflow-y-auto p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="mb-4">
                      <div className="w-10 h-10 bg-green-500 rounded flex items-center justify-center mb-3">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm text-muted-foreground mb-1"></div>
                      <h2 className="text-3xl font-bold text-foreground">{selectedTask.title}</h2>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-primary/80 hover:text-foreground"
                        onClick={handleUploadDocument}
                        title="Upload document"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-8 w-8 p-0 hover:bg-primary/80 hover:text-foreground ${isLiked ? 'text-red-500' : ''}`}
                        onClick={handleLikeToggle}
                        title={isLiked ? "Unlike" : "Like"}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      </Button>
                      <div className="relative" ref={optionsMenuRef}>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-primary/80 hover:text-foreground"
                          onClick={handleOptionsMenu}
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                        
                        {showOptionsMenu && (
                          <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                            <div className="py-2">
                              <button
                                onClick={() => {
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
                                  setShowOptionsMenu(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center transition-colors"
                              >
                                <Download className="w-4 h-4 mr-3 text-gray-500" />
                                Export
                              </button>
                              <button
                                onClick={() => {
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
                  <div className="mb-8">
                    <p className="text-foreground leading-relaxed text-base">{selectedTask.description}</p>
                  </div>

                  {/* Attachments */}
                  {selectedTask.attachmentsList && selectedTask.attachmentsList.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-semibold text-foreground mb-4 text-lg">Attachments</h3>
                      <div className="space-y-4">
                        {selectedTask.attachmentsList.map((attachment, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div className="w-20 h-20 bg-white rounded-lg border flex items-center justify-center">
                              <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-foreground text-base">{attachment.name}</div>
                              <div className="text-sm text-muted-foreground">{attachment.size}</div>
                              {attachment.description && (
                                <div className="text-sm text-gray-600 mt-1 italic">
                                  "{attachment.description}"
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-primary/80 hover:text-foreground"
                              onClick={() => handleDownload(attachment)}
                              title={`Download ${attachment.name}`}
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Activity/Comments */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground text-lg">Activity</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setCommentsExpanded(!commentsExpanded)}
                        className="flex items-center space-x-1 text-muted-foreground hover:text-foreground hover:bg-primary/80 p-0 h-auto"
                      >
                        <span className="text-sm">Comments</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${commentsExpanded ? 'rotate-180' : ''}`} />
                      </Button>
                    </div>
                    
                    {/* Comments List - Show above input when expanded */}
                    {commentsExpanded && selectedTask.commentsList && (
                      <div className="space-y-6 mb-6">
                        {selectedTask.commentsList.map((comment) => (
                          <div key={comment.id} className="flex items-start space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{comment.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-foreground">{comment.author}</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-foreground leading-relaxed">{comment.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Comment Input - Single line with Input */}
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>EU</AvatarFallback>
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
                </div>

                {/* Right Sidebar */}
                <div className="w-[30%] border-l border-gray-200 bg-gray-50 p-6 flex flex-col">
                  {/* Top Icons */}
                  <div className="flex items-center justify-end space-x-2 mb-4">
                    <div className="relative" ref={viewMenuRef}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-primary/80 hover:text-foreground"
                        onClick={handleViewMenu}
                        title="View options"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      
                      {showViewMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                          <div className="py-2">
                            <button
                              onClick={() => {
                                setShowViewMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center transition-colors"
                            >
                              <Eye className="w-4 h-4 mr-3 text-gray-500" />
                              View details
                            </button>
                            <button
                              onClick={() => {
                                setShowViewMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center transition-colors"
                            >
                              <User className="w-4 h-4 mr-3 text-gray-500" />
                              View assignee
                            </button>
                            <button
                              onClick={() => {
                                setShowViewMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center transition-colors"
                            >
                              <Calendar className="w-4 h-4 mr-3 text-gray-500" />
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
                        className="h-8 w-8 p-0 hover:bg-primary/80 hover:text-foreground"
                        onClick={handleSidebarOptionsMenu}
                        title="More options"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      
                      {showSidebarOptionsMenu && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                          <div className="py-2">
                            <button
                              onClick={() => {
                                setShowSidebarOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center transition-colors"
                            >
                              <User className="w-4 h-4 mr-3 text-gray-500" />
                              Change assignee
                            </button>
                            <button
                              onClick={() => {
                                setShowSidebarOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center transition-colors"
                            >
                              <Tag className="w-4 h-4 mr-3 text-gray-500" />
                              Add labels
                            </button>
                            <button
                              onClick={() => {
                                setShowSidebarOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center transition-colors"
                            >
                              <Clock className="w-4 h-4 mr-3 text-gray-500" />
                              Set due date
                            </button>
                            <div className="border-t border-gray-100 my-1"></div>
                            <button
                              onClick={() => {
                                setShowSidebarOptionsMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 flex items-center transition-colors"
                            >
                              <Trash2 className="w-4 h-4 mr-3" />
                              Delete item
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Status */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Status</h4>
                      <div className="relative" ref={statusDropdownRef}>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="default" 
                            className={`px-3 py-1 text-sm ${
                              selectedTask.status === 'done' ? 'bg-green-600 hover:bg-green-700' :
                              selectedTask.status === 'todo' ? 'bg-orange-500 hover:bg-orange-600' :
                              selectedTask.status === 'inprogress' ? 'bg-blue-600 hover:bg-blue-700' :
                              'bg-gray-500 hover:bg-gray-600'
                            } text-white`}
                            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                          >
                            {selectedTask.status === 'done' ? 'Done' : 
                             selectedTask.status === 'todo' ? 'To Do' : 
                             selectedTask.status === 'inprogress' ? 'In Progress' :
                             selectedTask.status === 'review' ? 'In Review' :
                             selectedTask.status}
                          </Button>
                          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showStatusDropdown ? 'rotate-180' : ''}`} />
                        </div>
                        
                        {showStatusDropdown && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                            <div className="py-1">
                              <button
                                onClick={() => handleStatusChange('todo')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center"
                              >
                                <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                                To Do
                              </button>
                              <button
                                onClick={() => handleStatusChange('inprogress')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center"
                              >
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                                In Progress
                              </button>
                              <button
                                onClick={() => handleStatusChange('review')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center"
                              >
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                                In Review
                              </button>
                              <button
                                onClick={() => handleStatusChange('done')}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-primary/80 hover:text-foreground flex items-center"
                              >
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Assignee */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Assignee</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{selectedTask.assignee.avatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-foreground">{selectedTask.assignee.name}</span>
                      </div>
                    </div>

                    {/* Labels */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Labels</h4>
                      <div className="text-muted-foreground">None</div>
                    </div>

                    {/* Reporter */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Reporter</h4>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>CU</AvatarFallback>
                        </Avatar>
                        <span className="text-foreground">Current User</span>
                      </div>
                    </div>

                    {/* Development */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">Development</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 hover:bg-primary/80 hover:text-foreground"
                          onClick={handleDevelopmentAdd}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{selectedTask.development?.branches || 0} branches</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{selectedTask.development?.commits || 0} commits</span>
                          <span className="text-xs text-muted-foreground">9 days ago</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{selectedTask.development?.pullRequests || 0} pull requests</span>
                          <Button variant="outline" size="sm" className="h-6 px-2 text-xs hover:bg-primary/80 hover:text-foreground">
                            OPEN
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Share and Embed */}
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Share and Embed</h4>
                      <div className="text-muted-foreground">Open Share and Embed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default KanbanBoard;