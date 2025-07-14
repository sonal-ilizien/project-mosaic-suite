import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectSidebar from "@/components/ProjectSidebar";
import ViewSelector from "@/components/ViewSelector";
import CompanyOnboarding from "@/components/CompanyOnboarding";

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userCompany, setUserCompany] = useState(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const companyData = localStorage.getItem('userCompany');
    if (!companyData) {
      setShowOnboarding(true);
    } else {
      setUserCompany(JSON.parse(companyData));
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem('userCompany', JSON.stringify(data));
    setUserCompany(data);
    setShowOnboarding(false);
  };

  return (
    <div className="h-screen flex bg-background relative">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: 'radial-gradient(circle at 20% 80%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)'
          }}
        />
      </div>

      {/* Hamburger Menu Button */}
      {sidebarCollapsed && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-background border border-border shadow-lg"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}
      
      {/* Sidebar */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'w-0' : 'w-64'} overflow-hidden`}>
        <ProjectSidebar 
          activeView={activeView} 
          onViewChange={setActiveView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 relative">
        <ViewSelector activeView={activeView} />
      </div>

      {/* Company Onboarding */}
      <CompanyOnboarding
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Index;
