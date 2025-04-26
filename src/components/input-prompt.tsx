import { Send, Loader2, Paperclip, Mic, CornerDownLeft } from "lucide-react";
import React, { useState, useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat/chat-input";

interface InputPromptProps {
  onSendMessage?: (message: string) => void;
  onSendImage?: (imageBase64: string) => void;
  placeholder?: string;
  disabled?: boolean;
  promptSuggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function InputPrompt({ 
  onSendMessage,
  placeholder = "Type your message here...",
  disabled = false,
  promptSuggestions = [],
  onSuggestionClick
}: InputPromptProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // This effect is to ensure we maintain any custom resize behavior if needed
  useEffect(() => {
    if (chatInputRef.current) {
      // Reset height to get the correct scrollHeight
      chatInputRef.current.style.height = 'auto';
      // Set new height based on scrollHeight (with min height)
      const newHeight = Math.max(48, Math.min(200, chatInputRef.current.scrollHeight));
      chatInputRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      // Add your file handling logic here
      console.log("File selected:", file.name);
      // If you have onSendImage logic:
      // processAndSendImage(file);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || disabled) return;

    setIsLoading(true);

    try {
      if (onSendMessage) {
        await onSendMessage(message);
      } else {
        console.log('Message sent:', message);
        toast({
          title: "Message sent",
          description: "Your message has been sent successfully.",
        });
      }
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Function to handle clicking on a suggestion
  const handleSuggestionSelect = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else if (onSendMessage) {
      onSendMessage(suggestion);
    }
  };

  return (
    <div>
      {/* Suggestions display, if provided */}
      {promptSuggestions.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {promptSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionSelect(suggestion)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
            >
              {suggestion.length > 30 ? `${suggestion.substring(0, 30)}...` : suggestion}
            </button>
          ))}
        </div>
      )}
    
      <form
        className="relative rounded-lg border focus-within:ring-1 focus-within:ring-ring"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <ChatInput
          ref={chatInputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          disabled={disabled}
        />
        <div className="flex items-center p-3 pt-0">
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="size-4" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
          >
            <Mic className="size-4" />
            <span className="sr-only">Use Microphone</span>
          </Button>
          <Button
            type="submit"
            size="sm"
            className="ml-auto gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground" 
            disabled={isLoading || !message.trim() || disabled}
          >
            {isLoading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <>
                Send
                <CornerDownLeft className="size-3.5" />
              </>
            )}
          </Button>
        </div>
        
        {/* File input for handling attachments */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
          accept="image/*,application/pdf,text/plain"
        />
      </form>
    </div>
  );
}


// import { Send, Loader2, Paperclip, Mic, CornerDownLeft } from "lucide-react";
// import React, { useState, useRef, useEffect } from 'react';
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { ChatInput } from "@/components/ui/chat/chat-input"; // Import the shadcn ChatInput

// interface InputPromptProps {
//   onSendMessage?: (message: string) => void;
//   onSendImage?: (imageBase64: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }

// export function InputPrompt({ 
//   onSendMessage,
//   placeholder = "Type your message here...",
//   disabled = false
// }: InputPromptProps) {
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const chatInputRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   // This effect is to ensure we maintain any custom resize behavior if needed
//   useEffect(() => {
//     if (chatInputRef.current) {
//       // Reset height to get the correct scrollHeight
//       chatInputRef.current.style.height = 'auto';
//       // Set new height based on scrollHeight (with min height)
//       const newHeight = Math.max(48, Math.min(200, chatInputRef.current.scrollHeight));
//       chatInputRef.current.style.height = `${newHeight}px`;
//     }
//   }, [message]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       // Add your file handling logic here
//       console.log("File selected:", file.name);
//       // If you have onSendImage logic:
//       // processAndSendImage(file);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || disabled) return;

//     setIsLoading(true);

//     try {
//       if (onSendMessage) {
//         await onSendMessage(message);
//       } else {
//         console.log('Message sent:', message);
//         toast({
//           title: "Message sent",
//           description: "Your message has been sent successfully.",
//         });
//       }
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast({
//         title: "Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <form
//       className="relative rounded-lg border focus-within:ring-1 focus-within:ring-ring"
//       onSubmit={(e) => {
//         e.preventDefault();
//         handleSendMessage();
//       }}
//     >
//       <ChatInput
//         ref={chatInputRef}
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
//         disabled={disabled}
//       />
//       <div className="flex items-center p-3 pt-0">
//         <Button 
//           type="button"
//           variant="ghost" 
//           size="icon"
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <Paperclip className="size-4" />
//           <span className="sr-only">Attach file</span>
//         </Button>
//         <Button 
//           type="button"
//           variant="ghost" 
//           size="icon"
//         >
//           <Mic className="size-4" />
//           <span className="sr-only">Use Microphone</span>
//         </Button>
//         <Button
//           type="submit"
//           size="sm"
//           className="ml-auto gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground" 
//           disabled={isLoading || !message.trim() || disabled}
//         >
//           {isLoading ? (
//             <Loader2 size={14} className="animate-spin" />
//           ) : (
//             <>
//               Send
//               <CornerDownLeft className="size-3.5" />
//             </>
//           )}
//         </Button>
//       </div>
      
//       {/* File input for handling attachments */}
//       <input 
//         type="file" 
//         ref={fileInputRef} 
//         className="hidden" 
//         onChange={handleFileUpload}
//         accept="image/*,application/pdf,text/plain"
//       />
//     </form>
//   );
// }















// import { Send, Loader2, Paperclip, Mic, CornerDownLeft } from "lucide-react";
// import React, { useState, useRef, useEffect } from 'react';
// import { useToast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { ChatInput } from "@/components/ui/chat/chat-input"; // Import the shadcn ChatInput

// interface InputPromptProps {
//   onSendMessage?: (message: string) => void;
//   onSendImage?: (imageBase64: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }

// export function InputPrompt({ 
//   onSendMessage,
//   placeholder = "Type your message here...",
//   disabled = false
// }: InputPromptProps) {
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const chatInputRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   // This effect is to ensure we maintain any custom resize behavior if needed
//   // Can be removed if ChatInput handles resizing internally
//   useEffect(() => {
//     if (chatInputRef.current) {
//       // Reset height to get the correct scrollHeight
//       chatInputRef.current.style.height = 'auto';
//       // Set new height based on scrollHeight (with min height)
//       const newHeight = Math.max(48, Math.min(200, chatInputRef.current.scrollHeight));
//       chatInputRef.current.style.height = `${newHeight}px`;
//     }
//   }, [message]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       // Add your file handling logic here
//       console.log("File selected:", file.name);
//       // If you have onSendImage logic:
//       // processAndSendImage(file);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || disabled) return;

//     setIsLoading(true);

//     try {
//       if (onSendMessage) {
//         await onSendMessage(message);
//       } else {
//         console.log('Message sent:', message);
//         toast({
//           title: "Message sent",
//           description: "Your message has been sent successfully.",
//         });
//       }
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast({
//         title: "Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <form
//         className="relative rounded-lg border border-transparent bg-transparent focus-within:ring-1 focus-within:ring-ring p-1"
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleSendMessage();
//         }}
//       >
//         <ChatInput
//           ref={chatInputRef}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//           className="min-h-12 resize-none rounded-lg bg-transparent border-0 p-3 shadow-none focus-visible:ring-0"
//           disabled={disabled}
//         />
//       <div className="flex items-center p-3 pt-0">
//         <Button 
//           type="button"
//           variant="ghost" 
//           size="icon"
//           onClick={() => fileInputRef.current?.click()}
//         >
//           <Paperclip className="size-4" />
//           <span className="sr-only">Attach file</span>
//         </Button>
//         <Button 
//           type="button"
//           variant="ghost" 
//           size="icon"
//         >
//           <Mic className="size-4" />
//           <span className="sr-only">Use Microphone</span>
//         </Button>
//         <Button
//           type="submit"
//           size="sm"
//           className="ml-auto gap-1.5 bg-black hover:bg-black/90 text-white" 
//           disabled={isLoading || !message.trim() || disabled}
//         >
//           {isLoading ? (
//             <Loader2 size={14} className="animate-spin" />
//           ) : (
//             <>
//               Send Message
//               <CornerDownLeft className="size-3.5" />
//             </>
//           )}
//         </Button>
//       </div>
      
//       {/* File input for handling attachments */}
//       <input 
//         type="file" 
//         ref={fileInputRef} 
//         className="hidden" 
//         onChange={handleFileUpload}
//         accept="image/*,application/pdf,text/plain"
//       />
//     </form>
//   );
// }






// import { Send, Loader2, Image, Upload, File, MapPin, Plus, Paperclip, Smile } from "lucide-react";
// import React, { useState, useRef, useEffect } from 'react';
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// interface InputPromptProps {
//   onSendMessage?: (message: string) => void;
//   onSendImage?: (imageBase64: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }

// export function InputPrompt({ 
//   onSendMessage,
//   placeholder = "Type your message here...",
//   disabled = false
// }: InputPromptProps) {
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [uploadingMedia, setUploadingMedia] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
//   const [textareaHeight, setTextareaHeight] = useState<number>(60); // Default height
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   // Auto-resize textarea based on content
//   useEffect(() => {
//     if (textareaRef.current) {
//       // Reset height to get the correct scrollHeight
//       textareaRef.current.style.height = 'auto';
//       // Set new height based on scrollHeight (with min height)
//       const newHeight = Math.max(60, Math.min(200, textareaRef.current.scrollHeight));
//       textareaRef.current.style.height = `${newHeight}px`;
//       setTextareaHeight(newHeight);
//     }
//   }, [message]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setMediaDialogOpen(true);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || disabled) return;

//     setIsLoading(true);

//     try {
//       if (onSendMessage) {
//         await onSendMessage(message);
//       } else {
//         console.log('Message sent:', message);
//         toast({
//           title: "Message sent",
//           description: "Your message has been sent successfully.",
//         });
//       }
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast({
//         title: "Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="border rounded-xl p-3 bg-background shadow-sm md:p-4 transition-all">
//       <Textarea 
//         ref={textareaRef}
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         className="min-h-[60px] mb-2 resize-none text-sm md:text-base border-0 focus-visible:ring-0 p-0 shadow-none"
//         disabled={disabled}
//       />
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex items-center gap-1">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <Paperclip size={18} />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="top">Attach File</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
          
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
//                 >
//                   <Smile size={18} />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="top">Emoji</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
          
//           <input 
//             type="file" 
//             ref={fileInputRef} 
//             className="hidden" 
//             onChange={handleFileUpload}
//             accept="image/*,application/pdf,text/plain"
//             title="Upload a file"
//           />
//         </div>
        
//         <Button 
//           className={`rounded-full h-10 w-10 p-0 ${message.trim() ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
//           onClick={handleSendMessage}
//           disabled={isLoading || !message.trim() || disabled}
//         >
//           {isLoading ? 
//             <Loader2 size={18} className="animate-spin" /> : 
//             <Send size={18} className={message.trim() ? 'text-primary-foreground' : ''} />
//           }
//         </Button>
//       </div>
//     </div>
//   );
// }





// import { Send, Loader2, Image, Upload, File, MapPin, Plus, Paperclip, Smile } from "lucide-react";
// import React, { useState, useRef, useEffect } from 'react';
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// interface InputPromptProps {
//   onSendMessage?: (message: string) => void;
//   onSendImage?: (imageBase64: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }

// export function InputPrompt({ 
//   onSendMessage,
//   placeholder = "Type your message here...",
//   disabled = false
// }: InputPromptProps) {
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [uploadingMedia, setUploadingMedia] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
//   const [textareaHeight, setTextareaHeight] = useState<number>(60); // Default height
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   // Auto-resize textarea based on content
//   useEffect(() => {
//     if (textareaRef.current) {
//       // Reset height to get the correct scrollHeight
//       textareaRef.current.style.height = 'auto';
//       // Set new height based on scrollHeight (with min height)
//       const newHeight = Math.max(60, Math.min(200, textareaRef.current.scrollHeight));
//       textareaRef.current.style.height = `${newHeight}px`;
//       setTextareaHeight(newHeight);
//     }
//   }, [message]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setMediaDialogOpen(true);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || disabled) return;

//     setIsLoading(true);

//     try {
//       if (onSendMessage) {
//         await onSendMessage(message);
//       } else {
//         console.log('Message sent:', message);
//         toast({
//           title: "Message sent",
//           description: "Your message has been sent successfully.",
//         });
//       }
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast({
//         title: "Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="border rounded-xl p-3 bg-background shadow-sm md:p-4 transition-all">
//       <Textarea 
//         ref={textareaRef}
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         className="min-h-[60px] mb-2 resize-none text-sm md:text-base border-0 focus-visible:ring-0 p-0 shadow-none"
//         disabled={disabled}
//       />
//       <div className="flex items-center justify-between gap-2">
//         <div className="flex items-center gap-1">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
//                   onClick={() => fileInputRef.current?.click()}
//                 >
//                   <Paperclip size={18} />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="top">Attach File</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
          
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
//                 >
//                   <Smile size={18} />
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent side="top">Emoji</TooltipContent>
//             </Tooltip>
//           </TooltipProvider>
          
//           <input 
//             type="file" 
//             ref={fileInputRef} 
//             className="hidden" 
//             onChange={handleFileUpload}
//             accept="image/*,application/pdf,text/plain"
//             title="Upload a file"
//           />
//         </div>
        
//         <Button 
//           className={`rounded-full h-10 w-10 p-0 ${message.trim() ? 'bg-primary hover:bg-primary/90' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
//           onClick={handleSendMessage}
//           disabled={isLoading || !message.trim() || disabled}
//         >
//           {isLoading ? 
//             <Loader2 size={18} className="animate-spin" /> : 
//             <Send size={18} className={message.trim() ? 'text-primary-foreground' : ''} />
//           }
//         </Button>
//       </div>
//     </div>
//   );
// }


// import { Send, Loader2 } from "lucide-react";
// import React, { useState, useRef } from 'react';
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Image, Upload, File, MapPin } from "lucide-react";

// interface InputPromptProps {
//   onSendMessage?: (message: string) => void;
//   onSendImage?: (imageBase64: string) => void;
//   placeholder?: string;
//   disabled?: boolean;
// }

// export function InputPrompt({ 
//   onSendMessage,
//   placeholder = "Type your message here...",
//   disabled = false
// }: InputPromptProps) {
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [uploadingMedia, setUploadingMedia] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setMediaDialogOpen(true);
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || disabled) return;

//     setIsLoading(true);

//     try {
//       if (onSendMessage) {
//         await onSendMessage(message);
//       } else {
//         console.log('Message sent:', message);
//         toast({
//           title: "Message sent",
//           description: "Your message has been sent successfully.",
//         });
//       }
//       setMessage('');
//     } catch (error) {
//       console.error('Error sending message:', error);
//       toast({
//         title: "Error",
//         description: "Failed to send message. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

  
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="border rounded-lg p-4 bg-background shadow-sm md:p-6">
//       <div className="mb-2 flex items-center gap-2">
//         {/* <span className="text-sm text-muted-foreground">Make a plot of...</span>
//         <div className="p-1 px-2 bg-muted rounded-md text-xs text-muted-foreground">@DeepTutor</div> */}
//       </div>
//       <Textarea 
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder={placeholder}
//         className="min-h-[60px] mb-2 resize-none text-sm md:text-base"
//         disabled={disabled}
//       />
//       <div className="flex flex-col md:flex-row items-center justify-between gap-2">
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className="text-xs md:text-sm">
//               <Upload className="h-3 w-3 mr-1 md:h-4 md:w-4" /> Add Media
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-48 p-2">
//             <div className="grid gap-1">
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 className="justify-start"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <Image className="mr-2 h-4 w-4" /> Insert Image
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 className="justify-start"
//                 onClick={() => fileInputRef.current?.click()}
//               >
//                 <File className="mr-2 h-4 w-4" /> Upload File
//               </Button>
//               <Button 
//                 variant="ghost" 
//                 size="sm" 
//                 className="justify-start"
//               >
//                 <MapPin className="mr-2 h-4 w-4" /> Share Location
//               </Button>
//               <input 
//                 type="file" 
//                 ref={fileInputRef} 
//                 className="hidden" 
//                 onChange={handleFileUpload}
//                 accept="image/*,application/pdf,text/plain"
//                 title="Upload a file"
//               />
//             </div>
//           </PopoverContent>
//         </Popover>
//         <div className="flex items-center gap-2 w-full md:w-auto">
//           <button 
//             className="p-2 bg-primary rounded-lg text-primary-foreground w-full md:w-auto"
//             onClick={handleSendMessage}
//             disabled={isLoading || !message.trim() || disabled}
//           >
//             {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
