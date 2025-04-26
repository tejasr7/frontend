
"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import {
  Code,
  PenBox,
  ChevronDown,
  ChevronRight,
  Plus,
  Settings,
  AlertCircle,
  HelpCircle,
  LogOut,
  MessageSquare,
  FileText,
  Menu,
  ClipboardList,
  GraduationCap,
  ChevronLeft,
} from "lucide-react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { signOut } from "firebase/auth"

// Components
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SettingsDialog } from "./settings-dialog"
import { HelpDialog } from "./help-dialog"
import { PremiumDialog } from "./premium-dialog"
import { ReportBugDialog } from "./report-bug-dialog"
import { CreateItemDialog } from "./create-item-dialog"

// Hooks & Services
import { useIsMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { createSpace, getSpaces, getJournals } from "@/services/chat-service"

// Firebase
import { auth } from "@/firebase/firebase"

// Types
import type { Journal } from "@/models/chat"

interface SidebarSectionProps {
  title: string
  icon: React.ReactNode
  items: Array<{ id: string; name?: string; title?: string; icon?: React.ReactNode }>
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  onItemClick: (id: string) => void
  onCreateNew: () => void
  isCollapsed: boolean
  activeItemId?: string | null
  fallbackRoute?: string
}

const SidebarSection = ({
  title,
  icon,
  items,
  isOpen,
  setIsOpen,
  onItemClick,
  onCreateNew,
  isCollapsed,
  activeItemId,
  fallbackRoute,
}: SidebarSectionProps) => {
  if (isCollapsed) {
    return (
      <div className="py-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          className="mx-auto"
          onClick={() => fallbackRoute && onItemClick(fallbackRoute)}
        >
          {icon}
        </Button>
      </div>
    )
  }

  return (
    <div className="py-4 px-3 border-b">
      <div className="flex items-center justify-between cursor-pointer mb-2" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
          {icon}
          {title}
        </span>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-accent"
            onClick={(e) => {
              e.stopPropagation()
              onCreateNew()
            }}
          >
            <Plus size={14} />
          </Button>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </div>
      </div>

      {isOpen && (
        <div className="pl-2 space-y-1 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
          {items.length === 0 ? (
            <div className="text-sm text-muted-foreground p-2 italic">No items yet</div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer transition-colors ${
                  activeItemId === item.id
                    ? "bg-accent text-accent-foreground font-medium"
                    : "hover:bg-accent/50 hover:text-accent-foreground"
                }`}
                onClick={() => onItemClick(item.id)}
              >
                {item.icon || icon}
                <span className="truncate">{item.name || item.title}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()

  // State
  const [journalsOpen, setJournalsOpen] = useState(true)
  const [spacesOpen, setSpacesOpen] = useState(true)
  const [spaces, setSpaces] = useState<Array<{ id: string; name: string; icon?: React.ReactNode }>>([])
  const [journals, setJournals] = useState<Journal[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState<"space" | "journal" | null>(null)
  const [dialogOpen, setDialogOpen] = useState<string | null>(null)

  // Load initial data
  useEffect(() => {
    loadSpaces()
    loadJournals()
  }, [])

  // Load spaces
  const loadSpaces = useCallback(() => {
    try {
      const loadedSpaces = getSpaces()
      setSpaces(
        loadedSpaces.map((space) => ({
          id: space.id,
          name: space.name,
          icon: <MessageSquare size={14} />,
        })),
      )
    } catch (error) {
      console.error("Error loading spaces:", error)
      toast({
        title: "Error",
        description: "Failed to load chat spaces",
        variant: "destructive",
      })
    }
  }, [toast])

  // Load journals
  const loadJournals = useCallback(() => {
    try {
      const loadedJournals = getJournals()
      if (Array.isArray(loadedJournals)) {
        setJournals(
          loadedJournals.map((journal) => ({
            ...journal,
            icon: <FileText size={14} />,
          })),
        )
      }
    } catch (error) {
      console.error("Error loading journals:", error)
      toast({
        title: "Error",
        description: "Failed to load journals",
        variant: "destructive",
      })
    }
  }, [toast])

  // Create new space
  const handleCreateSpace = useCallback(
    (name: string) => {
      try {
        const newSpace = createSpace(name)
        loadSpaces()
        toast({
          title: "Space Created",
          description: `Space "${name}" has been created.`,
        })

        // Navigate to the new space
        navigate("/", { state: { activeSpaceId: newSpace.id } })
      } catch (error) {
        console.error("Error creating space:", error)
        toast({
          title: "Error",
          description: "Failed to create space",
          variant: "destructive",
        })
      }
    },
    [navigate, loadSpaces, toast],
  )

  // Navigation handlers
  const handleNavigateToSpace = useCallback(
    (spaceId: string) => {
      navigate("/", { state: { activeSpaceId: spaceId } })
      if (isMobile) {
        setIsCollapsed(true)
      }
    },
    [navigate, isMobile],
  )

  const handleNavigateToJournal = useCallback(
    (journalId: string) => {
      navigate("/journals", { state: { activeJournalId: journalId } })
      if (isMobile) {
        setIsCollapsed(true)
      }
    },
    [navigate, isMobile],
  )

  // Create journal
  const handleCreateJournal = useCallback(
    (title: string) => {
      try {
        setCreateDialogOpen(null)

        navigate("/journals", {
          replace: true,
          state: {
            createNew: true,
            newTitle: title,
            timestamp: Date.now(),
          },
        })

        loadJournals()

        toast({
          title: "Success",
          description: "New journal created successfully",
        })
      } catch (error) {
        console.error("Error creating journal:", error)
        toast({
          title: "Error",
          description: "Failed to create journal",
          variant: "destructive",
        })
      }
    },
    [navigate, loadJournals, toast],
  )

  // Toggle sidebar collapse
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed])

  // Check if a route is active
  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path
    },
    [location.pathname],
  )

  // Get active space ID
  const activeSpaceId = useMemo(() => {
    return location.pathname === "/" ? location.state?.activeSpaceId : null
  }, [location.pathname, location.state?.activeSpaceId])

  // Get active journal ID
  const activeJournalId = useMemo(() => {
    return location.pathname === "/journals" ? location.state?.activeJournalId : null
  }, [location.pathname, location.state?.activeJournalId])

  // Sign out
  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth)
      navigate("/signin")
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      })
    }
  }, [navigate, toast])

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full relative">
      {!isMobile && (
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1 shadow-md z-50 hover:scale-110 transition-transform"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      )}

      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-2xl tracking-tight">{isCollapsed ? "K" : "QuestNote"}</h2>
        </div>
      </div>

      <div className="flex flex-col h-full overflow-hidden">
        <div className="overflow-y-auto flex-grow custom-scrollbar pb-4">
          {!isCollapsed && (
            <div className="p-4 space-y-1">
              <Link
                to="/"
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}
              >
                <Code size={16} />
                <span className="font-medium">Playground</span>
              </Link>
              <Link
                to="/canvas"
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/canvas") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}
              >
                <PenBox size={16} />
                <span className="font-medium">Open Canvas</span>
              </Link>
              <Link
                to="/desmos"
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/desmos") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}
              >
                <PenBox size={16} />
                <span className="font-medium">Open Graph</span>
              </Link>
              <Link
                to="/tasks"
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/tasks") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}
              >
                <ClipboardList size={16} />
                <span className="font-medium">Tasks</span>
              </Link>
              <Link
                to="/courses"
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/courses") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}
              >
                <GraduationCap size={16} />
                <span className="font-medium">Courses</span>
              </Link>
            </div>
          )}

          {/* Journals Section */}
          <SidebarSection
            title="JOURNALS"
            icon={<FileText size={18} />}
            items={journals}
            isOpen={journalsOpen}
            setIsOpen={setJournalsOpen}
            onItemClick={handleNavigateToJournal}
            onCreateNew={() => setCreateDialogOpen("journal")}
            isCollapsed={isCollapsed}
            activeItemId={activeJournalId}
            fallbackRoute="/journals"
          />

          {/* Spaces Section */}
          <SidebarSection
            title="SPACES"
            icon={<MessageSquare size={18} />}
            items={spaces}
            isOpen={spacesOpen}
            setIsOpen={setSpacesOpen}
            onItemClick={handleNavigateToSpace}
            onCreateNew={() => setCreateDialogOpen("space")}
            isCollapsed={isCollapsed}
            activeItemId={activeSpaceId}
            fallbackRoute="/"
          />

          {/* Settings & Help Section - Now scrollable with the rest of the content */}
          <div>
            {isCollapsed ? (
              <div className="p-4 flex flex-col items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setDialogOpen("settings")} aria-label="Settings">
                  <Settings size={18} />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDialogOpen("help")} aria-label="Help">
                  <HelpCircle size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  aria-label="Sign Out"
                  className="text-red-500"
                >
                  <LogOut size={18} />
                </Button>
              </div>
            ) : (
              <div className="p-3 space-y-1">
                <div
                  className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
                  onClick={() => setDialogOpen("settings")}
                >
                  <Settings size={16} />
                  <span className="font-medium">Settings</span>
                </div>
                <div
                  className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
                  onClick={() => setDialogOpen("report-bug")}
                >
                  <AlertCircle size={16} />
                  <span className="font-medium">Report Bug</span>
                </div>
                <div
                  className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
                  onClick={() => setDialogOpen("help")}
                >
                  <HelpCircle size={16} />
                  <span className="font-medium">Help</span>
                </div>
                <div
                  className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors text-red-500"
                  onClick={handleSignOut}
                >
                  <LogOut size={16} />
                  <span className="font-medium">Sign out</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings & Help Section - Now scrollable with the rest of the content */}
      </div>

      {/* Dialog Components */}
      <SettingsDialog open={dialogOpen === "settings"} onClose={() => setDialogOpen(null)} />
      <HelpDialog open={dialogOpen === "help"} onClose={() => setDialogOpen(null)} />
      <PremiumDialog open={dialogOpen === "premium"} onClose={() => setDialogOpen(null)} />
      <ReportBugDialog open={dialogOpen === "report-bug"} onClose={() => setDialogOpen(null)} />

      {/* Create Dialogs */}
      <CreateItemDialog
        open={createDialogOpen === "space"}
        onClose={() => setCreateDialogOpen(null)}
        onSubmit={handleCreateSpace}
        title="Create New Chat"
        description="Enter a name for your new chat."
        itemLabel="Chat"
      />

      <CreateItemDialog
        open={createDialogOpen === "journal"}
        onClose={() => setCreateDialogOpen(null)}
        onSubmit={handleCreateJournal}
        title="Create New Journal"
        description="Enter a title for your new journal."
        itemLabel="Journal"
      />
    </div>
  )

  return isMobile ? (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Menu size={18} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  ) : (
    <div
      className={`${isCollapsed ? "w-14" : "w-64"} h-screen bg-muted/30 border-r flex flex-col transition-all duration-300 ease-in-out`}
    >
      <SidebarContent />
    </div>
  )
}


//////////////////////////////////////  //////////////////////////////////// ////////////////////////////////////
// ui where sidebar components settings, report bug,  help, logout cant scroll
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//   Code, 
//   PenBox, 
//   ChevronDown, 
//   ChevronRight, 
//   Plus, 
//   Settings, 
//   AlertCircle, 
//   HelpCircle, 
//   LogOut,
//   MessageSquare, 
//   FileText,
//   Menu,
//   ClipboardList,
//   GraduationCap,
//   ChevronLeft
// } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { signOut } from "firebase/auth";

// // Components
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { SettingsDialog } from "./settings-dialog";
// import { HelpDialog } from "./help-dialog";
// import { PremiumDialog } from "./premium-dialog";
// import { ReportBugDialog } from "./report-bug-dialog";
// import { CreateItemDialog } from "./create-item-dialog";

// // Hooks & Services
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useToast } from "@/hooks/use-toast";
// import { createSpace, getSpaces, getJournals } from "@/services/chat-service";

// // Firebase
// import { auth } from '@/firebase/firebase';

// // Types
// import { Journal } from "@/models/chat";

// interface SidebarSectionProps {
//   title: string;
//   icon: React.ReactNode;
//   items: Array<{ id: string; name?: string; title?: string; icon?: React.ReactNode }>;
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   onItemClick: (id: string) => void;
//   onCreateNew: () => void;
//   isCollapsed: boolean;
//   activeItemId?: string | null;
//   fallbackRoute?: string;
// }

// const SidebarSection = ({ 
//   title, 
//   icon, 
//   items, 
//   isOpen, 
//   setIsOpen, 
//   onItemClick, 
//   onCreateNew, 
//   isCollapsed,
//   activeItemId,
//   fallbackRoute
// }: SidebarSectionProps) => {
//   if (isCollapsed) {
//     return (
//       <div className="py-4 border-b">
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           className="mx-auto"
//           onClick={() => fallbackRoute && onItemClick(fallbackRoute)}
//         >
//           {icon}
//         </Button>
//       </div>
//     );
//   }
  
//   return (
//     <div className="py-4 px-3 border-b">
//       <div 
//         className="flex items-center justify-between cursor-pointer mb-2" 
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="font-medium text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
//           {icon}
//           {title}
//         </span>
//         <div className="flex items-center">
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             className="h-6 w-6 rounded-full hover:bg-accent" 
//             onClick={(e) => { 
//               e.stopPropagation(); 
//               onCreateNew();
//             }}
//           >
//             <Plus size={14} />
//           </Button>
//           {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//         </div>
//       </div>
      
//       {isOpen && (
//         <div className="pl-2 space-y-1 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
//           {items.length === 0 ? (
//             <div className="text-sm text-muted-foreground p-2 italic">No items yet</div>
//           ) : (
//             items.map((item) => (
//               <div
//                 key={item.id}
//                 className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer transition-colors ${
//                   activeItemId === item.id 
//                     ? "bg-accent text-accent-foreground font-medium" 
//                     : "hover:bg-accent/50 hover:text-accent-foreground"
//                 }`}
//                 onClick={() => onItemClick(item.id)}
//               >
//                 {item.icon || icon}
//                 <span className="truncate">{item.name || item.title}</span>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export function Sidebar() {
//   const isMobile = useIsMobile();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { toast } = useToast();
  
//   // State
//   const [journalsOpen, setJournalsOpen] = useState(true);
//   const [spacesOpen, setSpacesOpen] = useState(true);
//   const [spaces, setSpaces] = useState<Array<{ id: string; name: string; icon?: React.ReactNode }>>([]);
//   const [journals, setJournals] = useState<Journal[]>([]);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState<'space' | 'journal' | null>(null);
//   const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  
//   // Load initial data
//   useEffect(() => {
//     loadSpaces();
//     loadJournals();
//   }, []);
  
//   // Load spaces
//   const loadSpaces = useCallback(() => {
//     try {
//       const loadedSpaces = getSpaces();
//       setSpaces(loadedSpaces.map(space => ({ 
//         id: space.id, 
//         name: space.name,
//         icon: <MessageSquare size={14} />
//       })));
//     } catch (error) {
//       console.error('Error loading spaces:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load chat spaces",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);
  
//   // Load journals
//   const loadJournals = useCallback(() => {
//     try {
//       const loadedJournals = getJournals();
//       if (Array.isArray(loadedJournals)) {
//         setJournals(loadedJournals.map(journal => ({
//           ...journal,
//           icon: <FileText size={14} />
//         })));
//       }
//     } catch (error) {
//       console.error('Error loading journals:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load journals",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);
  
//   // Create new space
//   const handleCreateSpace = useCallback((name: string) => {
//     try {
//       const newSpace = createSpace(name);
//       loadSpaces();
//       toast({
//         title: "Space Created",
//         description: `Space "${name}" has been created.`,
//       });
      
//       // Navigate to the new space
//       navigate('/', { state: { activeSpaceId: newSpace.id } });
//     } catch (error) {
//       console.error('Error creating space:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create space",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, loadSpaces, toast]);
  
//   // Navigation handlers
//   const handleNavigateToSpace = useCallback((spaceId: string) => {
//     navigate('/', { state: { activeSpaceId: spaceId } });
//     if (isMobile) {
//       setIsCollapsed(true);
//     }
//   }, [navigate, isMobile]);
  
//   const handleNavigateToJournal = useCallback((journalId: string) => {
//     navigate('/journals', { state: { activeJournalId: journalId } });
//     if (isMobile) {
//       setIsCollapsed(true);
//     }
//   }, [navigate, isMobile]);
  
//   // Create journal
//   const handleCreateJournal = useCallback((title: string) => {
//     try {
//       setCreateDialogOpen(null);
      
//       navigate('/journals', { 
//         replace: true,
//         state: { 
//           createNew: true, 
//           newTitle: title,
//           timestamp: Date.now() 
//         }
//       });
      
//       loadJournals();
      
//       toast({
//         title: "Success",
//         description: "New journal created successfully",
//       });
//     } catch (error) {
//       console.error('Error creating journal:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create journal",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, loadJournals, toast]);
  
//   // Toggle sidebar collapse
//   const toggleCollapse = useCallback(() => {
//     setIsCollapsed(!isCollapsed);
//   }, [isCollapsed]);
  
//   // Check if a route is active
//   const isActive = useCallback((path: string) => {
//     return location.pathname === path;
//   }, [location.pathname]);
  
//   // Get active space ID
//   const activeSpaceId = useMemo(() => {
//     return location.pathname === '/' ? location.state?.activeSpaceId : null;
//   }, [location.pathname, location.state?.activeSpaceId]);
  
//   // Get active journal ID
//   const activeJournalId = useMemo(() => {
//     return location.pathname === '/journals' ? location.state?.activeJournalId : null;
//   }, [location.pathname, location.state?.activeJournalId]);
  
//   // Sign out
//   const handleSignOut = useCallback(async () => {
//     try {
//       await signOut(auth);
//       navigate("/signin");
//       toast({
//         title: "Signed Out",
//         description: "You have been signed out successfully.",
//       });
//     } catch (error) {
//       console.error('Error signing out:', error);
//       toast({
//         title: "Error",
//         description: "Failed to sign out",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, toast]);
  
//   // Sidebar content component
//   const SidebarContent = () => (
//     <div className="flex flex-col h-full relative">
//       {!isMobile && (
//         <button 
//           onClick={toggleCollapse}
//           className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1 shadow-md z-50 hover:scale-110 transition-transform"
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>
//       )}

//       <div className="p-4 border-b sticky top-0 bg-background z-10">
//         <div className="flex items-center justify-between">
//           <h2 className="font-semibold text-2xl tracking-tight">{isCollapsed ? 'K' : 'QuestNote'}</h2>
//         </div>
//       </div>
      
//       <div className="flex flex-col h-full overflow-hidden">
//         <div className="overflow-y-auto flex-grow custom-scrollbar">
//           {!isCollapsed && (
//             <div className="p-4 space-y-1">
//               <Link to="/" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//                 <Code size={16} />
//                 <span className="font-medium">Playground</span>
//               </Link>
//               <Link to="/canvas" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/canvas") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//                 <PenBox size={16} />
//                 <span className="font-medium">Open Canvas</span>
//               </Link>
//               <Link to="/desmos" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/desmos") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//                 <PenBox size={16} />
//                 <span className="font-medium">Open Graph</span>
//               </Link>
//               <Link to="/tasks" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/tasks") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//                 <ClipboardList size={16} />
//                 <span className="font-medium">Tasks</span>
//               </Link>
//               <Link to="/courses" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/courses") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//                 <GraduationCap size={16} />
//                 <span className="font-medium">Courses</span>
//               </Link>
//             </div>
//           )}

//           {/* Journals Section */}
//           <SidebarSection
//             title="JOURNALS"
//             icon={<FileText size={18} />}
//             items={journals}
//             isOpen={journalsOpen}
//             setIsOpen={setJournalsOpen}
//             onItemClick={handleNavigateToJournal}
//             onCreateNew={() => setCreateDialogOpen('journal')}
//             isCollapsed={isCollapsed}
//             activeItemId={activeJournalId}
//             fallbackRoute="/journals"
//           />
          
//           {/* Spaces Section */}
//           <SidebarSection
//             title="SPACES"
//             icon={<MessageSquare size={18} />}
//             items={spaces}
//             isOpen={spacesOpen}
//             setIsOpen={setSpacesOpen}
//             onItemClick={handleNavigateToSpace}
//             onCreateNew={() => setCreateDialogOpen('space')}
//             isCollapsed={isCollapsed}
//             activeItemId={activeSpaceId}
//             fallbackRoute="/"
//           />
//         </div>

//         {/* Settings & Help Section - Now scrollable with the rest of the content */}
//         <div className="border-t">
//           {isCollapsed ? (
//             <div className="p-4 flex flex-col items-center gap-4">
//               <Button 
//                 variant="ghost" 
//                 size="icon"
//                 onClick={() => setDialogOpen('settings')}
//                 aria-label="Settings"
//               >
//                 <Settings size={18} />
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="icon"
//                 onClick={() => setDialogOpen('help')}
//                 aria-label="Help"
//               >
//                 <HelpCircle size={18} />
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="icon"
//                 onClick={handleSignOut}
//                 aria-label="Sign Out"
//                 className="text-red-500"
//               >
//                 <LogOut size={18} />
//               </Button>
//             </div>
//           ) : (
//             <div className="p-3 space-y-1">
//               <div 
//                 className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
//                 onClick={() => setDialogOpen('settings')}
//               >
//                 <Settings size={16} />
//                 <span className="font-medium">Settings</span>
//               </div>
//               <div 
//                 className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
//                 onClick={() => setDialogOpen('report-bug')}
//               >
//                 <AlertCircle size={16} />
//                 <span className="font-medium">Report Bug</span>
//               </div>
//               <div 
//                 className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
//                 onClick={() => setDialogOpen('help')}
//               >
//                 <HelpCircle size={16} />
//                 <span className="font-medium">Help</span>
//               </div>
//               <div 
//                 className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors text-red-500"
//                 onClick={handleSignOut}
//               >
//                 <LogOut size={16} />
//                 <span className="font-medium">Sign out</span>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
      
//       {/* Dialog Components */}
//       <SettingsDialog open={dialogOpen === 'settings'} onClose={() => setDialogOpen(null)} />
//       <HelpDialog open={dialogOpen === 'help'} onClose={() => setDialogOpen(null)} />
//       <PremiumDialog open={dialogOpen === 'premium'} onClose={() => setDialogOpen(null)} />
//       <ReportBugDialog open={dialogOpen === 'report-bug'} onClose={() => setDialogOpen(null)} />

//       {/* Create Dialogs */}
//       <CreateItemDialog
//         open={createDialogOpen === 'space'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={handleCreateSpace}
//         title="Create New Chat"
//         description="Enter a name for your new chat."
//         itemLabel="Chat"
//       />
      
//       <CreateItemDialog
//         open={createDialogOpen === 'journal'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={handleCreateJournal}
//         title="Create New Journal"
//         description="Enter a title for your new journal."
//         itemLabel="Journal"
//       />
//     </div>
//   );

//   return isMobile ? (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg hover:shadow-xl transition-shadow">
//           <Menu size={18} />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-64 p-0">
//         <SidebarContent />
//       </SheetContent>
//     </Sheet>
//   ) : (
//     <div className={`${isCollapsed ? 'w-14' : 'w-64'} h-screen bg-muted/30 border-r flex flex-col transition-all duration-300 ease-in-out`}>
//       <SidebarContent />
//     </div>
//   );
// }




// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//   Code, 
//   PenBox, 
//   ChevronDown, 
//   ChevronRight, 
//   Plus, 
//   Settings, 
//   AlertCircle, 
//   HelpCircle, 
//   LogOut,
//   MessageSquare, 
//   FileText,
//   Menu,
//   ClipboardList,
//   GraduationCap,
//   ChevronLeft
// } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { signOut } from "firebase/auth";

// // Components
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { SettingsDialog } from "./settings-dialog";
// import { HelpDialog } from "./help-dialog";
// import { PremiumDialog } from "./premium-dialog";
// import { ReportBugDialog } from "./report-bug-dialog";
// import { CreateItemDialog } from "./create-item-dialog";

// // Hooks & Services
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useToast } from "@/hooks/use-toast";
// import { createSpace, getSpaces, getJournals } from "@/services/chat-service";

// // Firebase
// import { auth } from '@/firebase/firebase';

// // Types
// import { Journal } from "@/models/chat";

// interface SidebarSectionProps {
//   title: string;
//   icon: React.ReactNode;
//   items: Array<{ id: string; name?: string; title?: string; icon?: React.ReactNode }>;
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   onItemClick: (id: string) => void;
//   onCreateNew: () => void;
//   isCollapsed: boolean;
//   activeItemId?: string | null;
//   fallbackRoute?: string;
// }

// const SidebarSection = ({ 
//   title, 
//   icon, 
//   items, 
//   isOpen, 
//   setIsOpen, 
//   onItemClick, 
//   onCreateNew, 
//   isCollapsed,
//   activeItemId,
//   fallbackRoute
// }: SidebarSectionProps) => {
//   if (isCollapsed) {
//     return (
//       <div className="py-4 border-b">
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           className="mx-auto"
//           onClick={() => fallbackRoute && onItemClick(fallbackRoute)}
//         >
//           {icon}
//         </Button>
//       </div>
//     );
//   }
  
//   return (
//     <div className="py-4 px-3 border-b">
//       <div 
//         className="flex items-center justify-between cursor-pointer mb-2" 
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="font-medium text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
//           {icon}
//           {title}
//         </span>
//         <div className="flex items-center">
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             className="h-6 w-6 rounded-full hover:bg-accent" 
//             onClick={(e) => { 
//               e.stopPropagation(); 
//               onCreateNew();
//             }}
//           >
//             <Plus size={14} />
//           </Button>
//           {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//         </div>
//       </div>
      
//       {isOpen && (
//         <div className="pl-2 space-y-1 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
//           {items.length === 0 ? (
//             <div className="text-sm text-muted-foreground p-2 italic">No items yet</div>
//           ) : (
//             items.map((item) => (
//               <div
//                 key={item.id}
//                 className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer transition-colors ${
//                   activeItemId === item.id 
//                     ? "bg-accent text-accent-foreground font-medium" 
//                     : "hover:bg-accent/50 hover:text-accent-foreground"
//                 }`}
//                 onClick={() => onItemClick(item.id)}
//               >
//                 {item.icon || icon}
//                 <span className="truncate">{item.name || item.title}</span>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export function Sidebar() {
//   const isMobile = useIsMobile();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { toast } = useToast();
  
//   // State
//   const [journalsOpen, setJournalsOpen] = useState(true);
//   const [spacesOpen, setSpacesOpen] = useState(true);
//   const [spaces, setSpaces] = useState<Array<{ id: string; name: string; icon?: React.ReactNode }>>([]);
//   const [journals, setJournals] = useState<Journal[]>([]);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState<'space' | 'journal' | null>(null);
//   const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  
//   // Load initial data
//   useEffect(() => {
//     loadSpaces();
//     loadJournals();
//   }, []);
  
//   // Load spaces
//   const loadSpaces = useCallback(() => {
//     try {
//       const loadedSpaces = getSpaces();
//       setSpaces(loadedSpaces.map(space => ({ 
//         id: space.id, 
//         name: space.name,
//         icon: <MessageSquare size={14} />
//       })));
//     } catch (error) {
//       console.error('Error loading spaces:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load chat spaces",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);
  
//   // Load journals
//   const loadJournals = useCallback(() => {
//     try {
//       const loadedJournals = getJournals();
//       if (Array.isArray(loadedJournals)) {
//         setJournals(loadedJournals.map(journal => ({
//           ...journal,
//           icon: <FileText size={14} />
//         })));
//       }
//     } catch (error) {
//       console.error('Error loading journals:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load journals",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);
  
//   // Create new space
//   const handleCreateSpace = useCallback((name: string) => {
//     try {
//       const newSpace = createSpace(name);
//       loadSpaces();
//       toast({
//         title: "Space Created",
//         description: `Space "${name}" has been created.`,
//       });
      
//       // Navigate to the new space
//       navigate('/', { state: { activeSpaceId: newSpace.id } });
//     } catch (error) {
//       console.error('Error creating space:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create space",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, loadSpaces, toast]);
  
//   // Navigation handlers
//   const handleNavigateToSpace = useCallback((spaceId: string) => {
//     navigate('/', { state: { activeSpaceId: spaceId } });
//     if (isMobile) {
//       setIsCollapsed(true);
//     }
//   }, [navigate, isMobile]);
  
//   const handleNavigateToJournal = useCallback((journalId: string) => {
//     navigate('/journals', { state: { activeJournalId: journalId } });
//     if (isMobile) {
//       setIsCollapsed(true);
//     }
//   }, [navigate, isMobile]);
  
//   // Create journal
//   const handleCreateJournal = useCallback((title: string) => {
//     try {
//       setCreateDialogOpen(null);
      
//       navigate('/journals', { 
//         replace: true,
//         state: { 
//           createNew: true, 
//           newTitle: title,
//           timestamp: Date.now() 
//         }
//       });
      
//       loadJournals();
      
//       toast({
//         title: "Success",
//         description: "New journal created successfully",
//       });
//     } catch (error) {
//       console.error('Error creating journal:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create journal",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, loadJournals, toast]);
  
//   // Toggle sidebar collapse
//   const toggleCollapse = useCallback(() => {
//     setIsCollapsed(!isCollapsed);
//   }, [isCollapsed]);
  
//   // Check if a route is active
//   const isActive = useCallback((path: string) => {
//     return location.pathname === path;
//   }, [location.pathname]);
  
//   // Get active space ID
//   const activeSpaceId = useMemo(() => {
//     return location.pathname === '/' ? location.state?.activeSpaceId : null;
//   }, [location.pathname, location.state?.activeSpaceId]);
  
//   // Get active journal ID
//   const activeJournalId = useMemo(() => {
//     return location.pathname === '/journals' ? location.state?.activeJournalId : null;
//   }, [location.pathname, location.state?.activeJournalId]);
  
//   // Sign out
//   const handleSignOut = useCallback(async () => {
//     try {
//       await signOut(auth);
//       navigate("/signin");
//       toast({
//         title: "Signed Out",
//         description: "You have been signed out successfully.",
//       });
//     } catch (error) {
//       console.error('Error signing out:', error);
//       toast({
//         title: "Error",
//         description: "Failed to sign out",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, toast]);
  
//   // Sidebar content component
//   const SidebarContent = () => (
//     <div className="flex flex-col h-full relative">
//       {!isMobile && (
//         <button 
//           onClick={toggleCollapse}
//           className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1 shadow-md z-50 hover:scale-110 transition-transform"
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>
//       )}

//       <div className="p-4 border-b sticky top-0 bg-background z-10">
//         <div className="flex items-center justify-between">
//           <h2 className="font-semibold text-2xl">{isCollapsed ? 'K' : 'Klarity'}</h2>
//         </div>
//       </div>
      
//       <div className="overflow-y-auto flex-grow custom-scrollbar">
//         {!isCollapsed && (
//           <div className="p-4 space-y-1">
//             <Link to="/" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//               <Code size={16} />
//               <span>Playground</span>
//             </Link>
//             <Link to="/canvas" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/canvas") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//               <PenBox size={16} />
//               <span>Open Canvas</span>
//             </Link>
//             <Link to="/desmos" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/desmos") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//               <PenBox size={16} />
//               <span>Open Graph</span>
//             </Link>
//             <Link to="/tasks" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/tasks") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//               <ClipboardList size={16} />
//               <span>Tasks</span>
//             </Link>
//             <Link to="/courses" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${isActive("/courses") ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 hover:text-accent-foreground"}`}>
//               <GraduationCap size={16} />
//               <span>Courses</span>
//             </Link>
//           </div>
//         )}

//         {/* Journals Section */}
//         <SidebarSection
//           title="JOURNALS"
//           icon={<FileText size={18} />}
//           items={journals}
//           isOpen={journalsOpen}
//           setIsOpen={setJournalsOpen}
//           onItemClick={handleNavigateToJournal}
//           onCreateNew={() => setCreateDialogOpen('journal')}
//           isCollapsed={isCollapsed}
//           activeItemId={activeJournalId}
//           fallbackRoute="/journals"
//         />
        
//         {/* Spaces Section */}
//         <SidebarSection
//           title="SPACES"
//           icon={<MessageSquare size={18} />}
//           items={spaces}
//           isOpen={spacesOpen}
//           setIsOpen={setSpacesOpen}
//           onItemClick={handleNavigateToSpace}
//           onCreateNew={() => setCreateDialogOpen('space')}
//           isCollapsed={isCollapsed}
//           activeItemId={activeSpaceId}
//           fallbackRoute="/"
//         />
//       </div>

//       {/* Settings & Help Section */}
//       <div className="sticky bottom-0 bg-background border-t mt-auto">
//         {isCollapsed ? (
//           <div className="p-4 flex flex-col items-center gap-4">
//             <Button 
//               variant="ghost" 
//               size="icon"
//               onClick={() => setDialogOpen('settings')}
//               aria-label="Settings"
//             >
//               <Settings size={18} />
//             </Button>
//             <Button 
//               variant="ghost" 
//               size="icon"
//               onClick={() => setDialogOpen('help')}
//               aria-label="Help"
//             >
//               <HelpCircle size={18} />
//             </Button>
//             <Button 
//               variant="ghost" 
//               size="icon"
//               onClick={handleSignOut}
//               aria-label="Sign Out"
//               className="text-red-500"
//             >
//               <LogOut size={18} />
//             </Button>
//           </div>
//         ) : (
//           <div className="p-3 space-y-1">
//             <div 
//               className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
//               onClick={() => setDialogOpen('settings')}
//             >
//               <Settings size={14} />
//               <span>Settings</span>
//             </div>
//             <div 
//               className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
//               onClick={() => setDialogOpen('report-bug')}
//             >
//               <AlertCircle size={14} />
//               <span>Report Bug</span>
//             </div>
//             <div 
//               className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors"
//               onClick={() => setDialogOpen('help')}
//             >
//               <HelpCircle size={14} />
//               <span>Help</span>
//             </div>
//             <div 
//               className="flex items-center gap-2 p-2 text-sm hover:bg-accent/50 hover:text-accent-foreground rounded-md cursor-pointer transition-colors text-red-500"
//               onClick={handleSignOut}
//             >
//               <LogOut size={16} />
//               <span>Sign out</span>
//             </div>
//           </div>
//         )}
//       </div>
      
//       {/* Dialog Components */}
//       <SettingsDialog open={dialogOpen === 'settings'} onClose={() => setDialogOpen(null)} />
//       <HelpDialog open={dialogOpen === 'help'} onClose={() => setDialogOpen(null)} />
//       <PremiumDialog open={dialogOpen === 'premium'} onClose={() => setDialogOpen(null)} />
//       <ReportBugDialog open={dialogOpen === 'report-bug'} onClose={() => setDialogOpen(null)} />

//       {/* Create Dialogs */}
//       <CreateItemDialog
//         open={createDialogOpen === 'space'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={handleCreateSpace}
//         title="Create New Chat"
//         description="Enter a name for your new chat."
//         itemLabel="Chat"
//       />
      
//       <CreateItemDialog
//         open={createDialogOpen === 'journal'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={handleCreateJournal}
//         title="Create New Journal"
//         description="Enter a title for your new journal."
//         itemLabel="Journal"
//       />
//     </div>
//   );

//   return isMobile ? (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg hover:shadow-xl transition-shadow">
//           <Menu size={18} />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-64 p-0">
//         <SidebarContent />
//       </SheetContent>
//     </Sheet>
//   ) : (
//     <div className={`${isCollapsed ? 'w-14' : 'w-64'} h-screen bg-muted/30 border-r flex flex-col transition-all duration-300 ease-in-out`}>
//       <SidebarContent />
//     </div>
//   );
// }



//////////////////////////////// ///// //////////////////////////////////////// ///////////////////////////////////////
// // Sidebar.tsx 
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//   Code, 
//   PenBox, 
//   ChevronDown, 
//   ChevronRight, 
//   Plus, 
//   Settings, 
//   AlertCircle, 
//   HelpCircle, 
//   LogOut,
//   MessageSquare, 
//   FileText,
//   Menu,
//   User,
//   ClipboardList,
//   GraduationCap,
//   ChevronLeft
// } from "lucide-react";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { signOut } from "firebase/auth";

// // Components
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { SettingsDialog } from "./settings-dialog";
// import { HelpDialog } from "./help-dialog";
// import { PremiumDialog } from "./premium-dialog";
// import { ReportBugDialog } from "./report-bug-dialog";
// import { CreateItemDialog } from "./create-item-dialog";

// // Hooks & Services
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useToast } from "@/hooks/use-toast";
// import { createSpace, getSpaces, getJournals } from "@/services/chat-service";

// // Firebase
// import { auth } from '@/firebase/firebase';

// // Types
// import { Journal } from "@/models/chat";

// interface SidebarSectionProps {
//   title: string;
//   icon: React.ReactNode;
//   items: Array<{ id: string; name?: string; title?: string; icon?: React.ReactNode }>;
//   isOpen: boolean;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   onItemClick: (id: string) => void;
//   onCreateNew: () => void;
//   isCollapsed: boolean;
//   activeItemId?: string | null;
//   fallbackRoute?: string;
// }

// const SidebarSection = ({ 
//   title, 
//   icon, 
//   items, 
//   isOpen, 
//   setIsOpen, 
//   onItemClick, 
//   onCreateNew, 
//   isCollapsed,
//   activeItemId,
//   fallbackRoute
// }: SidebarSectionProps) => {
//   if (isCollapsed) {
//     return (
//       <div className="p-4 border-b">
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           className="mx-auto"
//           onClick={() => fallbackRoute && onItemClick(fallbackRoute)}
//         >
//           {icon}
//         </Button>
//       </div>
//     );
//   }
  
//   return (
//     <div className="p-4 border-b">
//       <div 
//         className="flex items-center justify-between cursor-pointer" 
//         onClick={() => setIsOpen(!isOpen)}
//       >
//         <span className="font-medium text-sm text-gray-500 dark:text-gray-400">{title}</span>
//         <div className="flex items-center">
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             className="h-5 w-5 rounded-full" 
//             onClick={(e) => { 
//               e.stopPropagation(); 
//               onCreateNew();
//             }}
//           >
//             <Plus size={12} />
//           </Button>
//           {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//         </div>
//       </div>
      
//       {isOpen && (
//         <div className="mt-2 pl-2 space-y-1 max-h-[200px] overflow-y-auto">
//           {items.length === 0 ? (
//             <div className="text-sm text-muted-foreground p-2">No items yet</div>
//           ) : (
//             items.map((item) => (
//               <div
//                 key={item.id}
//                 className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer ${
//                   activeItemId === item.id 
//                     ? "bg-accent text-accent-foreground" 
//                     : "hover:bg-accent hover:text-accent-foreground"
//                 }`}
//                 onClick={() => onItemClick(item.id)}
//               >
//                 {item.icon || icon}
//                 <span className="truncate">{item.name || item.title}</span>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export function Sidebar() {
//   const isMobile = useIsMobile();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { toast } = useToast();
  
//   // State
//   const [journalsOpen, setJournalsOpen] = useState(true);
//   const [spacesOpen, setSpacesOpen] = useState(true);
//   const [spaces, setSpaces] = useState<Array<{ id: string; name: string; icon?: React.ReactNode }>>([]);
//   const [journals, setJournals] = useState<Journal[]>([]);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState<'space' | 'journal' | null>(null);
//   const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  
//   // Load initial data
//   useEffect(() => {
//     loadSpaces();
//     loadJournals();
//   }, []);
  
//   // Load spaces
//   const loadSpaces = useCallback(() => {
//     try {
//       const loadedSpaces = getSpaces();
//       setSpaces(loadedSpaces.map(space => ({ 
//         id: space.id, 
//         name: space.name,
//         icon: <MessageSquare size={14} />
//       })));
//     } catch (error) {
//       console.error('Error loading spaces:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load chat spaces",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);
  
//   // Load journals
//   const loadJournals = useCallback(() => {
//     try {
//       const loadedJournals = getJournals();
//       if (Array.isArray(loadedJournals)) {
//         setJournals(loadedJournals.map(journal => ({
//           ...journal,
//           icon: <FileText size={14} />
//         })));
//       }
//     } catch (error) {
//       console.error('Error loading journals:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load journals",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);
  
//   // Create new space
//   const handleCreateSpace = useCallback((name: string) => {
//     try {
//       const newSpace = createSpace(name);
//       loadSpaces();
//       toast({
//         title: "Space Created",
//         description: `Space "${name}" has been created.`,
//       });
      
//       // Navigate to the new space
//       navigate('/', { state: { activeSpaceId: newSpace.id } });
//     } catch (error) {
//       console.error('Error creating space:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create space",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, loadSpaces, toast]);
  
//   // Navigation handlers
//   const handleNavigateToSpace = useCallback((spaceId: string) => {
//     navigate('/', { state: { activeSpaceId: spaceId } });
//     if (isMobile) {
//       setIsCollapsed(true);
//     }
//   }, [navigate, isMobile]);
  
//   const handleNavigateToJournal = useCallback((journalId: string) => {
//     navigate('/journals', { state: { activeJournalId: journalId } });
//     if (isMobile) {
//       setIsCollapsed(true);
//     }
//   }, [navigate, isMobile]);
  
//   // Create journal
//   const handleCreateJournal = useCallback((title: string) => {
//     try {
//       setCreateDialogOpen(null);
      
//       navigate('/journals', { 
//         replace: true,
//         state: { 
//           createNew: true, 
//           newTitle: title,
//           timestamp: Date.now() 
//         }
//       });
      
//       loadJournals();
      
//       toast({
//         title: "Success",
//         description: "New journal created successfully",
//       });
//     } catch (error) {
//       console.error('Error creating journal:', error);
//       toast({
//         title: "Error",
//         description: "Failed to create journal",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, loadJournals, toast]);
  
//   // Toggle sidebar collapse
//   const toggleCollapse = useCallback(() => {
//     setIsCollapsed(!isCollapsed);
//   }, [isCollapsed]);
  
//   // Check if a route is active
//   const isActive = useCallback((path: string) => {
//     return location.pathname === path;
//   }, [location.pathname]);
  
//   // Get active space ID
//   const activeSpaceId = useMemo(() => {
//     return location.pathname === '/' ? location.state?.activeSpaceId : null;
//   }, [location.pathname, location.state?.activeSpaceId]);
  
//   // Get active journal ID
//   const activeJournalId = useMemo(() => {
//     return location.pathname === '/journals' ? location.state?.activeJournalId : null;
//   }, [location.pathname, location.state?.activeJournalId]);
  
//   // Sign out
//   const handleSignOut = useCallback(async () => {
//     try {
//       await signOut(auth);
//       navigate("/signin");
//       toast({
//         title: "Signed Out",
//         description: "You have been signed out successfully.",
//       });
//     } catch (error) {
//       console.error('Error signing out:', error);
//       toast({
//         title: "Error",
//         description: "Failed to sign out",
//         variant: "destructive",
//       });
//     }
//   }, [navigate, toast]);
  
//   // Sidebar content component
//   const SidebarContent = () => (
//     <div className="flex flex-col h-full relative">
//       {!isMobile && (
//         <button 
//           onClick={toggleCollapse}
//           className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1 shadow-md z-50"
//           aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>
//       )}

//       <div className="p-4 border-b">
//         <div className="flex items-center justify-between">
//           <h2 className="font-semibold text-2xl">{isCollapsed ? 'K' : 'Klarity'}</h2>
//         </div>
        
//         {!isCollapsed && (
//           <div className="mt-4 space-y-3">
//             <Link to="/" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <Code size={16} />
//               <span>Playground</span>
//             </Link>
//             <Link to="/canvas" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/canvas") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <PenBox size={16} />
//               <span>Open Canvas</span>
//             </Link>
//             <Link to="/desmos" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/desmos") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <PenBox size={16} />
//               <span>Open Graph</span>
//             </Link>
//             <Link to="/tasks" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/tasks") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <ClipboardList size={16} />
//               <span>Tasks</span>
//             </Link>
//             <Link to="/courses" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/courses") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <GraduationCap size={16} />
//               <span>Courses</span>
//             </Link>
//           </div>
//         )}
//       </div>

//       {/* Journals Section */}
//       <SidebarSection
//         title="JOURNALS"
//         icon={<FileText size={18} />}
//         items={journals}
//         isOpen={journalsOpen}
//         setIsOpen={setJournalsOpen}
//         onItemClick={handleNavigateToJournal}
//         onCreateNew={() => setCreateDialogOpen('journal')}
//         isCollapsed={isCollapsed}
//         activeItemId={activeJournalId}
//         fallbackRoute="/journals"
//       />
      
//       {/* Spaces Section */}
//       <SidebarSection
//         title="SPACES"
//         icon={<MessageSquare size={18} />}
//         items={spaces}
//         isOpen={spacesOpen}
//         setIsOpen={setSpacesOpen}
//         onItemClick={handleNavigateToSpace}
//         onCreateNew={() => setCreateDialogOpen('space')}
//         isCollapsed={isCollapsed}
//         activeItemId={activeSpaceId}
//         fallbackRoute="/"
//       />

//       {/* Settings & Help Section */}
//       {isCollapsed ? (
//         <div className="p-4 flex flex-col items-center gap-4">
//           <Button 
//             variant="ghost" 
//             size="icon"
//             onClick={() => setDialogOpen('settings')}
//             aria-label="Settings"
//           >
//             <Settings size={18} />
//           </Button>
//           <Button 
//             variant="ghost" 
//             size="icon"
//             onClick={() => setDialogOpen('help')}
//             aria-label="Help"
//           >
//             <HelpCircle size={18} />
//           </Button>
//         </div>
//       ) : (
//         <div className="mt-auto p-4 space-y-2">
//           <div 
//             className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={() => setDialogOpen('settings')}
//           >
//             <Settings size={12} />
//             <span>Settings</span>
//           </div>
//           <div 
//             className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={() => setDialogOpen('report-bug')}
//           >
//             <AlertCircle size={12} />
//             <span>Report Bug</span>
//           </div>
//           <div 
//             className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={() => setDialogOpen('help')}
//           >
//             <HelpCircle size={12} />
//             <span>Help</span>
//           </div>
//           <div 
//             className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={handleSignOut}
//           >
//             <LogOut size={16} />
//             <span>Sign out</span>
//           </div>
//         </div>
//       )}
      
//       {/* Dialog Components */}
//       <SettingsDialog open={dialogOpen === 'settings'} onClose={() => setDialogOpen(null)} />
//       <HelpDialog open={dialogOpen === 'help'} onClose={() => setDialogOpen(null)} />
//       <PremiumDialog open={dialogOpen === 'premium'} onClose={() => setDialogOpen(null)} />
//       <ReportBugDialog open={dialogOpen === 'report-bug'} onClose={() => setDialogOpen(null)} />

//       {/* Create Dialogs */}
//       <CreateItemDialog
//         open={createDialogOpen === 'space'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={handleCreateSpace}
//         title="Create New Chat"
//         description="Enter a name for your new chat."
//         itemLabel="Chat"
//       />
      
//       <CreateItemDialog
//         open={createDialogOpen === 'journal'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={handleCreateJournal}
//         title="Create New Journal"
//         description="Enter a title for your new journal."
//         itemLabel="Journal"
//       />
//     </div>
//   );

//   return isMobile ? (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="fixed bottom-4 left-4 z-50 rounded-full">
//           <Menu size={18} />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-64 p-0">
//         <SidebarContent />
//       </SheetContent>
//     </Sheet>
//   ) : (
//     <div className={`${isCollapsed ? 'w-14' : 'w-56'} min-h-screen bg-muted/30 border-r flex flex-col transition-all duration-300 ease-in-out`}>
//       <SidebarContent />
//     </div>
//   );
// }


/// ///////////////////// /////////////////////// ///////////////////// /////////////////////   ///////////////////// /////////////////////
// Sidebar Content // Sidebar Content // Sidebar Content // Sidebar Content // Sidebar Content //

// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   Code, 
//   PenBox, 
//   Search, 
//   ChevronDown, 
//   ChevronRight, 
//   Plus, 
//   CircleDollarSign,
//   Settings, 
//   AlertCircle, 
//   HelpCircle, 
//   LogOut,
//   MessageSquare, 
//   FileText,
//   Image,
//   Menu,
//   X,
//   User,
//   ClipboardList,
//   GraduationCap,
//   ChevronLeft
// } from "lucide-react";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { Link, useNavigate, useLocation } from "react-router-dom";
// import { SettingsDialog } from "./settings-dialog";
// import { HelpDialog } from "./help-dialog";
// import { PremiumDialog } from "./premium-dialog";
// import { ReportBugDialog } from "./report-bug-dialog";
// import { createSpace, getSpaces, getJournals } from "@/services/chat-service";
// import { useToast } from "@/hooks/use-toast";
// import { Journal } from "@/models/chat";
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// import { CreateItemDialog } from "./create-item-dialog";
// import { getAuth, signOut } from "firebase/auth";
// import { auth } from '@/firebase/firebase';

// export function Sidebar() {
//   const [journalsOpen, setJournalsOpen] = useState(true);
//   const [spacesOpen, setSpacesOpen] = useState(true);
//   const [spaces, setSpaces] = useState<Array<{ id: string; name: string }>>([]);
//   const [journals, setJournals] = useState<Journal[]>([]);
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState<'space' | 'journal' | null>(null);
//   const isMobile = useIsMobile();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const [dialogOpen, setDialogOpen] = useState<string | null>(null);
//   const { toast } = useToast();
  
//   // Add this useEffect near the top of your component
//   useEffect(() => {
//     const initializeData = async () => {
//       await loadJournals();
//       await loadSpaces();
//     };
    
//     initializeData();
//   }, []); // Empty dependency array for initial load only
  
//   const loadSpaces = () => {
//     const loadedSpaces = getSpaces();
//     setSpaces(loadedSpaces.map(space => ({ id: space.id, name: space.name })));
//   };
  
//   const loadJournals = useCallback(() => {
//     try {
//       const loadedJournals = getJournals();
//       if (Array.isArray(loadedJournals)) {
//         setJournals(loadedJournals);
//       }
//     } catch (error) {
//       console.error('Error loading journals:', error);
//       toast({
//         title: "Error",
//         description: "Failed to load journals",
//         variant: "destructive",
//       });
//     }
//   }, [toast]);
  
//   const handleCreateSpace = (name: string) => {
//     const newSpace = createSpace(name);
//     loadSpaces();
//     toast({
//       title: "Space Created",
//       description: `Space "${name}" has been created.`,
//     });
    
//     // Navigate to the new space
//     handleNavigateToSpace(newSpace.id);
//   };
  
//   const handleNavigateToSpace = (spaceId: string) => {
//     // Navigate to the index page with the space ID
//     navigate('/', { state: { activeSpaceId: spaceId } });
//   };
  
//   const handleNavigateToJournal = (journalId: string) => {
//     navigate('/journals', { state: { activeJournalId: journalId } });
//   };

//   const toggleCollapse = () => {
//     setIsCollapsed(!isCollapsed);
//   };

//   const isActive = (path: string) => {
//     return location.pathname === path;
//   };

//   // handle signout
//   const handleSignOut = async () => {
//     await signOut(auth)
//     navigate("/signin");
//   };

//   const SidebarContent = () => (
//     <div className="flex flex-col h-full relative">
//       {!isMobile && (
//         <button 
//           onClick={toggleCollapse}
//           className="absolute -right-3 top-8 bg-primary text-primary-foreground rounded-full p-1 shadow-md z-50"
//         >
//           {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
//         </button>
//       )}

//       <div className="p-4 border-b">
//         <div className="flex items-center justify-between">
//           <h2 className="font-semibold text-2xl">{isCollapsed ? 'K' : 'Klarity'}</h2>
//         </div>
        
//         {!isCollapsed && (
//           <div className="mt-4 space-y-3">
//             <Link to="/" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <Code size={16} />
//               <span>Playground</span>
//             </Link>
//             <Link to="/canvas" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/canvas") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <PenBox size={16} />
//               <span>Open Canvas</span>
//             </Link>
            
//             <Link to="/desmos" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/desmos") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <PenBox size={16} />
//               <span>Open Graph</span>
//             </Link>

//             {/* <Link to="/pdf-chat" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/pdf-chat") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <FileText size={16} />
//               <span>Chat with PDF</span>
//             </Link> */}
//             {/* <div className="flex items-center gap-2 p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer">
//               <Search size={16} />
//               <span>Search</span>
//             </div> */}
//             <Link to="/tasks" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/tasks") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <ClipboardList size={16} />
//               <span>Tasks</span>
//             </Link>
//             <Link to="/courses" className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${isActive("/courses") ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}>
//               <GraduationCap size={16} />
//               <span>Courses</span>
//             </Link>
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-b">
//         <div 
//           className="flex items-center justify-between cursor-pointer" 
//           onClick={() => !isCollapsed && setJournalsOpen(!journalsOpen)}
//         >
//           {isCollapsed ? (
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               className="mx-auto"
//               onClick={() => navigate('/journals')}
//             >
//               <FileText size={18} />
//             </Button>
//           ) : (
//             <>
//               <span className="font-medium text-sm text-gray-500 dark:text-gray-400">JOURNALS</span>
//               <div className="flex items-center">
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-5 w-5 rounded-full" 
//                   onClick={(e) => { 
//                     e.stopPropagation(); 
//                     setCreateDialogOpen('journal');
//                   }}
//                 >
//                   <Plus size={12} />
//                 </Button>
//                 {journalsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//               </div>
//             </>
//           )}
//         </div>

//         {!isCollapsed && journalsOpen && (
//           <div className="mt-2 pl-2 space-y-1 max-h-[150px] overflow-y-auto">
//             {journals.map((journal) => (
//               <div
//                 key={journal.id}
//                 className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer ${
//                   location.pathname === '/journals' && 
//                   location.state?.activeJournalId === journal.id ? 
//                   "bg-accent text-accent-foreground" : 
//                   "hover:bg-accent hover:text-accent-foreground"
//                 }`}
//                 onClick={() => {
//                   handleNavigateToJournal(journal.id);
//                   if (isMobile) {
//                     // Close mobile sidebar if needed
//                     setIsCollapsed(true);
//                   }
//                 }}
//               >
//                 <FileText size={14} />
//                 <span className="truncate flex-1">{journal.title}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       <div className="p-4 border-b">
//         <div 
//           className="flex items-center justify-between cursor-pointer" 
//           onClick={() => !isCollapsed && setSpacesOpen(!spacesOpen)}
//         >
//           {isCollapsed ? (
//             <Button 
//               variant="ghost" 
//               size="icon" 
//               className="mx-auto"
//               onClick={() => navigate('/')}
//             >
//               <MessageSquare size={18} />
//             </Button>
//           ) : (
//             <>
//               <span className="font-medium text-sm text-gray-500 dark:text-gray-400">SPACES</span>
//               <div className="flex items-center">
//                 <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full" onClick={(e) => { e.stopPropagation(); setCreateDialogOpen('space'); }}>
//                   <Plus size={12} />
//                 </Button>
//                 {spacesOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
//               </div>
//             </>
//           )}
//         </div>

//         {!isCollapsed && spacesOpen && (
//           <div className="mt-2 pl-2 space-y-1 max-h-[200px] overflow-y-auto">
//             {spaces.length === 0 ? (
//               <div className="text-sm text-muted-foreground p-2">No spaces yet</div>
//             ) : (
//               spaces.map((space) => (
//                 <div
//                   key={space.id}
//                   className={`flex items-center gap-2 p-2 text-sm rounded-md cursor-pointer ${location.pathname === '/' && location.state?.activeSpaceId === space.id ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground"}`}
//                   onClick={() => handleNavigateToSpace(space.id)}
//                 >
//                   <MessageSquare size={14} />
//                   <span className="truncate">{space.name}</span>
//                 </div>
//               ))
//             )}
//           </div>
//         )}
//       </div>

//       {isCollapsed ? (
//         <div className="p-4 flex flex-col items-center gap-4">
//           <Button 
//             variant="ghost" 
//             size="icon"
//             onClick={() => setDialogOpen('settings')}
//           >
//             <Settings size={18} />
//           </Button>
//           <Button 
//             variant="ghost" 
//             size="icon"
//             onClick={() => setDialogOpen('help')}
//           >
//             <HelpCircle size={18} />
//           </Button>
//         </div>
//       ) : (
//       <div className="mt-auto p-4 space-y-2">
//           <div 
//             className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={() => setDialogOpen('settings')}
//           >
//             <Settings size={12} />
//             <span>Settings</span>
//           </div>
//           <div 
//             className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={() => setDialogOpen('report-bug')}
//           >
//             <AlertCircle size={12} />
//             <span>Report Bug</span>
//           </div>
//           <div 
//             className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={() => setDialogOpen('help')}
//           >
//             <HelpCircle size={12} />
//             <span>Help</span>
//           </div>
//           <div className="flex items-center gap-2 p-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
//             onClick={handleSignOut}
// >
//             <LogOut size={16} />
//             <span>Sign out</span>
//           </div>
//         </div>
//       )}
      
//       {/* Dialog Components */}
//       <SettingsDialog open={dialogOpen === 'settings'} onClose={() => setDialogOpen(null)} />
//       <HelpDialog open={dialogOpen === 'help'} onClose={() => setDialogOpen(null)} />
//       <PremiumDialog open={dialogOpen === 'premium'} onClose={() => setDialogOpen(null)} />
//       <ReportBugDialog open={dialogOpen === 'report-bug'} onClose={() => setDialogOpen(null)} />

//       {/* Create Dialogs */}
//       <CreateItemDialog
//         open={createDialogOpen === 'space'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={handleCreateSpace}
//         title="Create New Chat"
//         description="Enter a name for your new chat."
//         itemLabel="Chat"
//       />
      
//       <CreateItemDialog
//         open={createDialogOpen === 'journal'}
//         onClose={() => setCreateDialogOpen(null)}
//         onSubmit={(name) => {
//           try {
//             setCreateDialogOpen(null);
            
//             // Use replace to avoid navigation stack issues
//             navigate('/journals', { 
//               replace: true,
//               state: { 
//                 createNew: true, 
//                 newTitle: name,
//                 timestamp: Date.now() 
//               }
//             });

//             // Force immediate loading of journals
//             loadJournals();
            
//             toast({
//               title: "Success",
//               description: "New journal created successfully",
//             });
//           } catch (error) {
//             console.error('Error creating journal:', error);
//             toast({
//               title: "Error",
//               description: "Failed to create journal",
//               variant: "destructive",
//             });
//           }
//         }}
//         title="Create New Journal"
//         description="Enter a title for your new journal."
//         itemLabel="Journal"
//       />
//     </div>
//   );

//   return isMobile ? (
//     <Sheet>
//       <SheetTrigger asChild>
//         <Button variant="outline" size="icon" className="fixed bottom-4 left-4 z-50 rounded-full">
//           <Menu size={18} />
//         </Button>
//       </SheetTrigger>
//       <SheetContent side="left" className="w-64 p-0">
//         <SidebarContent />
//       </SheetContent>
//     </Sheet>
//   ) : (
//     <div className={`${isCollapsed ? 'w-14' : 'w-56'} min-h-screen bg-muted/30 border-r flex flex-col transition-all duration-300 ease-in-out`}>
//       <SidebarContent />
//     </div>
//   );
// }
