import React, { useState, useRef, useEffect } from 'react';
import { Save, FileText, Calendar, Clock, User, FolderOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '../services/api';

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
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [tasks, setTasks] = useState<AgileTask[]>([]);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('notebook-entries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Fetch tasks from Django API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/agile/tasks/');
      console.log(response)
      setTasks(response.data.results.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback to empty array if API fails
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Find or create entry for selected date
  useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const existingEntry = entries.find(entry => entry.date === dateStr);
    
    if (existingEntry) {
      setCurrentEntry(existingEntry);
      setContent(existingEntry.content);
      setTitle(existingEntry.title || '');
      setSelectedTaskId(existingEntry.taskId?.toString() || '');
    } else {
      setCurrentEntry(null);
      setContent('');
      setTitle('');
      setSelectedTaskId('');
    }
  }, [selectedDate, entries]);

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

      await api.post(`agile/tasks/${taskId}/work-logs/`, workLogData);
      console.log('Work log saved to backend successfully');
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
            {/* Task Selection */}
            <div className="px-2">
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a task (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {tasks.map((task) => (
                    <SelectItem key={task.id} value={task.id.toString()}>
                      <div className="flex items-center space-x-2">
                        <FolderOpen className="w-4 h-4 text-gray-500" />
                        <span>{task.title}</span>
                        <span className="text-xs text-gray-400">({task.status})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            {currentEntry ? (
              <div className="w-full space-y-6 px-2 py-2 overflow-y-auto">
                {/* Entry Header */}
                <div className="border-b border-gray-200 pb-4">
                  <h4 className="text-xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                    {currentEntry.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedDate)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Updated {new Date(currentEntry.updatedAt).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{getWordCount(currentEntry.content)} words</span>
                    </div>
                    {currentEntry.taskId && (
                      <div className="flex items-center space-x-1">
                        <FolderOpen className="w-4 h-4" />
                        <span>
                          {tasks.find(t => t.id === currentEntry.taskId)?.title || 'Task'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Entry Content */}
                <div 
                  className="prose prose-gray max-w-none"
                  style={{ fontFamily: 'Georgia, serif', lineHeight: '1.8' }}
                >
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {currentEntry.content}
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>

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
