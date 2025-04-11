import React, { useRef, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveJournal, getJournals, deleteJournal, getJournal } from "@/services/chat-service";
import type { Journal } from "@/services/chat-service";
import { Save, X, Edit, Trash2, Clock, Bold, Italic, Underline, List, Download } from "lucide-react";
import html2pdf from 'html2pdf.js';
import { Button } from "@/components/ui/button";

const JournalsPage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [title, setTitle] = useState('Untitled Entry');
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const { toast } = useToast();

  // AI suggestion state
  const [userInput, setUserInput] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load journals on mount
  const loadJournals = React.useCallback(() => {
    const loadedJournals = getJournals();
    setJournals(loadedJournals);
  }, []);

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

  // Fixed generate suggestion function with proper API response handling
  const generateSuggestion = async (prompt: string): Promise<string> => {
    try {
      setIsLoading(true);
      
      const response = await fetch("http://localhost:8000/api/generate-journal", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      // Use data.result instead of data.suggestion to match FastAPI response
      return data?.result || "";
    } catch (error) {
      console.error("Error generating suggestion:", error);
      return "";
    } finally {
      setIsLoading(false);
    }
  };


  // Debounce effect for AI suggestions
    useEffect(() => {
      // Only check for minimum length, but allow spaces
      if (!userInput || userInput.length < 3) {
        setSuggestion('');
        return;
      }

      // Use the last few words or characters for better suggestions
      let promptText = userInput;
      
      // Optional: If you want to use just the last portion of text for better context
      // This uses either the last sentence or the last 30 characters, whichever is shorter
      const lastSentenceMatch = userInput.match(/[^.!?]*$/);
      if (lastSentenceMatch && lastSentenceMatch[0].trim().length > 0) {
        promptText = lastSentenceMatch[0];
      } else {
        // Fallback to last 30 characters if no sentence pattern is found
        promptText = userInput.slice(-30);
      }
      
      console.log("Setting up suggestion for:", promptText);
      
      const debounceTimer = setTimeout(async () => {
        try {
          const newSuggestion = await generateSuggestion(promptText);
          console.log("API returned suggestion:", newSuggestion);
          setSuggestion(newSuggestion);
        } catch (error) {
          console.error('Error generating suggestion:', error);
          setSuggestion('');
        }
      }, 500);

      return () => clearTimeout(debounceTimer);
    }, [userInput]);

  // Debounce effect for AI suggestions
  // useEffect(() => {
  //   // Don't generate suggestions in these cases
  //   if (!userInput || userInput.length < 3 || userInput.endsWith(' ')) {
  //     setSuggestion('');
  //     return;
  //   }
  
  //   // Use the last sentence or fragment for better suggestions
  //   const lastSentenceMatch = userInput.match(/[^.!?]*$/);
  //   const promptText = lastSentenceMatch ? lastSentenceMatch[0].trim() : userInput;
    
  //   // Don't generate if prompt is too short
  //   if (promptText.length < 3) {
  //     setSuggestion('');
  //     return;
  //   }
  
  //   const debounceTimer = setTimeout(async () => {
  //     try {
  //       const newSuggestion = await generateSuggestion(promptText);
  //       console.log("New suggestion:", newSuggestion);
  //       setSuggestion(newSuggestion);
  //     } catch (error) {
  //       console.error('Error generating suggestion:', error);
  //       setSuggestion('');
  //     }
  //   }, 500);
  
  //   return () => clearTimeout(debounceTimer);
  // }, [userInput]);

  // Handle Tab key to accept suggestion
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault();
      
      const newContent = userInput + suggestion;
      setUserInput(newContent);
      setContent(newContent); // Keep content in sync
      setSuggestion('');
      
      // Move cursor to end of text
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = newContent.length;
          textareaRef.current.selectionEnd = newContent.length;
          textareaRef.current.focus();
        }
      }, 0);
    }
  };

  // Handle textarea input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setContent(value); // Keep content in sync
  };

  // Save journal logic
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
      loadJournals();
      
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
  }, [title, content, editingJournal, toast, loadJournals]);
  
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
    setUserInput(journal.content); // Set userInput to keep in sync
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
    setUserInput(''); // Reset user input
    setSuggestion(''); // Clear suggestion
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

            <div className="relative">
              {/* Main textarea for user input */}
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full min-h-[40vh] p-4 resize-y font-sans"
                placeholder="Start writing your journal..."
                spellCheck={true}
              />
              
              {/* Suggestion overlay */}
              {suggestion && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="p-4 whitespace-pre-wrap">
                    <span className="opacity-0">{userInput}</span>
                    <span className="text-gray-400 italic">{suggestion}</span>
                  </div>
                </div>
              )}

              {/* Tab hint and loading spinner */}
              <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                {suggestion && (
                  <>
                    Press <kbd className="px-1 border rounded">Tab</kbd> to accept suggestion
                  </>
                )}
                {isLoading && (
                  <svg
                    className="animate-spin h-4 w-4 ml-2 text-gray-400"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                )}
              </div>
            </div>
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