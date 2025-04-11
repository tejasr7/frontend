import { Send, Loader2 } from "lucide-react";
import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Image, Upload, File, MapPin } from "lucide-react";

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
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setMediaDialogOpen(true);
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs">
              <Upload className="h-3 w-3 mr-1" /> Add Media
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
                <File className="mr-2 h-4 w-4" /> Upload File
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="justify-start"
              >
                <MapPin className="mr-2 h-4 w-4" /> Share Location
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
