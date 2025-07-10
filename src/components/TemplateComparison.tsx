import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Users,
  BarChart3,
  Radar
} from "lucide-react";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar as RechartsRadar, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const TemplateComparison = () => {
  const [selectedProjects, setSelectedProjects] = useState(['project1', 'project2']);
  const [viewMode, setViewMode] = useState('radar');

  const projects = [
    { 
      id: 'project1', 
      name: 'Mobile App (Agile)', 
      template: 'Agile Sprint',
      completion: 75,
      avgDuration: 12,
      delays: 3,
      reopenRate: 5,
      teamWorkload: 85
    },
    { 
      id: 'project2', 
      name: 'Budget System (Finance)', 
      template: 'Finance Management',
      completion: 60,
      avgDuration: 18,
      delays: 7,
      reopenRate: 12,
      teamWorkload: 92
    },
    { 
      id: 'project3', 
      name: 'Ship Construction (Naval)', 
      template: 'Shipbuilding',
      completion: 45,
      avgDuration: 24,
      delays: 2,
      reopenRate: 3,
      teamWorkload: 78
    },
    { 
      id: 'project4', 
      name: 'Personal Goals (Individual)', 
      template: 'Personal Tasks',
      completion: 80,
      avgDuration: 8,
      delays: 1,
      reopenRate: 8,
      teamWorkload: 65
    }
  ];

  const getSelectedProjectsData = () => {
    return projects.filter(p => selectedProjects.includes(p.id));
  };

  const radarData = [
    {
      metric: 'Completion %',
      ...getSelectedProjectsData().reduce((acc, project) => {
        acc[project.name] = project.completion;
        return acc;
      }, {} as any)
    },
    {
      metric: 'Speed (inverse)',
      ...getSelectedProjectsData().reduce((acc, project) => {
        acc[project.name] = Math.max(0, 100 - project.avgDuration * 3);
        return acc;
      }, {} as any)
    },
    {
      metric: 'Reliability',
      ...getSelectedProjectsData().reduce((acc, project) => {
        acc[project.name] = Math.max(0, 100 - project.delays * 10);
        return acc;
      }, {} as any)
    },
    {
      metric: 'Quality',
      ...getSelectedProjectsData().reduce((acc, project) => {
        acc[project.name] = Math.max(0, 100 - project.reopenRate * 5);
        return acc;
      }, {} as any)
    },
    {
      metric: 'Team Efficiency',
      ...getSelectedProjectsData().reduce((acc, project) => {
        acc[project.name] = project.teamWorkload;
        return acc;
      }, {} as any)
    }
  ];

  const barData = getSelectedProjectsData().map(project => ({
    name: project.name.split(' ')[0],
    completion: project.completion,
    speed: Math.max(0, 100 - project.avgDuration * 3),
    quality: Math.max(0, 100 - project.reopenRate * 5)
  }));

  const getWinnerAnalysis = () => {
    const selectedData = getSelectedProjectsData();
    if (selectedData.length < 2) return null;

    const scores = selectedData.map(project => ({
      ...project,
      totalScore: (
        project.completion + 
        Math.max(0, 100 - project.avgDuration * 3) + 
        Math.max(0, 100 - project.delays * 10) + 
        Math.max(0, 100 - project.reopenRate * 5) + 
        project.teamWorkload
      ) / 5
    }));

    const winner = scores.reduce((best, current) => 
      current.totalScore > best.totalScore ? current : best
    );

    return winner;
  };

  const colors = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Template Comparison</h1>
          <p className="text-muted-foreground mt-1">Compare performance across different project templates</p>
        </div>
        <div className="flex space-x-3">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="radar">Radar View</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="table">Table View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Selection */}
      <Card className="p-4">
        <h3 className="font-semibold text-foreground mb-3">Select Projects to Compare</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {projects.map((project) => (
            <Button
              key={project.id}
              variant={selectedProjects.includes(project.id) ? "default" : "outline"}
              className="h-auto p-3 flex flex-col items-start"
              onClick={() => {
                if (selectedProjects.includes(project.id)) {
                  setSelectedProjects(selectedProjects.filter(id => id !== project.id));
                } else if (selectedProjects.length < 4) {
                  setSelectedProjects([...selectedProjects, project.id]);
                }
              }}
            >
              <div className="font-medium text-left">{project.name}</div>
              <Badge variant="outline" className="mt-1">{project.template}</Badge>
            </Button>
          ))}
        </div>
      </Card>

      {/* Visualization */}
      {selectedProjects.length >= 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Performance Comparison</h3>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={viewMode === 'radar' ? 'default' : 'outline'}
                  onClick={() => setViewMode('radar')}
                >
                  <Radar className="w-4 h-4 mr-1" />
                  Radar
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'bar' ? 'default' : 'outline'}
                  onClick={() => setViewMode('bar')}
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Bar
                </Button>
              </div>
            </div>

            <div className="h-96">
              {viewMode === 'radar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    {getSelectedProjectsData().map((project, index) => (
                      <RechartsRadar
                        key={project.id}
                        name={project.name}
                        dataKey={project.name}
                        stroke={colors[index]}
                        fill={colors[index]}
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    ))}
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip />
                    <Bar dataKey="completion" name="Completion %" fill={colors[0]} />
                    <Bar dataKey="speed" name="Speed Score" fill={colors[1]} />
                    <Bar dataKey="quality" name="Quality Score" fill={colors[2]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Performance Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Performance Summary</h3>
            
            {getWinnerAnalysis() && (
              <div className="space-y-4">
                <div className="p-3 bg-primary-light border border-primary rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="font-medium text-primary">Best Performing</span>
                  </div>
                  <p className="text-sm text-foreground">{getWinnerAnalysis()?.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall Score: {Math.round(getWinnerAnalysis()?.totalScore || 0)}%
                  </p>
                </div>

                <div className="space-y-3">
                  {getSelectedProjectsData().map((project, index) => (
                    <div key={project.id} className="border-l-4 pl-3" style={{ borderColor: colors[index] }}>
                      <div className="font-medium text-sm">{project.name}</div>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-success" />
                          <span>{project.completion}% done</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-warning" />
                          <span>{project.avgDuration}d avg</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                          <span>{project.delays} delays</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3 text-accent" />
                          <span>{project.teamWorkload}% load</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Detailed Table View */}
      {viewMode === 'table' && selectedProjects.length >= 2 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 font-medium">Project</th>
                  <th className="text-left p-2 font-medium">Template</th>
                  <th className="text-left p-2 font-medium">Completion %</th>
                  <th className="text-left p-2 font-medium">Avg Duration</th>
                  <th className="text-left p-2 font-medium">Delays</th>
                  <th className="text-left p-2 font-medium">Reopen Rate</th>
                  <th className="text-left p-2 font-medium">Team Load</th>
                </tr>
              </thead>
              <tbody>
                {getSelectedProjectsData().map((project) => (
                  <tr key={project.id} className="border-b border-border">
                    <td className="p-2 font-medium">{project.name}</td>
                    <td className="p-2">
                      <Badge variant="outline">{project.template}</Badge>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <span>{project.completion}%</span>
                        {project.completion >= 70 ? (
                          <TrendingUp className="w-4 h-4 text-success" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-destructive" />
                        )}
                      </div>
                    </td>
                    <td className="p-2">{project.avgDuration} days</td>
                    <td className="p-2">
                      <span className={project.delays <= 2 ? 'text-success' : 'text-destructive'}>
                        {project.delays}
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={project.reopenRate <= 5 ? 'text-success' : 'text-warning'}>
                        {project.reopenRate}%
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={project.teamWorkload <= 80 ? 'text-success' : 'text-warning'}>
                        {project.teamWorkload}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TemplateComparison;