import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility for conditional classes

export interface ChatMessageProps {
  content: string;
  isAi?: boolean;
  timestamp?: Date;
}

export function ChatMessage({ content, isAi = false, timestamp = new Date() }: ChatMessageProps) {
  // Format time with AM/PM
  const formattedTime = timestamp.toLocaleTimeString([], { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  // Date formatting for showing date if not today
  const isToday = new Date().toDateString() === timestamp.toDateString();
  const dateDisplay = isToday 
    ? formattedTime 
    : `${timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${formattedTime}`;

  return (
    <div className={cn(
      "group flex items-start w-full py-3 px-4",
      isAi ? "justify-start" : "justify-end"
    )}>
      <div className={cn(
        "flex max-w-[85%] md:max-w-[75%] gap-3",
        isAi ? "flex-row" : "flex-row-reverse"
      )}>
        <div className="flex-shrink-0 mt-1">
          <Avatar className={cn(
            "w-8 h-8",
            isAi 
              ? "bg-gradient-to-br from-blue-500 to-cyan-600" 
              : "bg-gradient-to-br from-primary to-purple-600"
          )}>
            {isAi ? (
              <AvatarImage src="/ai-avatar.png" alt="AI" />
            ) : (
              <AvatarImage src="https://github.com/shadcn.png" alt="User" />
            )}
            <AvatarFallback className="text-xs text-primary-foreground font-medium">
              {isAi ? 'AI' : 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-col gap-1.5 min-w-0">            
          <div className="text-sm relative group/message break-words">
            <div className="whitespace-pre-wrap leading-relaxed">
              {content}
            </div>         
          </div>
          
          <div className={cn(
            "text-xs text-muted-foreground mt-1 opacity-70 transition-opacity group-hover:opacity-100",
            isAi ? "text-left ml-1" : "text-right mr-1"
          )}>
            {dateDisplay}
          </div>
        </div>
      </div>
    </div>
  );
}


// import React from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { cn } from "@/lib/utils"; // Assuming you have a cn utility for conditional classes

// export interface ChatMessageProps {
//   content: string;
//   isAi?: boolean;
//   timestamp?: Date;
// }

// export function ChatMessage({ content, isAi = false, timestamp = new Date() }: ChatMessageProps) {
//   // Format time with AM/PM
//   const formattedTime = timestamp.toLocaleTimeString([], { 
//     hour: 'numeric', 
//     minute: '2-digit',
//     hour12: true 
//   });
  
//   // Date formatting for showing date if not today
//   const isToday = new Date().toDateString() === timestamp.toDateString();
//   const dateDisplay = isToday 
//     ? formattedTime 
//     : `${timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${formattedTime}`;

//   return (
//     <div className={cn(
//       "group flex items-start w-full py-3 px-4",
//       isAi ? "justify-start" : "justify-end"
//     )}>
//       <div className={cn(
//         "flex max-w-[85%] md:max-w-[75%] gap-3",
//         isAi ? "flex-row" : "flex-row-reverse"
//       )}>
//         <div className="flex-shrink-0 mt-1">
//           <Avatar className={cn(
//             "w-8 h-8",
//             isAi 
//               ? "bg-gradient-to-br from-blue-500 to-cyan-600" 
//               : "bg-gradient-to-br from-primary to-purple-600"
//           )}>
//             {isAi ? (
//               <AvatarImage src="/ai-avatar.png" alt="AI" />
//             ) : (
//               <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//             )}
//             <AvatarFallback className="text-xs text-primary-foreground font-medium">
//               {isAi ? 'AI' : 'U'}
//             </AvatarFallback>
//           </Avatar>
//         </div>
        
//         <div className="flex flex-col gap-1.5 min-w-0">
//           <div className="text-sm relative group/message break-words">
//             <div className="whitespace-pre-wrap leading-relaxed">
//               {content}
//             </div>         
//           </div>
          
//           <div className={cn(
//             "text-xs text-muted-foreground mt-1 opacity-70 transition-opacity group-hover:opacity-100",
//             isAi ? "text-left ml-1" : "text-right mr-1"
//           )}>
//             {dateDisplay}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





/////////////////////////////////// ////////////////////////////////////////////////////////////////////////////////////
// import React from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { cn } from "@/lib/utils"; // Assuming you have a cn utility for conditional classes

// export interface ChatMessageProps {
//   content: string;
//   isAi?: boolean;
//   timestamp?: Date;
// }

// export function ChatMessage({ content, isAi = false, timestamp = new Date() }: ChatMessageProps) {
//   // Format time with AM/PM
//   const formattedTime = timestamp.toLocaleTimeString([], { 
//     hour: 'numeric', 
//     minute: '2-digit',
//     hour12: true 
//   });
  
//   // Date formatting for showing date if not today
//   const isToday = new Date().toDateString() === timestamp.toDateString();
//   const dateDisplay = isToday 
//     ? formattedTime 
//     : `${timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${formattedTime}`;

//   return (
//     <div className={cn(
//       "group flex items-start w-full py-3 px-4",
//       isAi ? "justify-start" : "justify-end"
//     )}>
//       <div className={cn(
//         "flex max-w-[85%] md:max-w-[75%] gap-3",
//         isAi ? "flex-row" : "flex-row-reverse"
//       )}>
//         <div className="flex-shrink-0 mt-1">
//           <Avatar className={cn(
//             "w-8 h-8",
//             isAi 
//               ? "bg-gradient-to-br from-blue-500 to-cyan-600" 
//               : "bg-gradient-to-br from-primary to-purple-600"
//           )}>
//             {isAi ? (
//               <AvatarImage src="/ai-avatar.png" alt="AI" />
//             ) : (
//               <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//             )}
//             <AvatarFallback className="text-xs text-primary-foreground font-medium">
//               {isAi ? 'AI' : 'U'}
//             </AvatarFallback>
//           </Avatar>
//         </div>
        
//         <div className="flex flex-col gap-1.5 min-w-0">            
//         <div className="text-sm relative group/message break-words">
//             <div className="whitespace-pre-wrap leading-relaxed">
//               {content}
//             </div>         
//         </div>
          
//           <div className={cn(
//             "text-xs text-muted-foreground mt-1 opacity-70 transition-opacity group-hover:opacity-100",
//             isAi ? "text-left ml-1" : "text-right mr-1"
//           )}>
//             {dateDisplay}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















// import React from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import { cn } from "@/lib/utils"; // Assuming you have a cn utility for conditional classes

// export interface ChatMessageProps {
//   content: string;
//   isAi?: boolean;
//   timestamp?: Date;
// }

// export function ChatMessage({ content, isAi = false, timestamp = new Date() }: ChatMessageProps) {
//   // Format time with AM/PM
//   const formattedTime = timestamp.toLocaleTimeString([], { 
//     hour: 'numeric', 
//     minute: '2-digit',
//     hour12: true 
//   });
  
//   // Date formatting for showing date if not today
//   const isToday = new Date().toDateString() === timestamp.toDateString();
//   const dateDisplay = isToday 
//     ? formattedTime 
//     : `${timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })} at ${formattedTime}`;

//   return (
//     <div className={cn(
//       "group flex w-full py-2 transition-all duration-200 hover:bg-muted/30 px-2 rounded-lg -mx-2",
//       isAi ? "justify-start" : "justify-end"
//     )}>
//       <div className={cn(
//         "flex max-w-[85%] md:max-w-[75%] gap-3",
//         isAi ? "flex-row" : "flex-row-reverse"
//       )}>
//         <div className="flex-shrink-0 mt-1">
//           <Avatar className={cn(
//             "w-8 h-8 transition-opacity ring-2 ring-background",
//             isAi 
//               ? "bg-gradient-to-br from-blue-500 to-cyan-600" 
//               : "bg-gradient-to-br from-primary to-purple-600"
//           )}>
//             {isAi ? (
//               <AvatarImage src="/ai-avatar.png" alt="AI" />
//             ) : (
//               <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//             )}
//             <AvatarFallback className="text-xs text-primary-foreground font-medium">
//               {isAi ? 'AI' : 'U'}
//             </AvatarFallback>
//           </Avatar>
//         </div>
        
//         <div className="flex flex-col">
//           <div className={cn(
//             "p-3 rounded-2xl text-sm md:text-base shadow-sm",
//             isAi 
//               ? "bg-muted border border-border rounded-tl-sm" 
//               : "bg-primary text-primary-foreground rounded-tr-sm"
//           )}>
//             <div className="whitespace-pre-wrap break-words">{content}</div>
//           </div>
          
//           <div className={cn(
//             "text-xs text-muted-foreground mt-1 opacity-70 transition-opacity group-hover:opacity-100",
//             isAi ? "text-left ml-1" : "text-right mr-1"
//           )}>
//             {dateDisplay}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }














// import React from 'react';
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

// export interface ChatMessageProps {
//   content: string;
//   isAi?: boolean;
//   timestamp?: Date;
// }

// export function ChatMessage({ content, isAi = false, timestamp = new Date() }: ChatMessageProps) {
//   return (
//     <div className={`flex flex-col w-full items-center gap-3 mb-4 ${isAi ? 'md:flex-row' : 'md:flex-row-reverse'} md:gap-4`}>
//       <div className="flex-shrink-0">
//         <Avatar className="w-10 h-10 md:w-12 md:h-12">
//           {isAi ? (
//             <AvatarImage src="/placeholder.svg" alt="AI" />
//           ) : (
//             <AvatarImage src="https://github.com/shadcn.png" alt="User" />
//           )}
//           <AvatarFallback>{isAi ? 'AI' : 'U'}</AvatarFallback>
//         </Avatar>
//       </div>
//       <div className={`flex flex-col max-w-full ${isAi ? '' : 'items-end'} md:max-w-[75%]`}>
//         <div className={`p-3 rounded-lg ${isAi ? 'bg-muted' : 'bg-primary text-primary-foreground'} md:p-4`}>
//           <p className="whitespace-pre-wrap text-sm md:text-base">{content}</p>
//         </div>
//         <div className="text-xs text-muted-foreground mt-1 md:text-sm">
//           {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//         </div>
//       </div>
//     </div>
//   );
// }
