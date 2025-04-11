
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ThemeToggle } from './theme-toggle';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Adjust your application preferences and settings.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium">Dark Mode</span>
            <ThemeToggle />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Notifications</span>
              <div className="flex items-center h-5">
                <input
                  id="notifications"
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Email Updates</span>
              <div className="flex items-center h-5">
                <input
                  id="email-updates"
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
