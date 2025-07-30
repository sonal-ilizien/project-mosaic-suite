import React from 'react';
import { AlertTriangle, Download, Plus } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import KanbanBoard from '../KanbanBoard';

interface IssuesChallengesProps {
  onExport?: () => void;
  onAddIssue?: () => void;
  onFilterChange?: (filters: Record<string, string>) => void;
  onIssueUpdate?: (issue: unknown) => void;
}

const IssuesChallenges: React.FC<IssuesChallengesProps> = ({ 
  onExport, 
  onAddIssue, 
  onFilterChange, 
  onIssueUpdate 
}) => {
  const handleExport = (format: 'json' | 'csv' | 'pdf') => {
    const data = {
      issues: [],
      exportDate: new Date().toISOString()
    };
    
    let content = '';
    let filename = '';
    let mimeType = '';
    
    switch (format) {
      case 'json': {
        content = JSON.stringify(data, null, 2);
        filename = `issues-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
        break;
      }
      case 'csv': {
        const csvContent = [
          ['Title', 'Status', 'Priority', 'Assignee', 'Department', 'Created Date'],
          // Add sample data or actual data here
        ].map(row => row.join(',')).join('\n');
        content = csvContent;
        filename = `issues-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
        break;
      }
      case 'pdf': {
        content = `Issues Report - ${new Date().toLocaleDateString()}\n\n`;
        filename = `issues-${new Date().toISOString().split('T')[0]}.txt`;
        mimeType = 'text/plain';
        break;
      }
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    onExport?.();
  };

  return (
    <Card className="p-6 border-0 shadow-xl h-full" style={{ 
      background: 'linear-gradient(135deg, #FEF2F2 0%, #FED7D7 100%)',
      border: '1px solid #FECACA'
    }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Issues & Challenges</h3>
            <p className="text-xs text-muted-foreground">Track and manage company issues</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddIssue}
            className="flex items-center space-x-2 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Issue</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Kanban Board Content */}
      <div className="h-full">
        <KanbanBoard />
      </div>
    </Card>
  );
};

export default IssuesChallenges; 