
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolCard } from './tool-card';

export function ToolsTabs() {
  const [activeTab, setActiveTab] = useState("interactive-tools");
  
  return (
    <Tabs defaultValue="interactive-tools" className="w-full" onValueChange={setActiveTab}>
      <TabsList className=" w-300px justify-center">
        
      </TabsList>
      <div className="mt-8">
        <p className="text-center text-muted-foreground mb-6">
          Learn exactly how you want to alongside, with every learning tool you might need at your disposal.
        </p>
      </div>
      <TabsContent value="interactive-tools" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ToolCard 
          icon="graph"
          title="GRAPHING"
          description="Generate, edit, and analyze graphs and plots"
          tag=""
        />
        <ToolCard 
          icon="video"
          title="VIDEO GENERATION"
          description="Generate personalized video lessons to visualize concepts"
          tag=""
        />
        <ToolCard 
          icon="whiteboard"
          title="WHITEBOARD"
          description="Draw and diagram your ideas and notes"
          tag=""
        />
      </TabsContent>
    </Tabs>
  );
}
