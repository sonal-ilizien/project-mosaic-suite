// src/components/Layout.jsx
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectSidebar from "@/components/ProjectSidebar";
import CompanyOnboarding from "@/components/CompanyOnboarding";
import { useIsMobile } from "@/hooks/use-mobile";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userCompany, setUserCompany] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const companyData = localStorage.getItem("userCompany");
    if (!companyData) {
      const defaultCompanyData = {
        mode: "create",
        companyName: "Default Company",
        description: "Default company workspace",
        industry: "Technology",
        size: "1-10 employees",
        userRole: "admin",
        department: "General",
      };
      localStorage.setItem("userCompany", JSON.stringify(defaultCompanyData));
      setUserCompany(defaultCompanyData);
    } else {
      setUserCompany(JSON.parse(companyData));
    }
  }, []);

  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
      setMobileSidebarOpen(false);
    } else {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) setMobileSidebarOpen(!mobileSidebarOpen);
    else setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeMobileSidebar = () => {
    if (isMobile) setMobileSidebarOpen(false);
  };

  const handleOnboardingComplete = (data: Record<string, unknown>) => {
    localStorage.setItem("userCompany", JSON.stringify(data));
    setUserCompany(data);
    setShowOnboarding(false);
  };

  return (
    <div className="h-screen flex bg-background relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Overlay for mobile */}
      {isMobile && mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${
          isMobile
            ? `fixed inset-y-0 left-0 z-50 transform ${
                mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
              } w-80 max-w-[85vw]`
            : `${
                sidebarCollapsed ? "w-0" : "w-64"
              } overflow-hidden flex-shrink-0 sticky top-0 h-screen`
        }`}
      >
        <ProjectSidebar
          onViewChange={(view) => {
            navigate(`/${view}`);
            if (isMobile) closeMobileSidebar();
          }}
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          isMobile={isMobile}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* 👇 Replace ViewSelector with Router Outlet */}
        <Outlet />
      </div>

      {/* Floating Expand Button */}
      {!isMobile && sidebarCollapsed && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-background hover:bg-primary/20 hover:text-foreground shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105"
        >
          <Menu className="w-4 h-4" />
        </Button>
      )}

      {/* Company Onboarding */}
      <CompanyOnboarding
        open={showOnboarding}
        onOpenChange={setShowOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
};

export default Layout;

// import { useState, useEffect } from "react";
// import { Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import ProjectSidebar from "@/components/ProjectSidebar";
// import ViewSelector from "@/components/ViewSelector";
// import CompanyOnboarding from "@/components/CompanyOnboarding";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useNavigate } from "react-router-dom";

// const Index = () => {
//   const [activeView, setActiveView] = useState("dashboard");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const [showOnboarding, setShowOnboarding] = useState(false);
//   const [userCompany, setUserCompany] = useState<Record<
//     string,
//     unknown
//   > | null>(null);
//   const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
//   const [selectedProjectFromSidebar, setSelectedProjectFromSidebar] =
//     useState<Record<string, unknown> | null>(null);
//   const isMobile = useIsMobile();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user has completed onboarding
//     const companyData = localStorage.getItem("userCompany");
//     if (!companyData) {
//       // Set a default company data to prevent the popup from showing
//       const defaultCompanyData = {
//         mode: "create",
//         companyName: "Default Company",
//         description: "Default company workspace",
//         industry: "Technology",
//         size: "1-10 employees",
//         userRole: "admin",
//         department: "General",
//       };
//       localStorage.setItem("userCompany", JSON.stringify(defaultCompanyData));
//       setUserCompany(defaultCompanyData);
//     } else {
//       setUserCompany(JSON.parse(companyData));
//     }
//   }, []);

//   // Auto-collapse sidebar on mobile
//   useEffect(() => {
//     if (isMobile) {
//       setSidebarCollapsed(true);
//       setMobileSidebarOpen(false);
//     } else {
//       setSidebarCollapsed(false);
//     }
//   }, [isMobile]);

//   const toggleSidebar = () => {
//     if (isMobile) {
//       setMobileSidebarOpen(!mobileSidebarOpen);
//     } else {
//       setSidebarCollapsed(!sidebarCollapsed);
//     }
//   };

//   const handleOnboardingComplete = (data: Record<string, unknown>) => {
//     localStorage.setItem("userCompany", JSON.stringify(data));
//     setUserCompany(data);
//     setShowOnboarding(false);
//   };

//   const closeMobileSidebar = () => {
//     if (isMobile) {
//       setMobileSidebarOpen(false);
//     }
//   };

//   return (
//     <div className="h-screen flex bg-background relative">
//       {/* Background Elements */}
//       <div className="fixed inset-0 pointer-events-none">
//         <div
//           className="absolute inset-0 opacity-5"
//           style={{
//             background:
//               "radial-gradient(circle at 20% 80%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(var(--accent)) 0%, transparent 50%)",
//           }}
//         />
//       </div>

//       {/* Mobile Overlay */}
//       {isMobile && mobileSidebarOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden"
//           onClick={closeMobileSidebar}
//         />
//       )}

//       {/* Sidebar */}
//       <div
//         className={`
//         transition-all duration-300
//         ${
//           isMobile
//             ? `fixed inset-y-0 left-0 z-50 transform ${
//                 mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
//               } w-80 max-w-[85vw]`
//             : `${
//                 sidebarCollapsed ? "w-0" : "w-64"
//               } overflow-hidden flex-shrink-0 sticky top-0 h-screen`
//         }
//       `}
//       >
//         <ProjectSidebar
//           // activeView={activeView}
//           onViewChange={(view) => {
//             // setActiveView(view);
//             console.log("view-------------------->>>>>>>>", view);
//             navigate(`/${view}`);
//             if (isMobile) {
//               closeMobileSidebar();
//             }
//           }}
//           onProjectSelect={(project) => {
//             // Set the selected project and navigate to project overview
//             setSelectedProjectFromSidebar(project);
//             // setActiveView("project-overview");
//             if (isMobile) {
//               closeMobileSidebar();
//             }
//           }}
//           collapsed={sidebarCollapsed}
//           onToggleCollapse={toggleSidebar}
//           isMobile={isMobile}
//         />
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0 overflow-auto">
//         <ViewSelector
//           // activeView={activeView}
//           sidebarCollapsed={sidebarCollapsed}
//           onToggleSidebar={toggleSidebar}
//           isMobile={isMobile}
//           mobileSidebarOpen={mobileSidebarOpen}
//           selectedProjectFromSidebar={selectedProjectFromSidebar}
//           onViewChange={(view) => {
//             setActiveView(view);
//             if (isMobile) {
//               closeMobileSidebar();
//             }
//           }}
//         />
//       </div>

//       {/* Floating Expand Button for Desktop */}
//       {!isMobile && sidebarCollapsed && (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={toggleSidebar}
//           className="fixed top-4 left-4 z-50 bg-background hover:bg-primary/20 hover:text-foreground shadow-lg border-2 border-primary/20 hover:border-primary/40 transition-all duration-200 hover:scale-105"
//         >
//           <Menu className="w-4 h-4" />
//         </Button>
//       )}

//       {/* Company Onboarding */}
//       <CompanyOnboarding
//         open={showOnboarding}
//         onOpenChange={setShowOnboarding}
//         onComplete={handleOnboardingComplete}
//       />
//     </div>
//   );
// };

// export default Index;
