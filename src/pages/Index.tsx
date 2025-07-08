import ProjectSidebar from "@/components/ProjectSidebar";
import ViewSelector from "@/components/ViewSelector";

const Index = () => {
  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <ProjectSidebar />
      
      {/* Main Content */}
      <ViewSelector />
    </div>
  );
};

export default Index;
