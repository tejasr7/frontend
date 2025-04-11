import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveJournal, getJournals, deleteJournal, getJournal } from "@/services/chat-service";
import type { Journal } from "@/services/chat-service";
import { Save, X, Edit, Trash2, Clock, Bold, Italic, Underline, List, Download } from "lucide-react";
import html2pdf from 'html2pdf.js';

const JournalsPage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [title, setTitle] = useState('Untitled Entry');
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const { toast } = useToast();

  const loadJournals = React.useCallback(() => {
    const loadedJournals = getJournals();
    setJournals(loadedJournals);
  }, []);
  
  // Add handleSaveJournal to useCallback
  const handleSaveJournal = React.useCallback((showToast = true) => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Journal title cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const savedJournal = saveJournal(title, content, editingJournal?.id);
      setLastSaved(savedJournal.updatedAt);
      setEditingJournal(savedJournal);
      
      // Force a refresh of the journals list
      const loadedJournals = getJournals();
      setJournals(loadedJournals);
      
      if (showToast) {
        toast({
          title: "Success",
          description: editingJournal ? "Journal updated successfully." : "New journal created successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: "Error",
        description: "Failed to save journal. Please try again.",
        variant: "destructive",
      });
    }
  }, [title, content, editingJournal, toast]);
  
  // Load journals on mount
  useEffect(() => {
    loadJournals();
    
    const { activeJournalId, createNew, newTitle } = location.state || {};
    
    if (activeJournalId) {
      const journal = getJournal(activeJournalId);
      if (journal) {
        handleEditJournal(journal);
      }
    } else if (createNew && newTitle) {
      setTitle(newTitle);
      setContent('');
      setEditingJournal(null);
      setLastSaved(null);
    }
  }, [location.state, loadJournals]);
  
  // Auto-save effect
  useEffect(() => {
    if (!content || !editingJournal) return;
    
    const saveTimeout = setTimeout(() => {
      if (content.trim().length > 0 && editingJournal) {
        handleSaveJournal(false);
      }
    }, 2000);
    
    return () => clearTimeout(saveTimeout);
  }, [content, editingJournal, handleSaveJournal]);
  
  const handleEditJournal = (journal: Journal) => {
    setTitle(journal.title);
    setContent(journal.content);
    setEditingJournal(journal);
    setLastSaved(journal.updatedAt);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleDeleteJournal = (id: string) => {
    if (window.confirm("Are you sure you want to delete this journal?")) {
      try {
        const success = deleteJournal(id);
        if (success) {
          // Clear the form if we're editing the journal that was just deleted
          if (editingJournal && editingJournal.id === id) {
            handleNewJournal();
          }
          
          // Reload the journals list
          loadJournals();
          
          toast({
            title: "Success",
            description: "Journal deleted successfully.",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to delete journal. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error deleting journal:', error);
        toast({
          title: "Error",
          description: "Failed to delete journal. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleNewJournal = () => {
    setTitle('Untitled Entry');
    setContent('');
    setEditingJournal(null);
    setLastSaved(null);
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false, undefined);
  };

  const handleExportPDF = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please add a title before exporting to PDF.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a temporary div for PDF content
      const element = document.createElement('div');
      element.innerHTML = `
        <div style="color: #000000;">
          <h1 style="font-size: 24px; margin-bottom: 16px; color: #000000;">${title}</h1>
          <div style="font-size: 14px; color: #666666; margin-bottom: 24px;">
            ${new Date().toLocaleString()}
          </div>
          <div style="line-height: 1.6; color: #000000;">
            ${content}
          </div>
        </div>
      `;

      const opt = {
        margin: 1,
        filename: `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      // Generate PDF
      html2pdf().set(opt).from(element).save().then(() => {
        toast({
          title: "Success",
          description: "Journal exported to PDF successfully.",
        });
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        title: "Error",
        description: "Failed to export journal to PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="mx-auto max-w-4xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {editingJournal ? 'Edit Journal' : 'New Journal'}
            </h1>
            {editingJournal && (
              <Button variant="ghost" onClick={handleNewJournal}>
                <X className="mr-2 h-4 w-4" /> Cancel Editing
              </Button>
            )}
          </div>
          
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Journal Title"
              className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-primary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div className="mb-2 text-sm text-gray-500 flex items-center">
            {lastSaved ? (
              <>
                <Clock className="h-3 w-3 mr-1" /> Last saved: {lastSaved.toLocaleString()}
              </>
            ) : (
              'Not saved yet'
            )}
          </div>
          
          <div className="border rounded-md overflow-hidden mb-6">
            <div className="bg-muted p-2 border-b flex flex-wrap gap-2">
              <button 
                className="p-1 hover:bg-background rounded"
                onClick={() => handleFormat('bold')}
                onMouseDown={(e) => e.preventDefault()}
                title="Bold"
                aria-label="Bold text"
              >
                <Bold size={16} />
              </button>
              <button 
                className="p-1 hover:bg-background rounded"
                onClick={() => handleFormat('italic')}
                onMouseDown={(e) => e.preventDefault()}
                title="Italic"
                aria-label="Italic text"
              >
                <Italic size={16} />
              </button>
              <button 
                className="p-1 hover:bg-background rounded"
                onClick={() => handleFormat('underline')}
                onMouseDown={(e) => e.preventDefault()}
                title="Underline"
                aria-label="Underline text"
              >
                <Underline size={16} />
              </button>
              <button 
                className="p-1 hover:bg-background rounded"
                onClick={() => handleFormat('insertUnorderedList')}
                onMouseDown={(e) => e.preventDefault()}
                title="Bullet List"
                aria-label="Insert bullet list"
              >
                <List size={16} />
              </button>
            </div>
            
            <div
              contentEditable
              className="min-h-[40vh] p-4 outline-none prose prose-sm dark:prose-invert prose-ul:pl-6 prose-ul:mt-2 prose-ul:mb-2 prose-li:my-1 prose-li:marker:text-current max-w-none block"
              onInput={(e) => setContent(e.currentTarget.innerHTML)}
              dangerouslySetInnerHTML={{ __html: content }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && window.getSelection()?.anchorNode?.parentElement?.tagName === 'LI') {
                  e.preventDefault();
                  document.execCommand('insertHTML', false, '<li>&nbsp;</li>');
                }
              }}
            />
          </div>
          
          <div className="flex justify-end gap-2 mb-8">
            <Button variant="outline" onClick={handleExportPDF}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button onClick={() => handleSaveJournal(true)}>
              <Save className="mr-2 h-4 w-4" />
              {editingJournal ? 'Update Journal' : 'Save Journal'}
            </Button>
          </div>
          
          <h2 className="text-xl font-semibold mb-4">Saved Journals</h2>
          
          {journals.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/20">
              <p>No saved journals yet.</p>
            </div>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {journals.map((journal) => (
                <Card key={journal.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{journal.title}</CardTitle>
                    <CardDescription>
                      {new Date(journal.updatedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div 
                      className="line-clamp-3 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{ __html: journal.content }}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEditJournal(journal)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteJournal(journal.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default JournalsPage;
