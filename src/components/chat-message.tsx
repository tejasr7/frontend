import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export interface ChatMessageProps {
  content: string;
  isAi?: boolean;
  timestamp?: Date;
}

export function ChatMessage({ content, isAi = false, timestamp = new Date() }: ChatMessageProps) {
  return (
    <div className={`flex flex-col w-full items-center gap-3 mb-4 ${isAi ? 'md:flex-row' : 'md:flex-row-reverse'} md:gap-4`}>
      <div className="flex-shrink-0">
        <Avatar className="w-10 h-10 md:w-12 md:h-12">
          {isAi ? (
            <AvatarImage src="/placeholder.svg" alt="AI" />
          ) : (
            <AvatarImage src="https://github.com/shadcn.png" alt="User" />
          )}
          <AvatarFallback>{isAi ? 'AI' : 'U'}</AvatarFallback>
        </Avatar>
      </div>
      <div className={`flex flex-col max-w-full ${isAi ? '' : 'items-end'} md:max-w-[75%]`}>
        <div className={`p-3 rounded-lg ${isAi ? 'bg-muted' : 'bg-primary text-primary-foreground'} md:p-4`}>
          <p className="whitespace-pre-wrap text-sm md:text-base">{content}</p>
        </div>
        <div className="text-xs text-muted-foreground mt-1 md:text-sm">
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
