import React from 'react';
import ProjectTimelineView from './ProjectTimelineView';

const TimelineDemo: React.FC = () => {
  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
  };

  const handleAddTask = () => {
    console.log('Add task clicked');
  };

  const handleExport = () => {
    console.log('Export clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProjectTimelineView
        startDate="2024-01-01"
        endDate="2024-12-31"
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
        onExport={handleExport}
      />
    </div>
  );
};

export default TimelineDemo; 