
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Help Center</DialogTitle>
          <DialogDescription>
            Find answers to your questions and learn how to use our app.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Getting Started</h4>
              <p className="text-sm text-muted-foreground">
                Learn the basics of using our application with our quick start guide.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Using the Canvas</h4>
              <p className="text-sm text-muted-foreground">
                Get tips on how to use our canvas tool for concept mapping.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Journal Features</h4>
              <p className="text-sm text-muted-foreground">
                Discover all the features available in the journal editor.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-1">Contact Support</h4>
              <p className="text-sm text-muted-foreground">
                Need more help? Reach out to our support team.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
