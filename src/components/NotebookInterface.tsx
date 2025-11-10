import React, { useState, useRef, useEffect } from "react";
import {
  Save,
  FileText,
  Calendar,
  Clock,
  User,
  FolderOpen,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import api from "@/services/api";

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

interface WorkLogEntry {
  id: string;
  projectId: number;
  taskId: number;
  startTime: string;
  endTime: string;
  description: string;
}

interface NotebookEntry {
  id: string;
  date: string;
  title?: string;
  workLogs: WorkLogEntry[];
  createdAt: string;
  updatedAt: string;
}

interface NotebookInterfaceProps {
  selectedDate: Date;
  className?: string;
}

const NotebookInterface: React.FC<NotebookInterfaceProps> = ({
  selectedDate,
  className = "",
}) => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<NotebookEntry | null>(null);
  const [isWriting, setIsWriting] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedWorkLogProjectId, setSelectedWorkLogProjectId] =
    useState<string>("");
  const [selectedWorkLogTaskId, setSelectedWorkLogTaskId] =
    useState<string>("");
  const [workLogEntries, setWorkLogEntries] = useState<WorkLogEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<AgileTask[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingWorkLogs, setLoadingWorkLogs] = useState(false);

  // Load entries from localStorage on component mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("notebook-entries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  // Fetch projects from Django API
  const fetchProjects = async () => {
    try {
      const response = await api.get("/projects/");
      console.log("Projects response:", response);
      setProjects(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  // Fetch tasks from Django API
  const fetchTasks = async (projectId?: number) => {
    try {
      setLoading(true);
      const url = projectId
        ? `/agile/tasks/?project=${projectId}`
        : "/agile/tasks/";
      const response = await api.get(url);
      console.log("Tasks response:", response);
      setTasks(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
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
      console.log("Work logs response:", response);
      setWorkLogs(response.data?.data || []);
    } catch (error) {
      console.error("Error fetching work logs:", error);
      setWorkLogs([]);
    } finally {
      setLoadingWorkLogs(false);
    }
  };

  // Fetch work logs when task or work log project is selected
  useEffect(() => {
    const taskId = selectedWorkLogTaskId
      ? parseInt(selectedWorkLogTaskId)
      : undefined;
    const projectId = selectedWorkLogProjectId
      ? parseInt(selectedWorkLogProjectId)
      : undefined;
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
    if (workLogEntries.length > 0 && currentEntry) {
      const timeoutId = setTimeout(() => {
        saveEntry();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId);
    }
  }, [workLogEntries, title]);

  const saveEntry = async () => {
    if (workLogEntries.length === 0) return;

    const dateStr = selectedDate.toISOString().split("T")[0];
    const now = new Date().toISOString();

    let updatedEntry: NotebookEntry;

    if (currentEntry) {
      updatedEntry = {
        ...currentEntry,
        title:
          title.trim() || `Work Logs for ${selectedDate.toLocaleDateString()}`,
        workLogs: workLogEntries,
        updatedAt: now,
      };

      const updatedEntries = entries.map((entry) =>
        entry.id === currentEntry.id ? updatedEntry : entry
      );
      setEntries(updatedEntries);
    } else {
      updatedEntry = {
        id: Date.now().toString(),
        date: dateStr,
        title:
          title.trim() || `Work Logs for ${selectedDate.toLocaleDateString()}`,
        workLogs: workLogEntries,
        createdAt: now,
        updatedAt: now,
      };

      setEntries([...entries, updatedEntry]);
    }

    setCurrentEntry(updatedEntry);
    localStorage.setItem(
      "notebook-entries",
      JSON.stringify([...entries, updatedEntry])
    );

    // Save work logs to backend
    if (workLogEntries.length > 0) {
      try {
        await saveMultipleWorkLogsToBackend(workLogEntries, dateStr);
        setWorkLogEntries([]); // Clear work log entries after saving
      } catch (error) {
        console.error("Error saving work logs to backend:", error);
      }
    }
  };

  // Save multiple work logs to backend
  const saveMultipleWorkLogsToBackend = async (
    workLogs: WorkLogEntry[],
    dateStr: string
  ) => {
    try {
      const workLogDataArray = workLogs.map((workLog) => ({
        task: workLog.taskId,
        start_time: new Date(
          `${dateStr}T${workLog.startTime}:00`
        ).toISOString(),
        end_time: new Date(`${dateStr}T${workLog.endTime}:00`).toISOString(),
        description: workLog.description,
      }));

      await api.post("/agile/work-logs/", workLogDataArray);
      console.log("Multiple work logs saved to backend successfully");

      // Refresh work logs after saving
      const taskId = selectedWorkLogTaskId
        ? parseInt(selectedWorkLogTaskId)
        : undefined;
      const projectId = selectedWorkLogProjectId
        ? parseInt(selectedWorkLogProjectId)
        : undefined;
      fetchWorkLogs(taskId, projectId);
    } catch (error) {
      console.error("Error saving multiple work logs:", error);
      throw error;
    }
  };

  // Add work log entry
  const addWorkLogEntry = () => {
    const newEntry: WorkLogEntry = {
      id: Date.now().toString(),
      projectId: 0,
      taskId: 0,
      startTime: "09:00",
      endTime: "17:00",
      description: "",
    };
    setWorkLogEntries([...workLogEntries, newEntry]);
  };

  // Update work log entry
  const updateWorkLogEntry = (id: string, updates: Partial<WorkLogEntry>) => {
    setWorkLogEntries(
      workLogEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    );
  };

  // Remove work log entry
  const removeWorkLogEntry = (id: string) => {
    setWorkLogEntries(workLogEntries.filter((entry) => entry.id !== id));
  };

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handleSave = () => {
    saveEntry();
    setIsWriting(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const formatWorkLogTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startStr = start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const endStr = end.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return `${startStr} - ${endStr}`;
  };

  const formatWorkLogDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
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
            <p className="text-xs text-muted-foreground">
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isWriting && (
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>{workLogEntries.length} work logs</span>
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
            {/* Work Log Entries */}
            <div className="px-2 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                  Work Logs
                </h4>
                <Button
                  onClick={addWorkLogEntry}
                  size="sm"
                  variant="outline"
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Work Log
                </Button>
              </div>

              {workLogEntries.length > 0 && (
                <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {workLogEntries.map((workLog) => (
                    <div
                      key={workLog.id}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {/* Project Selection */}
                          <Select
                            value={workLog.projectId.toString()}
                            onValueChange={(value) =>
                              updateWorkLogEntry(workLog.id, {
                                projectId: parseInt(value),
                                taskId: 0,
                              })
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select project" />
                            </SelectTrigger>
                            <SelectContent>
                              {projects && projects.length > 0 ? (
                                projects.map((project) => (
                                  <SelectItem
                                    key={project.id}
                                    value={project.id.toString()}
                                  >
                                    <div className="flex items-center space-x-2">
                                      <FolderOpen className="w-4 h-4 text-gray-500" />
                                      <span>{project.name}</span>
                                    </div>
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="hello" disabled>
                                  <span className="text-gray-500">
                                    No projects available
                                  </span>
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>

                          {/* Task Selection */}
                          <Select
                            value={workLog.taskId.toString()}
                            onValueChange={(value) =>
                              updateWorkLogEntry(workLog.id, {
                                taskId: parseInt(value),
                              })
                            }
                            disabled={workLog.projectId === 0}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Select task" />
                            </SelectTrigger>
                            <SelectContent>
                              {tasks && tasks.length > 0 ? (
                                tasks
                                  .filter(
                                    (task) =>
                                      workLog.projectId === 0 ||
                                      task.project_name ===
                                        projects.find(
                                          (p) => p.id === workLog.projectId
                                        )?.name
                                  )
                                  .map((task) => (
                                    <SelectItem
                                      key={task.id}
                                      value={task.id.toString()}
                                    >
                                      <div className="flex items-center space-x-2">
                                        <FolderOpen className="w-4 h-4 text-gray-500" />
                                        <span>{task.title}</span>
                                      </div>
                                    </SelectItem>
                                  ))
                              ) : (
                                <SelectItem value="hello" disabled>
                                  <span className="text-gray-500">
                                    No tasks available
                                  </span>
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          onClick={() => removeWorkLogEntry(workLog.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="text-xs text-gray-500">
                            Start Time
                          </label>
                          <input
                            type="time"
                            value={workLog.startTime}
                            onChange={(e) =>
                              updateWorkLogEntry(workLog.id, {
                                startTime: e.target.value,
                              })
                            }
                            className="w-full p-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500">
                            End Time
                          </label>
                          <input
                            type="time"
                            value={workLog.endTime}
                            onChange={(e) =>
                              updateWorkLogEntry(workLog.id, {
                                endTime: e.target.value,
                              })
                            }
                            className="w-full p-1 text-sm border border-gray-300 rounded"
                          />
                        </div>
                      </div>

                      <textarea
                        placeholder="Work description..."
                        value={workLog.description}
                        onChange={(e) =>
                          updateWorkLogEntry(workLog.id, {
                            description: e.target.value,
                          })
                        }
                        className="w-full p-2 text-sm border border-gray-300 rounded resize-none"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-600 mb-2">
                  No work logs for this date
                </h4>
                <p className="text-sm text-gray-500 mb-4">
                  Start adding work logs to track your progress for{" "}
                  {formatDate(selectedDate)}
                </p>
                <Button
                  onClick={handleStartWriting}
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add Work Logs
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
                <Select
                  value={selectedWorkLogProjectId}
                  onValueChange={setSelectedWorkLogProjectId}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by project" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hello">All Projects</SelectItem>
                    {projects && projects.length > 0 ? (
                      projects.map((project) => (
                        <SelectItem
                          key={project.id}
                          value={project.id.toString()}
                        >
                          <div className="flex items-center space-x-2">
                            <FolderOpen className="w-4 h-4 text-gray-500" />
                            <span>{project.name}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="hello" disabled>
                        <span className="text-gray-500">
                          No projects available
                        </span>
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {/* Task Filter */}
                <Select
                  value={selectedWorkLogTaskId}
                  onValueChange={setSelectedWorkLogTaskId}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hello">All Tasks</SelectItem>
                    {tasks && tasks.length > 0 ? (
                      tasks.map((task) => (
                        <SelectItem key={task.id} value={task.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <FolderOpen className="w-4 h-4 text-gray-500" />
                            <span>{task.title}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="hello" disabled>
                        <span className="text-gray-500">
                          No tasks available
                        </span>
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
                <div
                  key={workLog.id}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {formatWorkLogDate(workLog.start_time)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatWorkLogTime(
                          workLog.start_time,
                          workLog.end_time
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500">
                        {workLog.user_name}
                      </span>
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
