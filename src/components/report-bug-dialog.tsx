
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReportBugDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ReportBugDialog({ open, onClose }: ReportBugDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report a Bug</DialogTitle>
          <DialogDescription>
            Help us improve by reporting any issues you encounter.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <form>
            <div className="space-y-4">
              <div>
                <label htmlFor="bug-type" className="block text-sm font-medium mb-1">
                  Bug Type
                </label>
                <select
                  id="bug-type"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option>UI Issue</option>
                  <option>Performance Problem</option>
                  <option>Feature Not Working</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="bug-description" className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Textarea
                  id="bug-description"
                  placeholder="Please describe the issue in detail..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Reproduction Steps
                </label>
                <Textarea
                  placeholder="Steps to reproduce the issue..."
                  className="min-h-[80px]"
                />
              </div>
              <Button type="submit" className="w-full">Submit Report</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
