"use client"

interface PromptSuggestionsProps {
  label: string
  append: (message: string) => void
  suggestions: string[]
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-center text-2xl font-bold">{label}</h2>
      <div className="flex gap-6 text-sm">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append(suggestion)}
            className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
          >
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

interface ToolsTabsProps {
  onSendMessage: (message: string) => void
}

export function ToolsTabs({ onSendMessage }: ToolsTabsProps) {
  return (
    <div className="w-full">
      <PromptSuggestions
        label="Try one of these prompts!"
        append={(msg) => onSendMessage(msg.content)} // 👈 extract the string here
        suggestions={[
          "What is the capital of France?",
          "Who won the 2022 FIFA World Cup?",
          "Give me a vegan lasagna recipe for 3 people.",
        ]}
      />
    </div>
  )
}


/////////////////////////////////////
/// generate whole new ui for the chats with box chat interface
// "use client"
 
// import { toast } from "sonner"
// import { useState } from "react"
 
// interface PromptSuggestionsProps {
//   label: string
//   append: (message: { role: "user"; content: string }) => void
//   suggestions: string[]
// }
 
// export function PromptSuggestions({
//   label,
//   append,
//   suggestions,
// }: PromptSuggestionsProps) {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-center text-2xl font-bold">{label}</h2>
//       <div className="flex gap-6 text-sm">
//         {suggestions.map((suggestion) => (
//           <button
//             key={suggestion}
//             onClick={() => append({ role: "user", content: suggestion })}
//             className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
//           >
//             <p>{suggestion}</p>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// export function ToolsTabs() {
//   // State to track messages in the demo
//   const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // Function to handle sending a message
//   const handleSendMessage = async (content: string) => {
//     // Add user message
//     const userMessage = { role: "user", content };
//     setMessages(prev => [...prev, userMessage]);
    
//     setIsLoading(true);
    
//     // Simulate AI response with a delay
//     setTimeout(() => {
//       const aiMessage = { 
//         role: "assistant", 
//         content: `Here's a response to your question about "${content.substring(0, 30)}${content.length > 30 ? '...' : ''}"` 
//       };
//       setMessages(prev => [...prev, aiMessage]);
//       setIsLoading(false);
      
//       // Show toast notification
//       toast("AI response received", {
//         description: "The AI has responded to your message."
//       });
//     }, 1000);
//   };

//   // Function to handle clicking on a suggestion
//   const handleSuggestionClick = (message: { role: "user"; content: string }) => {
//     // Show toast for the click action
//     toast(`Using suggested prompt`, { 
//       description: `"${message.content.substring(0, 40)}${message.content.length > 40 ? '...' : ''}"` 
//     });
    
//     // Send the message using our handler
//     handleSendMessage(message.content);
//   };

//   return (
//     <div className="w-full">
//       <PromptSuggestions
//         label="Try one of these prompts!"
//         append={handleSuggestionClick}
//         suggestions={[
//           "What is the capital of France?",
//           "Who won the 2022 FIFA World Cup?",
//           "Give me a vegan lasagna recipe for 3 people.",
//         ]}
//       />
      
//       {/* Display messages if any exist */}
//       {messages.length > 0 && (
//         <div className="mt-8 space-y-4">
//           <h3 className="text-lg font-medium">Conversation</h3>
//           <div className="border rounded-lg overflow-hidden">
//             <div className="divide-y">
//               {messages.map((message, index) => (
//                 <div 
//                   key={index} 
//                   className={`p-4 ${message.role === "user" ? "bg-muted/50" : "bg-background"}`}
//                 >
//                   <p className="text-sm font-medium mb-1">
//                     {message.role === "user" ? "You" : "AI Assistant"}
//                   </p>
//                   <p className="text-sm">{message.content}</p>
//                 </div>
//               ))}
//             </div>
            
//             {isLoading && (
//               <div className="p-4 flex items-center gap-2 text-muted-foreground">
//                 <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
//                 <span className="text-sm">AI is thinking...</span>
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


/// //////////////////// working but clicking on suggestion doesnt generate anything
// "use client"
 
// import { toast } from "sonner"
 
// interface PromptSuggestionsProps {
//   label: string
//   append: (message: { role: "user"; content: string }) => void
//   suggestions: string[]
// }
 
// export function PromptSuggestions({
//   label,
//   append,
//   suggestions,
// }: PromptSuggestionsProps) {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-center text-2xl font-bold">{label}</h2>
//       <div className="flex gap-6 text-sm">
//         {suggestions.map((suggestion) => (
//           <button
//             key={suggestion}
//             onClick={() => append({ role: "user", content: suggestion })}
//             className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
//           >
//             <p>{suggestion}</p>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// export function ToolsTabs() {
//   return (
//     <div className="w-full">
//       <PromptSuggestions
//         label="Try one of these prompts!"
//         append={(message) => {
//           toast(`Clicked on "${message.content}"`)
//         }}
//         suggestions={[
//           "What is the capital of France?",
//           "Who won the 2022 FIFA World Cup?",
//           "Give me a vegan lasagna recipe for 3 people.",
//         ]}
//       />
//     </div>
//   )
// }



////////////////////// working but i dont like the chat input 
// "use client"
 
// import { toast } from "sonner"
// import { useState } from "react"
// import { cn } from "@/lib/utils"
// import { Chat } from "@/components/ui/chat"
 
// interface PromptSuggestionsProps {
//   label: string
//   append: (message: { role: "user"; content: string }) => void
//   suggestions: string[]
// }
 
// export function PromptSuggestions({
//   label,
//   append,
//   suggestions,
// }: PromptSuggestionsProps) {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-center text-2xl font-bold">{label}</h2>
//       <div className="flex gap-6 text-sm">
//         {suggestions.map((suggestion) => (
//           <button
//             key={suggestion}
//             onClick={() => append({ role: "user", content: suggestion })}
//             className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
//           >
//             <p>{suggestion}</p>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// // Modified ChatDemo without useChat and transcribeAudio dependencies
// export function ChatDemo() {
//   const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleInputChange = (value: string) => {
//     setInput(value);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;
    
//     // Add user message
//     const userMessage = { role: "user", content: input };
//     setMessages([...messages, userMessage]);
//     setInput("");
    
//     // Simulate AI response
//     setIsLoading(true);
//     setTimeout(() => {
//       const aiMessage = { role: "assistant", content: `This is a simulated response to: "${input}"` };
//       setMessages(prev => [...prev, aiMessage]);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const append = (message: { role: string; content: string }) => {
//     setMessages([...messages, message]);
    
//     // Simulate AI response
//     setIsLoading(true);
//     setTimeout(() => {
//       const aiMessage = { role: "assistant", content: `This is a simulated response to: "${message.content}"` };
//       setMessages(prev => [...prev, aiMessage]);
//       setIsLoading(false);
//     }, 1000);
//   };

//   const stop = () => {
//     setIsLoading(false);
//   };

//   return (
//     <div className={cn("flex", "flex-col", "h-[500px]", "w-full")}>
//       <Chat
//         className="grow"
//         messages={messages}
//         handleSubmit={handleSubmit}
//         input={input}
//         handleInputChange={handleInputChange}
//         isGenerating={isLoading}
//         stop={stop}
//         append={append}
//         setMessages={setMessages}
//         suggestions={[
//           "What is the weather in San Francisco?",
//           "Explain step-by-step how to solve this math problem: If x² + 6x + 9 = 25, what is x?",
//           "Design a simple algorithm to find the longest palindrome in a string.",
//         ]}
//       />
//     </div>
//   )
// }

// export function ToolsTabs() {
//   return (
//     <div className="w-full space-y-8">
//       <PromptSuggestions
//         label="Try one of these prompts!"
//         append={(message) => {
//           toast(`Clicked on "${message.content}"`)
//         }}
//         suggestions={[
//           "What is the capital of France?",
//           "Who won the 2022 FIFA World Cup?",
//           "Give me a vegan lasagna recipe for 3 people.",
//         ]}
//       />
      
//       <div className="mt-8">
//         <h2 className="text-center text-2xl font-bold mb-6">Chat Interface</h2>
//         <ChatDemo />
//       </div>
//     </div>
//   )
// }












// "use client"
 
// import { toast } from "sonner"
 
// // import { PromptSuggestions } from "@/components/ui/prompt-suggestions"
 
// interface PromptSuggestionsProps {
//   label: string
//   append: (message: { role: "user"; content: string }) => void
//   suggestions: string[]
// }
 
// export function PromptSuggestions({
//   label,
//   append,
//   suggestions,
// }: PromptSuggestionsProps) {
//   return (
//     <div className="space-y-6">
//       <h2 className="text-center text-2xl font-bold">{label}</h2>
//       <div className="flex gap-6 text-sm">
//         {suggestions.map((suggestion) => (
//           <button
//             key={suggestion}
//             onClick={() => append({ role: "user", content: suggestion })}
//             className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-muted"
//           >
//             <p>{suggestion}</p>
//           </button>
//         ))}
//       </div>
//     </div>
//   )
// }

// export function ToolsTabs() {
//   return (
//     <div className="w-full">
//       <PromptSuggestions
//         label="Try one of these prompts!"
//         append={(message) => {
//           toast(`Clicked on "${message.content}"`)
//         }}
//         suggestions={[
//           "What is the capital of France?",
//           "Who won the 2022 FIFA World Cup?",
//           "Give me a vegan lasagna recipe for 3 people.",
//         ]}
//       />
//     </div>
//   )
// }


// import React, { useState } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ToolCard } from './tool-card';

// export function ToolsTabs() {
//   const [activeTab, setActiveTab] = useState("interactive-tools");
  
//   return (
//     <Tabs defaultValue="interactive-tools" className="w-full" onValueChange={setActiveTab}>
//       <TabsList className=" w-300px justify-center">
        
//       </TabsList>
//       <div className="mt-8">
//         <p className="text-center text-muted-foreground mb-6">
//           Learn exactly how you want to alongside, with every learning tool you might need at your disposal.
//         </p>
//       </div>
//       <TabsContent value="interactive-tools" className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <ToolCard 
//           icon="graph"
//           title="GRAPHING"
//           description="Generate, edit, and analyze graphs and plots"
//           tag=""
//         />
//         <ToolCard 
//           icon="video"
//           title="VIDEO GENERATION"
//           description="Generate personalized video lessons to visualize concepts"
//           tag=""
//         />
//         <ToolCard 
//           icon="whiteboard"
//           title="WHITEBOARD"
//           description="Draw and diagram your ideas and notes"
//           tag=""
//         />
//       </TabsContent>
//     </Tabs>
//   );
// }
