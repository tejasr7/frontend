import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Code,
  PenBox,
  ClipboardList,
  GraduationCap,
  FileText,
  MessageSquare,
  Settings,
  HelpCircle,
  LogOut,
  AlertCircle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Menu,
  UserCircle,
  Search,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";

// Dialogs
import { SettingsDialog } from "./settings-dialog";
import { HelpDialog } from "./help-dialog";
import { PremiumDialog } from "./premium-dialog";
import { ReportBugDialog } from "./report-bug-dialog";
import { CreateItemDialog } from "./create-item-dialog";

// Hooks & Services
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { createSpace, getSpaces, getJournals } from "@/services/chat-service";
import { auth } from "@/firebase/firebase";
import type { Journal } from "@/models/chat";

// shadcn sidebar primitives
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function SidebarShadcn() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // State
  const [journalsOpen, setJournalsOpen] = useState(true);
  const [spacesOpen, setSpacesOpen] = useState(true);
  const [spaces, setSpaces] = useState<Array<{ id: string; name: string; icon?: React.ReactNode }>>([]);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState<"space" | "journal" | null>(null);
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Simulated user info (replace with real user data if available)
  const user = {
    name: "Tejas R.",
    email: "tejas@example.com",
    avatar: null, // Replace with avatar URL if available
  };

  // Load initial data
  useEffect(() => {
    loadSpaces();
    loadJournals();
  }, []);

  // Load spaces
  const loadSpaces = useCallback(() => {
    try {
      const loadedSpaces = getSpaces();
      setSpaces(
        loadedSpaces.map((space) => ({
          id: space.id,
          name: space.name,
          icon: <MessageSquare size={14} />,
        }))
      );
    } catch (error) {
      console.error("Error loading spaces:", error);
      toast({
        title: "Error",
        description: "Failed to load chat spaces",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Load journals
  const loadJournals = useCallback(() => {
    try {
      const loadedJournals = getJournals();
      if (Array.isArray(loadedJournals)) {
        setJournals(
          loadedJournals.map((journal) => ({
            ...journal,
            icon: <FileText size={14} />,
          }))
        );
      }
    } catch (error) {
      console.error("Error loading journals:", error);
      toast({
        title: "Error",
        description: "Failed to load journals",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Create new space
  const handleCreateSpace = useCallback(
    (name: string) => {
      try {
        const newSpace = createSpace(name);
        loadSpaces();
        toast({
          title: "Space Created",
          description: `Space "${name}" has been created.`,
        });
        navigate("/", { state: { activeSpaceId: newSpace.id } });
      } catch (error) {
        console.error("Error creating space:", error);
        toast({
          title: "Error",
          description: "Failed to create space",
          variant: "destructive",
        });
      }
    },
    [navigate, loadSpaces, toast]
  );

  // Navigation handlers
  const handleNavigateToSpace = useCallback(
    (spaceId: string) => {
      navigate("/", { state: { activeSpaceId: spaceId } });
      if (isMobile) setIsCollapsed(true);
    },
    [navigate, isMobile]
  );

  const handleNavigateToJournal = useCallback(
    (journalId: string) => {
      navigate("/journals", { state: { activeJournalId: journalId } });
      if (isMobile) setIsCollapsed(true);
    },
    [navigate, isMobile]
  );

  // Create journal
  const handleCreateJournal = useCallback(
    (title: string) => {
      try {
        setCreateDialogOpen(null);
        navigate("/journals", {
          replace: true,
          state: {
            createNew: true,
            newTitle: title,
            timestamp: Date.now(),
          },
        });
        loadJournals();
        toast({
          title: "Success",
          description: "New journal created successfully",
        });
      } catch (error) {
        console.error("Error creating journal:", error);
        toast({
          title: "Error",
          description: "Failed to create journal",
          variant: "destructive",
        });
      }
    },
    [navigate, loadJournals, toast]
  );

  // Toggle sidebar collapse
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // Check if a route is active
  const isActive = useCallback(
    (path: string) => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  // Get active space ID
  const activeSpaceId = useMemo(() => {
    return location.pathname === "/" ? location.state?.activeSpaceId : null;
  }, [location.pathname, location.state?.activeSpaceId]);

  // Get active journal ID
  const activeJournalId = useMemo(() => {
    return location.pathname === "/journals" ? location.state?.activeJournalId : null;
  }, [location.pathname, location.state?.activeJournalId]);

  // Sign out
  const handleSignOut = useCallback(async () => {
    try {
      await signOut(auth);
      navigate("/signin");
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);

  // Filtered items
  const filteredJournals = journals.filter(j => (j.title || "").toLowerCase().includes(search.toLowerCase()));
  const filteredSpaces = spaces.filter(s => (s.name || "").toLowerCase().includes(search.toLowerCase()));

  // Sidebar content
  const sidebarContent = (
    <SidebarContent>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          {/* {user.avatar ? (
            <img src={user.avatar} alt="User avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <UserCircle className="w-10 h-10 text-blue-400 dark:text-blue-300" />
          )} */}
          <div className="flex flex-col">
            <span className="font-semibold text-base text-slate-800 dark:text-slate-100">{user.name}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">{user.email}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setDialogOpen("settings")} aria-label="Settings">
            <Settings size={18} />
          </Button>
        </div>
      </SidebarHeader>
      
      {/* Search Bar */}
      <div className="p-2">
        <div className="flex items-center gap-2 bg-muted rounded-lg px-2 py-1">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-sm text-foreground placeholder:text-muted-foreground"
            aria-label="Search journals and spaces"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
          <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link to="/dashboard">
                  <Code className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/")}>
                <Link to="/">
                  <Code className="mr-2 h-4 w-4" />
                  <span>Playground</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/canvas")}>
                <Link to="/canvas">
                  <PenBox className="mr-2 h-4 w-4" />
                  <span>Whiteboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/desmos")}>
                <Link to="/desmos">
                  <PenBox className="mr-2 h-4 w-4" />
                  <span>Graph</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/tasks")}>
                <Link to="/tasks">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  <span>Tasks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/courses")}>
                <Link to="/courses">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Courses</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarSeparator />

      {/* Journals Section */}
      <SidebarGroup>
        <div className="flex items-center justify-between mb-1">
          <SidebarGroupLabel>Journals</SidebarGroupLabel>
          <Button size="icon" variant="ghost" onClick={() => setCreateDialogOpen("journal")}>
            <Plus size={16} />
          </Button>
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredJournals.length === 0 ? (
              <SidebarMenuItem>
                <span className="text-xs text-muted-foreground p-2 italic">No journals yet</span>
              </SidebarMenuItem>
            ) : (
              filteredJournals.map((journal) => (
                <SidebarMenuItem key={journal.id}>
                  <SidebarMenuButton asChild isActive={activeJournalId === journal.id}>
                    <Link to="/journals" state={{ activeJournalId: journal.id }}>
                      <FileText className="mr-2 h-4 w-4" />
                      <span>{journal.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Spaces Section */}
      <SidebarGroup>
        <div className="flex items-center justify-between mb-1">
          <SidebarGroupLabel>Spaces</SidebarGroupLabel>
          <Button size="icon" variant="ghost" onClick={() => setCreateDialogOpen("space")}>
            <Plus size={16} />
          </Button>
        </div>
        <SidebarGroupContent>
          <SidebarMenu>
            {filteredSpaces.length === 0 ? (
              <SidebarMenuItem>
                <span className="text-xs text-muted-foreground p-2 italic">No spaces yet</span>
              </SidebarMenuItem>
            ) : (
              filteredSpaces.map((space) => (
                <SidebarMenuItem key={space.id}>
                  <SidebarMenuButton asChild isActive={activeSpaceId === space.id}>
                    <Link to="/" state={{ activeSpaceId: space.id }}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>{space.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter>
        <div className="flex gap-2 p-2">
          <Button variant="ghost" size="icon" onClick={() => setDialogOpen("help")} aria-label="Help">
            <HelpCircle size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDialogOpen("report-bug")} aria-label="Report Bug">
            <AlertCircle size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="Sign Out" className="text-red-500">
            <LogOut size={18} />
          </Button>
        </div>
      </SidebarFooter>

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
    </SidebarContent>
  );

  // Responsive rendering
  return (
    <SidebarProvider>
      {isMobile ? (
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
            <Sidebar>{sidebarContent}</Sidebar>
          </SheetContent>
        </Sheet>
      ) : (
        <Sidebar className={isCollapsed ? "w-14" : "w-64"}>{sidebarContent}</Sidebar>
      )}
    </SidebarProvider>
  );
}