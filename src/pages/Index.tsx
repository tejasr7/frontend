import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Image, Plus, MessageCircle } from "lucide-react";
import { getAuth } from "firebase/auth";
import { doc, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Components
import { SidebarShadcn } from "@/components/SidebarShadcn";
import { UserGreeting } from "@/components/user-greeting";
import { ToolsTabs } from "@/components/tools-tabs";
import { InputPrompt } from "@/components/input-prompt";
import { ChatMessage } from "@/components/chat-message";
import { Button } from "@/components/ui/button";
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

// Hooks & Services
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from '@/hooks/use-toast';
import { 
  addMessageToSpace, 
  createSpace, 
  getAiResponse, 
  getSpaces, 
  getCanvases 
} from "@/services/chat-service";

// Types
import { ChatSpace, Canvas, ChatMessage as ChatMessageType } from "@/models/chat";

// Custom hook for message handling
const useMessageHandler = (currentSpace, setCurrentSpace, setSpaces, setRelatedCanvases, toast) => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  
  // Generate a Firestore-style ID
  const generateFirestoreId = useCallback(() => {
    return doc(collection(db, "_")).id;
  }, []);

  const sendMessage = useCallback(async (message) => {
    if (!currentSpace || !currentUser) {
      toast({
        title: "Error",
        description: currentUser ? "No active chat selected" : "User not authenticated",
        variant: "destructive",
      });
      return null;
    }

    const userId = currentUser.uid;
    
    // Create optimistic user message
    const localUserMessage = {
      id: generateFirestoreId(),
      content: message,
      isAi: false,
      timestamp: new Date(),
    };
    
    // Update UI optimistically
    setCurrentSpace(prev => prev ? {
      ...prev,
      messages: [...prev.messages, localUserMessage],
      updatedAt: new Date()
    } : null);
    
    try {
      // Store message in Firestore
      await addMessageToSpace(userId, currentSpace.id, message, false);
      
      // Get AI response
      const aiResponseText = await getAiResponse(userId, currentSpace.id, message);
      
      // Create optimistic AI message
      const localAiMessage = {
        id: generateFirestoreId(),
        content: aiResponseText,
        isAi: true,
        timestamp: new Date(),
      };
      
      // Update UI with AI response
      setCurrentSpace(prev => prev ? {
        ...prev,
        messages: [...prev.messages, localAiMessage],
        updatedAt: new Date()
      } : null);
      
      // Update spaces list to reflect most recent activity
      setSpaces(prevSpaces => prevSpaces.map(space => 
        space.id === currentSpace.id ? { ...space, updatedAt: new Date() } : space
      ));
      
      // Update related canvases
      if (currentSpace) {
        const canvases = getCanvases(currentSpace.id);
        setRelatedCanvases(canvases);
      }
      
      // Store AI message in Firestore
      await addMessageToSpace(userId, currentSpace.id, aiResponseText, true);
      
      return true;
    } catch (error) {
      console.error("Error during chat interaction:", error);
      toast({
        title: "Error",
        description: "Something went wrong during the chat interaction.",
        variant: "destructive",
      });
      return false;
    }
  }, [currentSpace, currentUser, generateFirestoreId, setCurrentSpace, setSpaces, setRelatedCanvases, toast]);
  
  return { sendMessage };
};

// Main component
const Index = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  
  // State
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [currentSpace, setCurrentSpace] = useState<ChatSpace | null>(null);
  const [relatedCanvases, setRelatedCanvases] = useState<Canvas[]>([]);
  const [username, setUsername] = useState<string>("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTools, setShowTools] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Custom hook
  const { sendMessage } = useMessageHandler(
    currentSpace, 
    setCurrentSpace, 
    setSpaces, 
    setRelatedCanvases, 
    toast
  );

  // Initial data loading
  useEffect(() => {
    const loadInitialData = () => {
      const loadedSpaces = getSpaces();
      setSpaces(loadedSpaces);
      
      const activeSpaceId = location.state?.activeSpaceId;
      if (activeSpaceId) {
        const targetSpace = loadedSpaces.find(space => space.id === activeSpaceId);
        if (targetSpace) {
          setCurrentSpace(targetSpace);
          setShowWelcome(false);
          if (targetSpace.messages.length > 0) {
            setShowTools(false);
          }
          
          const canvases = getCanvases(targetSpace.id);
          setRelatedCanvases(canvases);
          return;
        }
      }
      
      // No active space specified or not found
      if (loadedSpaces.length > 0) {
        // Set most recent space as current
        const mostRecentSpace = [...loadedSpaces].sort(
          (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
        )[0];
        
        setCurrentSpace(mostRecentSpace);
        if (mostRecentSpace.messages.length > 0) {
          setShowWelcome(false);
          setShowTools(false);
        }
        
        const canvases = getCanvases(mostRecentSpace.id);
        setRelatedCanvases(canvases);
      }
    };
    
    loadInitialData();
  }, [location.state]);
  
  // Set username
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    setUsername(currentUser?.displayName || "Guest");
  }, []);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentSpace?.messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handlers
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
    if (!currentSpace) {
      setCreateDialogOpen(true);
      return;
    }
    
    setShowWelcome(false);
    setShowTools(false);
    
    const success = await sendMessage(message);
    if (!success) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };
  
  const handleViewCanvas = (canvasId: string) => {
    navigate('/canvas', { state: { canvasId } });
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
  
  // Render the content of the chat area
  const renderContent = () => {
    if (!currentSpace || currentSpace.messages.length === 0) {
      return (
        <div className="flex-grow flex items-center justify-center">
          {/* {showWelcome ? (
            <div className="text-center max-w-md mx-auto p-8 bg-gradient-to-b from-background to-muted/30 rounded-xl shadow-sm border">
              <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Welcome to Klarity</h2>
              <p className="mb-8 text-muted-foreground">
                Start a new conversation or select an existing chat from the sidebar.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2 px-6">
                <Plus size={16} />
                Create New Chat
              </Button>
            </div>
          ) : (
            <div></div>
          )} */}
          <div></div>
        </div>
      );
    }
    
    return (
      <>
        {currentSpace.messages.map((message: ChatMessageType) => (
          <ChatMessage
            key={message.id}
            content={message.content}
            isAi={message.isAi}
            timestamp={message.timestamp}
          />
        ))}
        <div ref={messagesEndRef} />
      </>
    );
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarShadcn />
      
      <div className="flex-1 flex flex-col h-full">
        {/* Main layout with fixed header, scrollable content, and fixed footer */}
        <div className="flex flex-col h-full">
          {/* Fixed Header - Modified with reduced padding and smaller text */}
          {currentSpace && (
            <div className="flex-shrink-0 p-2 bg-background z-10 border-b">
              <div className="mx-auto max-w-4xl flex items-center">
                <h1 className="text-base font-normal">{currentSpace.name}</h1>
                {relatedCanvases.length > 0 && (
                  <div className="ml-auto">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="xs" className="flex items-center gap-1 h-7">
                          <Image size={12} />
                          <span className="text-sm">Canvases ({relatedCanvases.length})</span>
                        </Button>
                      </PopoverTrigger>
                      {/* Popover content remains the same */}
                    </Popover>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {showTools && (
            <div className="flex-shrink-0 px-4 md:px-6 lg:px-8">
              <div className="mx-auto max-w-4xl">
                <ToolsTabs
                        onSendMessage={handleSendMessage}
                        />
              </div>
            </div>
          )}
          
          {/* Scrollable Content Area */}
          <div className="flex-grow overflow-y-auto px-4 md:px-6 lg:px-8 py-4">
            <div className="mx-auto max-w-4xl">
              {renderContent()}
            </div>
          </div>
          
          {/* Fixed Footer - Input Area */}
          <div className="flex-shrink-0 p-4 md:p-6 lg:p-8 pt-2 md:pt-3 lg:pt-4">
          <div className="mx-auto max-w-4xl">
            <InputPrompt 
              onSendMessage={handleSendMessage} 
              placeholder={currentSpace ? "Type your message here..." : "Create a new chat to start messaging"}
              disabled={!currentSpace}
            />
          </div>
        </div>
        </div>
      </div>
      
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
          
          <div className="flex flex-col items-center justify-center p-6 border rounded-md bg-muted/20 my-4">
            {selectedFile && (
              <div className="text-center">
                <div className="mb-3 p-4 bg-background rounded-full">
                  <Image size={48} className="mx-auto text-primary" />
                </div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground mt-1">
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
              className="gap-2"
            >
              {uploadingMedia ? "Sharing..." : "Share File"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;



// import React, { useState, useEffect, useRef } from 'react';
// import { MessageCircle } from "lucide-react";
// import { getAuth } from "firebase/auth";
// import { doc, collection } from "firebase/firestore";
// import { db } from "../firebase/firebase";

// // Components
// import { SidebarShadcn } from "@/components/SidebarShadcn";
// import { ToolsTabs } from "@/components/tools-tabs";
// import { InputPrompt } from "@/components/input-prompt";
// import { ChatMessage } from "@/components/chat-message";
// import { Button } from "@/components/ui/button";
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "@/components/ui/dialog";
// import { CreateItemDialog } from '@/components/create-item-dialog';

// // Hooks & Services
// import { useIsMobile } from "@/hooks/use-mobile";
// import { useToast } from '@/hooks/use-toast';
// import { 
//   addMessageToSpace, 
//   createSpace, 
//   getAiResponse, 
//   getSpaces, 
//   getCanvases 
// } from "@/services/chat-service";

// // Types
// import { ChatSpace, Canvas, ChatMessage as ChatMessageType } from "@/models/chat";

// // Main component
// const Index = () => {
//   const isMobile = useIsMobile();
//   const { toast } = useToast();
//   const messagesEndRef = useRef(null);
  
//   // State
//   const [spaces, setSpaces] = useState<ChatSpace[]>([]);
//   const [currentSpace, setCurrentSpace] = useState<ChatSpace | null>(null);
//   const [relatedCanvases, setRelatedCanvases] = useState<Canvas[]>([]);
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showTools, setShowTools] = useState(true);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
//   // Initial data loading
//   useEffect(() => {
//     const loadInitialData = () => {
//       const loadedSpaces = getSpaces();
//       setSpaces(loadedSpaces);
      
//       if (loadedSpaces.length > 0) {
//         // Set most recent space as current
//         const mostRecentSpace = [...loadedSpaces].sort(
//           (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
//         )[0];
        
//         setCurrentSpace(mostRecentSpace);
//         if (mostRecentSpace.messages.length > 0) {
//           setShowWelcome(false);
//           setShowTools(false);
//         }
        
//         const canvases = getCanvases(mostRecentSpace.id);
//         setRelatedCanvases(canvases);
//       }
//     };
    
//     loadInitialData();
//   }, []);
  
//   // Auto-scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [currentSpace?.messages]);
  
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };
  
//   // Generate a Firestore-style ID (simplified for example)
//   const generateFirestoreId = () => {
//     return 'id-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
//   };
  
//   // Handlers
//   const handleCreateNewChat = (name: string) => {
//     const newSpace = createSpace(name);
//     setSpaces(prev => [...prev, newSpace]);
//     setCurrentSpace(newSpace);
//     setShowWelcome(false);
//     toast({
//       title: "Chat Created",
//       description: `New chat "${name}" has been created.`,
//     });
//   };
  
//   const handleSendMessage = async (message: string) => {
//     if (!currentSpace) {
//       setCreateDialogOpen(true);
//       return;
//     }
    
//     setShowWelcome(false);
//     setShowTools(false);
    
//     // Create optimistic user message
//     const localUserMessage: ChatMessageType = {
//       id: generateFirestoreId(),
//       content: message,
//       isAi: false,
//       timestamp: new Date(),
//     };
    
//     // Update UI optimistically
//     setCurrentSpace(prev => prev ? {
//       ...prev,
//       messages: [...prev.messages, localUserMessage],
//       updatedAt: new Date()
//     } : null);
    
//     try {
//       // Get AI response (simulated for this example)
//       const aiResponseText = await simulateAiResponse(message);
      
//       // Create optimistic AI message
//       const localAiMessage: ChatMessageType = {
//         id: generateFirestoreId(),
//         content: aiResponseText,
//         isAi: true,
//         timestamp: new Date(),
//       };
      
//       // Update UI with AI response
//       setCurrentSpace(prev => prev ? {
//         ...prev,
//         messages: [...prev.messages, localAiMessage],
//         updatedAt: new Date()
//       } : null);
      
//       // Update spaces list to reflect most recent activity
//       setSpaces(prevSpaces => prevSpaces.map(space => 
//         space.id === currentSpace.id ? { ...space, updatedAt: new Date() } : space
//       ));
      
//       return true;
//     } catch (error) {
//       console.error("Error during chat interaction:", error);
//       toast({
//         title: "Error",
//         description: "Something went wrong during the chat interaction.",
//         variant: "destructive",
//       });
//       return false;
//     }
//   };
  
//   // Simulate AI response (replace with actual API call in production)
//   const simulateAiResponse = async (message: string): Promise<string> => {
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve(`This is a simulated response to: "${message}"`);
//       }, 1000);
//     });
//   };
  
//   // Handle suggestion click from tools tab
//   const handleSuggestionClick = (suggestion: string) => {
//     handleSendMessage(suggestion);
//   };
  
//   // Suggestions for InputPrompt
//   const chatSuggestions = [
//     "Tell me more about this topic",
//     "Can you provide examples?",
//     "What's your opinion on this?"
//   ];
  
//   // Render the content of the chat area
//   const renderContent = () => {
//     if (!currentSpace || currentSpace.messages.length === 0) {
//       return (
//         // <div className="flex-grow flex items-center justify-center">
//         //   <div className="text-center max-w-md mx-auto p-8 bg-gradient-to-b from-background to-muted/30 rounded-xl shadow-sm border">
//         //     <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">Welcome to Chat</h2>
//         //     <p className="mb-8 text-muted-foreground">
//         //       Start a new conversation or select an existing chat from the sidebar.
//         //     </p>
//         //     <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2 px-6">
//         //       <MessageCircle size={16} />
//         //       Create New Chat
//         //     </Button>
//         //   </div>
//         // </div>
//         <div></div>
//       );
//     }
    
//     return (
//       <>
//         {currentSpace.messages.map((message: ChatMessageType) => (
//           <ChatMessage
//             key={message.id}
//             content={message.content}
//             isAi={message.isAi}
//             timestamp={message.timestamp}
//           />
//         ))}
//         <div ref={messagesEndRef} />
//       </>
//     );
//   };
  
//   return (
//     <div className="flex h-screen overflow-hidden bg-background">
//       <SidebarShadcn />
      
//       <div className="flex-1 flex flex-col h-full">
//         <div className="flex flex-col h-full">
//           {/* Fixed Header */}
//           {currentSpace && (
//             <div className="flex-shrink-0 p-2 bg-background z-10 border-b">
//               <div className="mx-auto max-w-4xl flex items-center">
//                 <h1 className="text-base font-normal">{currentSpace.name}</h1>
//               </div>
//             </div>
//           )}
          
//           {/* Tools Tab Area */}
//           {showTools && (
//             <div className="flex-shrink-0 px-4 md:px-6 lg:px-8 py-6">
//               <div className="mx-auto max-w-4xl">
//                 <ToolsTabs onSendMessage={handleSendMessage}/>
//               </div>
//             </div>
//           )}
          
//           {/* Scrollable Content Area */}
//           <div className="flex-grow overflow-y-auto px-4 md:px-6 lg:px-8 py-4">
//             <div className="mx-auto max-w-4xl">
//               {renderContent()}
//             </div>
//           </div>
          
//           {/* Fixed Footer - Input Area */}
//           <div className="flex-shrink-0 p-4 md:p-6 lg:p-8 pt-2 md:pt-3 lg:pt-4">
//             <div className="mx-auto max-w-4xl">
//               <InputPrompt 
//                 onSendMessage={handleSendMessage} 
//                 placeholder={currentSpace ? "Type your message here..." : "Create a new chat to start messaging"}
//                 disabled={!currentSpace}
//                 promptSuggestions={currentSpace ? chatSuggestions : []}
//                 onSuggestionClick={handleSuggestionClick}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <CreateItemDialog
//         open={createDialogOpen}
//         onClose={() => setCreateDialogOpen(false)}
//         onSubmit={handleCreateNewChat}
//         title="Create New Chat"
//         description="Enter a name for your new chat."
//         itemLabel="Chat"
//       />
//     </div>
//   );
// };

// export default Index;
