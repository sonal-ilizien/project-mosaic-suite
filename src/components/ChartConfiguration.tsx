import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  BarChart3, 
  LineChart, 
  PieChart, 
  Download, 
  Settings, 
  Pin,
  Trash2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart as RechartsLine,
  Line,
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ChartConfiguration = () => {
  const [savedCharts, setSavedCharts] = useState([
    {
      id: '1',
      name: 'Task Completion by Priority',
      type: 'bar',
      xAxis: 'priority',
      yAxis: 'taskCount',
      isPinned: true
    },
    {
      id: '2',
      name: 'Project Timeline',
      type: 'line',
      xAxis: 'date',
      yAxis: 'completion',
      isPinned: false
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newChart, setNewChart] = useState({
    name: '',
    type: 'bar',
    xAxis: '',
    yAxis: '',
    project: 'all',
    dateRange: '30days'
  });

  // Sample data for preview
  const sampleData = [
    { name: 'High', value: 12 },
    { name: 'Medium', value: 18 },
    { name: 'Low', value: 8 }
  ];

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { value: 'line', label: 'Line Chart', icon: LineChart },
    { value: 'pie', label: 'Pie Chart', icon: PieChart }
  ];

  const fieldOptions = [
    { value: 'priority', label: 'Priority' },
    { value: 'assignee', label: 'Assignee' },
    { value: 'status', label: 'Status' },
    { value: 'date', label: 'Date' },
    { value: 'taskCount', label: 'Task Count' },
    { value: 'completion', label: '% Complete' },
    { value: 'duration', label: 'Duration' }
  ];

  const renderPreviewChart = () => {
    if (newChart.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (newChart.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsLine data={sampleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
          </RechartsLine>
        </ResponsiveContainer>
      );
    } else if (newChart.type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsPie>
            <Pie
              data={sampleData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {sampleData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPie>
        </ResponsiveContainer>
      );
    }
  };

  const handleCreateChart = () => {
    const chart = {
      id: Date.now().toString(),
      ...newChart,
      isPinned: false,
      data: sampleData // Add sample data for immediate rendering
    };
    setSavedCharts([...savedCharts, chart]);
    setNewChart({ name: '', type: 'bar', xAxis: '', yAxis: '', project: 'all', dateRange: '30days' });
    setShowCreateModal(false);
  };

  const renderChart = (chart: any) => {
    const data = chart.data || sampleData;
    
    if (chart.type === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chart.type === 'line') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsLine data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" />
          </RechartsLine>
        </ResponsiveContainer>
      );
    } else if (chart.type === 'pie') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="hsl(var(--primary))"
              dataKey="value"
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} />
              ))}
            </Pie>
            <Tooltip />
          </RechartsPie>
        </ResponsiveContainer>
      );
    }
  };

  const togglePin = (chartId: string) => {
    setSavedCharts(prev => prev.map(chart => 
      chart.id === chartId ? { ...chart, isPinned: !chart.isPinned } : chart
    ));
  };

  const deleteChart = (chartId: string) => {
    setSavedCharts(prev => prev.filter(chart => chart.id !== chartId));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chart Configuration</h1>
          <p className="text-muted-foreground mt-1">Create and manage custom analytics charts</p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Chart
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Chart</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="chart-name">Chart Name</Label>
                  <Input
                    id="chart-name"
                    value={newChart.name}
                    onChange={(e) => setNewChart({ ...newChart, name: e.target.value })}
                    placeholder="Enter chart name"
                  />
                </div>

                <div>
                  <Label>Chart Type</Label>
                  <Select value={newChart.type} onValueChange={(value) => setNewChart({ ...newChart, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chartTypes.map((type) => (
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
                  <Label>X-Axis Field</Label>
                  <Select value={newChart.xAxis} onValueChange={(value) => setNewChart({ ...newChart, xAxis: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select X-axis field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Y-Axis Field</Label>
                  <Select value={newChart.yAxis} onValueChange={(value) => setNewChart({ ...newChart, yAxis: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Y-axis field" />
                    </SelectTrigger>
                    <SelectContent>
                      {fieldOptions.map((field) => (
                        <SelectItem key={field.value} value={field.value}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date Range</Label>
                  <Select value={newChart.dateRange} onValueChange={(value) => setNewChart({ ...newChart, dateRange: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="1year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Preview</Label>
                <Card className="p-4 h-64">
                  {renderPreviewChart()}
                </Card>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChart} disabled={!newChart.name || !newChart.xAxis || !newChart.yAxis}>
                Create Chart
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saved Charts */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Saved Charts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedCharts.map((chart) => (
            <Card key={chart.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-foreground">{chart.name}</h3>
                  {chart.isPinned && <Pin className="w-4 h-4 text-primary" />}
                </div>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePin(chart.id)}
                  >
                    <Pin className={`w-4 h-4 ${chart.isPinned ? 'text-primary' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deleteChart(chart.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
              
              {/* Rendered Chart */}
              <div className="mb-3 bg-background-secondary rounded-lg p-2">
                {renderChart(chart)}
              </div>
              
              <div className="space-y-2 mb-3">
                <Badge variant="outline">{chart.type} chart</Badge>
                <p className="text-sm text-muted-foreground">
                  {chart.xAxis} vs {chart.yAxis}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Settings className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartConfiguration;