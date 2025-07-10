import { useState } from "react";
import ProjectSidebar from "@/components/ProjectSidebar";
import ViewSelector from "@/components/ViewSelector";

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <ProjectSidebar activeView={activeView} onViewChange={setActiveView} />
      
      {/* Main Content */}
      <div className="flex-1">
        <ViewSelector activeView={activeView} />
      </div>
    </div>
  );
};

export default Index;
