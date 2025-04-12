
import React from 'react';

interface ToolCardProps {
  icon: 'graph' | 'video' | 'whiteboard';
  title: string;
  description: string;
  tag: string;
}

export function ToolCard({ icon, title, description, tag }: ToolCardProps) {
  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
          {icon === 'graph' && (
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 16.5L7 12.5L11 16.5L21 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 6.5H21V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {icon === 'video' && (
            <svg className="w-6 h-6 text-amber-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M22 8L18 12L22 16V8Z" fill="currentColor" />
            </svg>
          )}
          {icon === 'whiteboard' && (
            <svg className="w-6 h-6 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M9 3L6 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 3L18 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <p className="font-medium">{description}</p>
        </div>
        
      </div>
    </div>
  );
}
