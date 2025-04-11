import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from "@/components/sidebar";
import { UserGreeting } from "@/components/user-greeting";
import { ToolsTabs } from "@/components/tools-tabs";
import { InputPrompt } from "@/components/input-prompt";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChatMessage } from "@/components/chat-message";
import { addMessageToSpace, createSpace, getAiResponse, getSpaces, getCanvases } from "@/services/chat-service";
import { ChatSpace, Canvas } from "@/models/chat";
import { useToast } from '@/hooks/use-toast';
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuth } from "firebase/auth";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { CreateItemDialog } from '@/components/create-item-dialog';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [currentSpace, setCurrentSpace] = useState<ChatSpace | null>(null);
  const [relatedCanvases, setRelatedCanvases] = useState<Canvas[]>([]);
  const [username, setUsername] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const [showWelcome, setShowWelcome] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUsername(currentUser.displayName || "Guest");
    } else {
      setUsername("User");
    }
  }, []);

  useEffect(() => {
    const loadedSpaces = getSpaces();
    setSpaces(loadedSpaces);

    const activeSpaceId = location.state?.activeSpaceId;
    if (activeSpaceId) {
      const targetSpace = loadedSpaces.find(space => space.id === activeSpaceId);
      if (targetSpace) {
        setCurrentSpace(targetSpace);
        setShowWelcome(false);
        // If space has messages, hide the tools
        if (targetSpace.messages.length > 0) {
          setShowTools(false);
        }
        // Load related canvases
        const canvases = getCanvases(targetSpace.id);
        setRelatedCanvases(canvases);
        return;
      }
    }

    // If no active space or space not found, fall back to default behavior
    if (loadedSpaces.length === 0) {
      // Don't automatically create a space anymore, wait for user to create one
      setCurrentSpace(null);
    } else {
      // Set the most recently updated space as current
      const mostRecentSpace = [...loadedSpaces].sort(
        (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
      )[0];
      setCurrentSpace(mostRecentSpace);
      
      // If space has messages, hide welcome and tools
      if (mostRecentSpace.messages.length > 0) {
        setShowWelcome(false);
        setShowTools(false);
      }
      
      // Load related canvases
      const canvases = getCanvases(mostRecentSpace.id);
      setRelatedCanvases(canvases);
    }
  }, [location.state]);
  //   if (loadedSpaces.length === 0) {
  //     const newSpace = createSpace('Default Space');
  //     setSpaces([newSpace]);
  //     setCurrentSpace(newSpace);
  //   } else {
  //     const mostRecentSpace = [...loadedSpaces].sort(
  //       (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  //     )[0];
  //     setCurrentSpace(mostRecentSpace);
  //     const canvases = getCanvases(mostRecentSpace.id);
  //     setRelatedCanvases(canvases);
  //   }
  // }, [location.state]);

  useEffect(() => {
    scrollToBottom();
  }, [currentSpace?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCreateNewChat = (name: string) => {
    const newSpace = createSpace(name);
    setSpaces(prev => [...prev, newSpace]);
    setCurrentSpace(newSpace);
    setShowWelcome(false);
    toast({
      title: "Chat Created",
      description: `New chat "${name}" has been created.`,
    });
  };

  const handleSendMessage = async (message: string) => {
    // If no active space, create one first
    if (!currentSpace) {
      setCreateDialogOpen(true);
      return;
    }

  // const handleSendMessage = async (message: string) => {
  //   if (!currentSpace) {
  //     toast({
  //       title: "Error",
  //       description: "No active chat space found.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  // Hide welcome cards when first message is sent
    setShowWelcome(false);
    setShowTools(false);

    // Add user message
    const userMessage = addMessageToSpace(currentSpace.id, message, false);

    if (!userMessage) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
      return;
    }

    // update ui immediately
    setCurrentSpace({
      ...currentSpace,
      messages: [...currentSpace.messages, userMessage],
      updatedAt: new Date()
    });

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      toast({
        title: "Authentication Error",
        description: "User is not authenticated.",
        variant: "destructive",
      });
      return;
    }

    const userId = currentUser.uid;
    const username = currentUser.displayName || currentUser.email || currentUser.uid;


    try {
      const aiResponseText = await getAiResponse(userId, message);
      const aiMessage = addMessageToSpace(currentSpace.id, aiResponseText, true);

      if (aiMessage) {
        setCurrentSpace(prev => prev ? {
          ...prev,
          messages: [...prev.messages, aiMessage],
          updatedAt: new Date()
        } : null);

        setSpaces(prevSpaces => {
          const updatedSpaces = prevSpaces.map(space => 
            space.id === currentSpace.id 
              ? { ...space, updatedAt: new Date() } 
              : space
          );
          return updatedSpaces;
        });

        if (currentSpace) {
          const canvases = getCanvases(currentSpace.id);
          setRelatedCanvases(canvases);
        }
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get AI response.",
        variant: "destructive",
      });
    }
  };

  const handleViewCanvas = (canvasId: string) => {
    toast({
      title: "Canvas Preview",
      description: "Canvas previewing will be implemented soon.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMediaDialogOpen(true);
    }
  };

  const handleMediaUpload = () => {
    if (!selectedFile || !currentSpace) return;
    
    setUploadingMedia(true);
    
    // Simulate upload with a timeout
    setTimeout(() => {
      // In a real implementation, you would upload the file to a server
      // and get a URL back. For now, we'll just create a message with the file name.
      const message = `[Shared a file: ${selectedFile.name}]`;
      handleSendMessage(message);
      
      setUploadingMedia(false);
      setMediaDialogOpen(false);
      setSelectedFile(null);
      
      toast({
        title: "File Shared",
        description: `File "${selectedFile.name}" has been shared in the chat.`,
      });
    }, 1000);
  };


  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="mx-auto max-w-4xl flex flex-col h-[calc(100vh-2rem)] md:h-[calc(100vh-5rem)]">
          {/* <UserGreeting username={username} /> */}

          {currentSpace && (
            <div className="w-full mt-2 text-xl font-medium">
              {currentSpace.name}
            </div>
          )}

          {showTools && (
            <div className="w-full mt-8 md:mt-12">
              <ToolsTabs />
            </div>
          )}

          {currentSpace && currentSpace.messages.length > 0 ? (
            <div className="w-full mt-6 md:mt-10 mb-6 flex-grow overflow-y-auto">
              {currentSpace.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  isAi={message.isAi}
                  timestamp={message.timestamp}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="w-full mt-6 md:mt-10 flex-grow flex items-center justify-center">
              {showWelcome ? (
                <div className="text-center max-w-md mx-auto">
                  <h2 className="text-xl font-medium mb-4">Welcome to Praxis</h2>
                  <p className="mb-8 text-muted-foreground">
                    Start by creating a new chat or selecting an existing one from the sidebar.
                  </p>
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    {/* <Plus className="mr-2 h-4 w-4" /> Create New Chat */}
                  </Button>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  Start a new conversation!
                </p>
              )}
            </div>
          )}

             {/* <div className="w-full mt-6 md:mt-10 flex-grow flex items-center justify-center text-center text-muted-foreground">
               <p>Start a new conversation!</p>
             </div>
           )} */}

          {relatedCanvases.length > 0 && (
            <div className="w-full mt-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Related Canvases</h3>
              <div className="flex gap-2 flex-wrap">
                {relatedCanvases.map(canvas => (
                  <Button 
                    key={canvas.id} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleViewCanvas(canvas.id)}
                  >
                    <Image size={14} />
                    <span className="truncate max-w-[150px]">{canvas.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

<div className=" flex w-full fixed  bottom-0 bg-background pt-4 pb-4 ">
            <div className="flex flex-col gap-2 w-full max-w-4xl ">
              <InputPrompt 
                onSendMessage={handleSendMessage} 
                placeholder={currentSpace ? "Type your message here..." : "Create a new chat to start messaging"}
              />
              <div className="flex justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      {/* <Upload className="h-3 w-3 mr-1" /> Add Media */}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2">
                    <div className="grid gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Image className="mr-2 h-4 w-4" /> Insert Image
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {/* <File className="mr-2 h-4 w-4" /> Upload File */}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="justify-start"
                      >
                        {/* <MapPin className="mr-2 h-4 w-4" /> Share Location */}
                      </Button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept="image/*,application/pdf,text/plain"
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <CreateItemDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={handleCreateNewChat}
        title="Create New Chat"
        description="Enter a name for your new chat."
        itemLabel="Chat"
      />
      
      <Dialog open={mediaDialogOpen} onOpenChange={setMediaDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share Media</DialogTitle>
            <DialogDescription>
              Preview and share your media in the chat.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center p-4 border rounded-md">
            {selectedFile && (
              <div className="text-center">
                <div className="mb-2">
                  {/* <File size={48} className="mx-auto text-muted-foreground" /> */}
                </div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setMediaDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleMediaUpload} 
              disabled={!selectedFile || uploadingMedia}
            >
              {uploadingMedia ? "Sharing..." : "Share"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
          {/* <div className="w-full mt-auto sticky bottom-0 bg-background pt-4 pb-4">
            <InputPrompt onSendMessage={handleSendMessage} />
          </div>
        </div>
      </main>
    </div>
  );
}; */}

export default Index;

