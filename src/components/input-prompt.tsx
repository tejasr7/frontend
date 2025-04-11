import React, { useState } from 'react';
import { Send, Loader2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface InputPromptProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function InputPrompt({ 
  onSendMessage,
  placeholder = "Type your message here...",
  disabled = false
}: InputPromptProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  return (
    <div className="border rounded-lg p-4 bg-background shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Make a plot of...</span>
        <div className="p-1 px-2 bg-muted rounded-md text-xs text-muted-foreground">@DeepTutor</div>
      </div>
      <Textarea 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="min-h-[60px] mb-2 resize-none"
        disabled={disabled}
      />
      <div className="flex items-center justify-between">
        <button className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Feynman may make mistakes. Check important info and please report any bugs.
          </p>
          <button 
            className="p-2 bg-primary rounded-lg text-primary-foreground"
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim() || disabled}
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}


// import React, { useState } from 'react';
// import { Send, Loader2 } from "lucide-react";
// import { Textarea } from "./ui/textarea";
// import { useToast } from "@/hooks/use-toast";

// export function InputPrompt({ onSendMessage }: { onSendMessage?: (message: string) => void }) {
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const handleSendMessage = async () => {
//     if (!message.trim()) return;
    
//     setIsLoading(true);
    
//     try {
//       if (onSendMessage) {
//         await onSendMessage(message);
//       } else {
//         // Default handler for standalone use
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
//     <div className="border rounded-lg p-4 bg-background shadow-sm">
//       <div className="mb-2 flex items-center gap-2">
//         <span className="text-sm text-muted-foreground">Make a plot of...</span>
//         <div className="p-1 px-2 bg-muted rounded-md text-xs text-muted-foreground">@DeepTutor</div>
//       </div>
//       <Textarea 
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type your message here..."
//         className="min-h-[60px] mb-2 resize-none"
//       />
//       <div className="flex items-center justify-between">
//         <button className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground">
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </button>
//         <div className="flex items-center gap-2">
//           <p className="text-xs text-muted-foreground">
//             Feynman may make mistakes. Check important info and please report any bugs.
//           </p>
//           <button 
//             className="p-2 bg-primary rounded-lg text-primary-foreground"
//             onClick={handleSendMessage}
//             disabled={isLoading || !message.trim()}
//           >
//             {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState } from 'react';
// import { Send, Loader2 } from "lucide-react";
// import { Textarea } from "./ui/textarea";
// import { useToast } from "@/hooks/use-toast";

// export function InputPrompt({ onSendMessage }: { onSendMessage?: (message: string) => void }) {
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();

//   const handleSendMessage = async () => {
//     if (!message.trim()) return;
    
//     setIsLoading(true);
    
//     try {
//       if (onSendMessage) {
//         await onSendMessage(message);
//       } else {
//         // Default handler for standalone use
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
//     <div className="border rounded-lg p-4 bg-background">
//       <div className="mb-2 flex items-center gap-2">
//         <span className="text-sm text-muted-foreground">Make a plot of...</span>
//         <div className="p-1 px-2 bg-muted rounded-md text-xs text-muted-foreground">@DeepTutor</div>
//       </div>
//       <Textarea 
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Type your message here..."
//         className="min-h-[60px] mb-2 resize-none"
//       />
//       <div className="flex items-center justify-between">
//         <button className="w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground">
//           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//             <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//         </button>
//         <div className="flex items-center gap-2">
//           <p className="text-xs text-muted-foreground">
//             Feynman may make mistakes. Check important info and please report any bugs.
//           </p>
//           <button 
//             className="p-2 bg-primary rounded-lg text-primary-foreground"
//             onClick={handleSendMessage}
//             disabled={isLoading || !message.trim()}
//           >
//             {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
