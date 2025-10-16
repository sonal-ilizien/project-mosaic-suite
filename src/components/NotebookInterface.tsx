import React, { useState, useRef, useEffect } from 'react';
import { Save, FileText, Calendar, Clock, User, FolderOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '../services/api';

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
}

interface AgileTask {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  project_name?: string;
  assignee_name?: string;
  sprint_name?: string;
  due_date?: string;
}

interface WorkLog {
  id: number;
  task: number;
  user: number;
  user_name: string;
  start_time: string;
  end_time: string;
  description: string;
  duration_hours: number;
}

interface NotebookEntry {
  id: string;
  date: string;
  content: string;
  title?: string;
  taskId?: number;
  createdAt: string;
  updatedAt: string;
}

interface NotebookInterfaceProps {
  selectedDate: Date;
  className?: string;
}

const NotebookInterface: React.FC<NotebookInterfaceProps> = ({ 
  selectedDate, 
  className = "" 
}) => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<NotebookEntry | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [selectedWorkLogProjectId, setSelectedWorkLogProjectId] = useState<string>('');
  const [selectedWorkLogTaskId, setSelectedWorkLogTaskId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<AgileTask[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingWorkLogs, setLoadingWorkLogs] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('notebook-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Fetch projects from Django API
  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects/');
      console.log('Projects response:', response);
      setProjects(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    }
  };

  // Fetch tasks from Django API
  const fetchTasks = async (projectId?: number) => {
    try {
      setLoading(true);
      const url = projectId ? `/agile/tasks/?project=${projectId}` : '/agile/tasks/';
      const response = await api.get(url);
      console.log('Tasks response:', response);
      setTasks(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback to empty array if API fails
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load projects and tasks on component mount
  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // Fetch work logs for selected task
  const fetchWorkLogs = async (taskId?: number, projectId?: number) => {
    try {
      setLoadingWorkLogs(true);
      let url = `/agile/tasks/${taskId}/work-logs/`; // Base URL for all work logs

      const response = await api.get(url);
      console.log('Work logs response:', response);
      setWorkLogs(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching work logs:', error);
      setWorkLogs([]);
    } finally {
      setLoadingWorkLogs(false);
    }
  };

  // Fetch tasks when project is selected
  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(parseInt(selectedProjectId));
      setSelectedTaskId(''); // Reset task selection when project changes
    } else {
      fetchTasks();
    }
  }, [selectedProjectId]);

  // Fetch work logs when task or work log project is selected
  useEffect(() => {
    const taskId = selectedWorkLogTaskId ? parseInt(selectedWorkLogTaskId) : undefined;
    const projectId = selectedWorkLogProjectId ? parseInt(selectedWorkLogProjectId) : undefined;
    fetchWorkLogs(taskId, projectId);
  }, [selectedWorkLogTaskId, selectedWorkLogProjectId]);

  // // Find or create entry for selected date
  // useEffect(() => {
  //   const dateStr = selectedDate.toISOString().split('T')[0];
  //   const existingEntry = entries.find(entry => entry.date === dateStr);
    
  //   if (existingEntry) {
  //     setCurrentEntry(existingEntry);
  //     setContent(existingEntry.content);
  //     setTitle(existingEntry.title || '');
  //     setSelectedTaskId(existingEntry.taskId?.toString() || '');
  //   } else {
  //     setCurrentEntry(null);
  //     setContent('');
  //     setTitle('');
  //     setSelectedTaskId('');
  //   }
  // }, [selectedDate, entries]);

  // Auto-save functionality
  useEffect(() => {
    if (content.trim() && currentEntry) {
      const timeoutId = setTimeout(() => {
        saveEntry();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [content, title]);

  const saveEntry = async () => {
    if (!content.trim()) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const now = new Date().toISOString();
    const taskId = selectedTaskId ? parseInt(selectedTaskId) : undefined;

    let updatedEntry: NotebookEntry;

    if (currentEntry) {
      updatedEntry = {
        ...currentEntry,
        content: content.trim(),
        title: title.trim() || `Entry for ${selectedDate.toLocaleDateString()}`,
        taskId,
        updatedAt: now
      };
      
      const updatedEntries = entries.map(entry => 
        entry.id === currentEntry.id ? updatedEntry : entry
      );
      setEntries(updatedEntries);
    } else {
      updatedEntry = {
        id: Date.now().toString(),
        date: dateStr,
        content: content.trim(),
        title: title.trim() || `Entry for ${selectedDate.toLocaleDateString()}`,
        taskId,
        createdAt: now,
        updatedAt: now
      };
      
      setEntries([...entries, updatedEntry]);
    }

    setCurrentEntry(updatedEntry);
    localStorage.setItem('notebook-entries', JSON.stringify([...entries, updatedEntry]));

    // Save to Django backend if task is selected
    if (taskId) {
      try {
        await saveWorkLogToBackend(updatedEntry, taskId);
      } catch (error) {
        console.error('Error saving work log to backend:', error);
      }
    }
  };

  const saveWorkLogToBackend = async (entry: NotebookEntry, taskId: number) => {
    try {
      const workLogData = {
        start_time: new Date(entry.date + 'T09:00:00').toISOString(), // Default start time
        end_time: new Date(entry.date + 'T17:00:00').toISOString(), // Default end time
        description: entry.content
      };

      const url = selectedWorkLogProjectId 
        ? `agile/tasks/${taskId}/work-logs/?project=${selectedWorkLogProjectId}` 
        : `agile/tasks/${taskId}/work-logs/`;
      
      await api.post(url, workLogData);
      console.log('Work log saved to backend successfully');
      fetchWorkLogs(taskId, selectedWorkLogProjectId ? parseInt(selectedWorkLogProjectId) : undefined);
    } catch (error) {
      console.error('Error saving work log:', error);
      throw error;
    }
  };

  const handleStartWriting = () => {
    setIsWriting(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleSave = () => {
    saveEntry();
    setIsWriting(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const formatWorkLogTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startStr = start.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    const endStr = end.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    return `${startStr} - ${endStr}`;
  };

  const formatWorkLogDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className={`p-6 h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Work Progress</h3>
            <p className="text-xs text-muted-foreground">{formatDate(selectedDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isWriting && (
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{getWordCount(content)} words</span>
              <span>{getCharacterCount(content)} characters</span>
            </div>
          )}
          
          {isWriting ? (
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          ) : (
            <Button
              onClick={handleStartWriting}
              size="sm"
              variant="outline"
              className="hover:bg-amber-50 hover:text-amber-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              Write
            </Button>
          )}
        </div>
      </div>

      {/* Writing Area */}
      <div className="h-full w-full flex overflow-hidden">
        {isWriting ? (
          <div className="w-full flex flex-col space-y-4 overflow-hidden">
            
            {/* Project and Task Selection */}
            <div className="flex items-center space-x-2">
              {/* Project Selection */}
              <div className="px-2">
                <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a project (optional)" />
                  </SelectTrigger>
                <SelectContent>
                  {projects && projects.length > 0 ? projects.map((project) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="w-4 h-4 text-gray-500" />
                        <span>{project.name}</span>
                        <span className="text-xs text-gray-400">({project.status})</span>
                      </div>
                    </SelectItem>
                  )) : (
                    <SelectItem value="hello" disabled>
                      <span className="text-gray-500">No projects available</span>
                    </SelectItem>
                  )}
                </SelectContent>
                </Select>
              </div>

              {/* Task Selection */}
              <div className="px-2">
                <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a task (optional)" />
                  </SelectTrigger>
                <SelectContent>
                  {tasks && tasks.length > 0 ? tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="w-4 h-4 text-gray-500" />
                        <span>{task.title}</span>
                        <span className="text-xs text-gray-400">({task.status})</span>
                      </div>
                    </SelectItem>
                  )) : (
                    <SelectItem value="hello" disabled>
                      <span className="text-gray-500">No tasks available</span>
                    </SelectItem>
                  )}
                </SelectContent>
                </Select>
              </div>
            </div>
            

            {/* Title Input */}
            <div className="px-2">
              <input
                type="text"
                placeholder="Entry title (optional)..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 text-lg font-medium bg-transparent border-none outline-none placeholder-gray-400 focus:placeholder-gray-300"
                style={{ fontFamily: 'Georgia, serif' }}
              />
            </div>

            {/* Content Textarea */}
            <div className="flex-1 px-2 pb-2 overflow-hidden">
              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your work progress..."
                className="w-full h-5/6 resize-none border-none outline-none bg-transparent text-gray-800 placeholder-gray-400 focus:placeholder-gray-300 p-2"
                style={{ 
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.8',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-600 mb-2">No work progress for this date</h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Start writing to track your work progress for {formatDate(selectedDate)}
                  </p>
                  <Button
                    onClick={handleStartWriting}
                    className="bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Start Writing
                  </Button>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Work Logs Display */}
      {!isWriting && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          {/* Work Log Project Filter */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-gray-700">Work Logs</h4>
              <div className="flex items-center space-x-2">
                {/* Project Filter */}
                <Select value={selectedWorkLogProjectId} onValueChange={setSelectedWorkLogProjectId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hello">All Projects</SelectItem>
                    {projects && projects.length > 0 ? projects.map((project) => (
                      <SelectItem key={project.id} value={project.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="w-4 h-4 text-gray-500" />
                          <span>{project.name}</span>
                        </div>
                      </SelectItem>
                    )) : (
                      <SelectItem value="hello" disabled>
                        <span className="text-gray-500">No projects available</span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {/* Task Filter */}
                <Select value={selectedWorkLogTaskId} onValueChange={setSelectedWorkLogTaskId}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hello">All Tasks</SelectItem>
                    {tasks && tasks.length > 0 ? tasks.map((task) => (
                      <SelectItem key={task.id} value={task.id.toString()}>
                        <div className="flex items-center space-x-2">
                          <FolderOpen className="w-4 h-4 text-gray-500" />
                          <span>{task.title}</span>
                        </div>
                      </SelectItem>
                    )) : (
                      <SelectItem value="hello" disabled>
                        <span className="text-gray-500">No tasks available</span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {workLogs.length > 0 ? (
            <div className="space-y-3 max-h-48 overflow-y-auto">
            {workLogs.map((workLog) => (
              <div key={workLog.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      {formatWorkLogDate(workLog.start_time)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatWorkLogTime(workLog.start_time, workLog.end_time)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{workLog.user_name}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {workLog.duration_hours}h
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {workLog.description}
                </p>
              </div>
            ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">No work logs found</p>
              <p className="text-xs">Select a task to view work logs</p>
            </div>
          )}
        </div>
      )}

      {/* Footer with writing tips */}
      {isWriting && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>💡 Tip: Your entry auto-saves as you type</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>Ctrl+S to save</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default NotebookInterface;
