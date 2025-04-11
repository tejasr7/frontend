
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { saveJournal, getJournals, deleteJournal, getJournal } from "@/services/chat-service";
import type { Journal } from "@/services/chat-service";
import { Save, X, Edit, Trash2, Clock } from "lucide-react";

const JournalsPage = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [title, setTitle] = useState('Untitled Entry');
  const [content, setContent] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [journals, setJournals] = useState<Journal[]>([]);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const { toast } = useToast();
  
  // Load journals on mount
  useEffect(() => {
    loadJournals();
    
    // Handle navigation state
    const { activeJournalId, createNew } = location.state || {};
    
    if (activeJournalId) {
      const journal = getJournal(activeJournalId);
      if (journal) {
        handleEditJournal(journal);
      }
    } else if (createNew) {
      handleNewJournal();
    }
  }, [location.state]);
  
  const loadJournals = () => {
    const loadedJournals = getJournals();
    setJournals(loadedJournals);
  };
  
  // Auto-save effect
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      if (content && content.trim().length > 0 && editingJournal) {
        handleSaveJournal(false);
      }
    }, 2000);
    
    return () => clearTimeout(saveTimeout);
  }, [content, editingJournal]);
  
  const handleSaveJournal = (showToast = true) => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Journal title cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const savedJournal = saveJournal(title, content);
      setLastSaved(savedJournal.updatedAt);
      setEditingJournal(savedJournal);
      
      if (showToast) {
        toast({
          title: "Journal Saved",
          description: "Your journal entry has been saved successfully.",
        });
      }
      
      // Reload journals
      loadJournals();
    } catch (error) {
      console.error('Error saving journal:', error);
      toast({
        title: "Error",
        description: "Failed to save journal. Please try again.",
        variant: "destructive",
      });
    }
  };
  
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
        deleteJournal(id);
        loadJournals();
        
        // If we're editing this journal, clear the form
        if (editingJournal && editingJournal.id === id) {
          handleNewJournal();
        }
        
        toast({
          title: "Journal Deleted",
          description: "Your journal entry has been deleted.",
        });
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
              <button className="p-1 hover:bg-background rounded">
                <strong>B</strong>
              </button>
              <button className="p-1 hover:bg-background rounded">
                <i>I</i>
              </button>
              <button className="p-1 hover:bg-background rounded">
                <u>U</u>
              </button>
              <button className="p-1 hover:bg-background rounded">
                H1
              </button>
              <button className="p-1 hover:bg-background rounded">
                H2
              </button>
              <button className="p-1 hover:bg-background rounded">
                • List
              </button>
              <button className="p-1 hover:bg-background rounded">
                1. List
              </button>
            </div>
            
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your thoughts..."
              className="min-h-[40vh] p-4 border-0 focus-visible:ring-0"
            />
          </div>
          
          <div className="flex justify-end mb-8">
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
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {journal.content}
                    </p>
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
// import React, { useState, useEffect } from 'react';
// import { Sidebar } from "@/components/sidebar";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/hooks/use-toast";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Journal, saveJournal, getJournals, deleteJournal } from "@/services/chat-service";
// import { Save, X, Edit, Trash2, Clock } from "lucide-react";

// const JournalsPage = () => {
//   const isMobile = useIsMobile();
//   const [title, setTitle] = useState('Untitled Entry');
//   const [content, setContent] = useState('');
//   const [lastSaved, setLastSaved] = useState<Date | null>(null);
//   const [journals, setJournals] = useState<Journal[]>([]);
//   const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
//   const { toast } = useToast();
  
//   // Load journals on mount
//   useEffect(() => {
//     loadJournals();
//   }, []);
  
//   const loadJournals = () => {
//     const loadedJournals = getJournals();
//     setJournals(loadedJournals);
//   };
  
//   // Auto-save effect
//   useEffect(() => {
//     const saveTimeout = setTimeout(() => {
//       if (content && content.trim().length > 0 && editingJournal) {
//         handleSaveJournal();
//       }
//     }, 2000);
    
//     return () => clearTimeout(saveTimeout);
//   }, [content, editingJournal]);
  
//   const handleSaveJournal = () => {
//     if (!title.trim()) {
//       toast({
//         title: "Error",
//         description: "Journal title cannot be empty.",
//         variant: "destructive",
//       });
//       return;
//     }
    
//     try {
//       const savedJournal = saveJournal(title, content);
//       setLastSaved(savedJournal.updatedAt);
      
//       // If we're not currently editing a journal, reset the form
//       if (!editingJournal) {
//         toast({
//           title: "Journal Saved",
//           description: "Your journal entry has been saved successfully.",
//         });
//       }
      
//       // Reload journals
//       loadJournals();
//     } catch (error) {
//       console.error('Error saving journal:', error);
//       toast({
//         title: "Error",
//         description: "Failed to save journal. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };
  
//   const handleEditJournal = (journal: Journal) => {
//     setTitle(journal.title);
//     setContent(journal.content);
//     setEditingJournal(journal);
//     setLastSaved(journal.updatedAt);
    
//     // Scroll to top
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };
  
//   const handleDeleteJournal = (id: string) => {
//     if (window.confirm("Are you sure you want to delete this journal?")) {
//       try {
//         deleteJournal(id);
//         loadJournals();
        
//         // If we're editing this journal, clear the form
//         if (editingJournal && editingJournal.id === id) {
//           handleNewJournal();
//         }
        
//         toast({
//           title: "Journal Deleted",
//           description: "Your journal entry has been deleted.",
//         });
//       } catch (error) {
//         console.error('Error deleting journal:', error);
//         toast({
//           title: "Error",
//           description: "Failed to delete journal. Please try again.",
//           variant: "destructive",
//         });
//       }
//     }
//   };
  
//   const handleNewJournal = () => {
//     setTitle('Untitled Entry');
//     setContent('');
//     setEditingJournal(null);
//     setLastSaved(null);
//   };

//   return (
//     <div className="flex min-h-screen bg-background">
//       <Sidebar />
//       <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
//         <div className="mx-auto max-w-4xl">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-2xl font-bold">
//               {editingJournal ? 'Edit Journal' : 'New Journal'}
//             </h1>
//             {editingJournal && (
//               <Button variant="ghost" onClick={handleNewJournal}>
//                 <X className="mr-2 h-4 w-4" /> Cancel Editing
//               </Button>
//             )}
//           </div>
          
//           <div className="mb-4">
//             <Input
//               type="text"
//               placeholder="Journal Title"
//               className="w-full px-4 py-2 text-xl font-semibold border-b border-gray-200 focus:outline-none focus:border-primary"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </div>
          
//           <div className="mb-2 text-sm text-gray-500 flex items-center">
//             {lastSaved ? (
//               <>
//                 <Clock className="h-3 w-3 mr-1" /> Last saved: {lastSaved.toLocaleString()}
//               </>
//             ) : (
//               'Not saved yet'
//             )}
//           </div>
          
//           <div className="border rounded-md overflow-hidden mb-6">
//             <div className="bg-muted p-2 border-b flex flex-wrap gap-2">
//               <button className="p-1 hover:bg-background rounded">
//                 <strong>B</strong>
//               </button>
//               <button className="p-1 hover:bg-background rounded">
//                 <i>I</i>
//               </button>
//               <button className="p-1 hover:bg-background rounded">
//                 <u>U</u>
//               </button>
//               <button className="p-1 hover:bg-background rounded">
//                 H1
//               </button>
//               <button className="p-1 hover:bg-background rounded">
//                 H2
//               </button>
//               <button className="p-1 hover:bg-background rounded">
//                 • List
//               </button>
//               <button className="p-1 hover:bg-background rounded">
//                 1. List
//               </button>
//             </div>
            
//             <Textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Start writing your thoughts..."
//               className="min-h-[40vh] p-4 border-0 focus-visible:ring-0"
//             />
//           </div>
          
//           <div className="flex justify-end mb-8">
//             <Button onClick={handleSaveJournal}>
//               <Save className="mr-2 h-4 w-4" />
//               {editingJournal ? 'Update Journal' : 'Save Journal'}
//             </Button>
//           </div>
          
//           <h2 className="text-xl font-semibold mb-4">Saved Journals</h2>
          
//           {journals.length === 0 ? (
//             <div className="text-center p-8 border rounded-md bg-muted/20">
//               <p>No saved journals yet.</p>
//             </div>
//           ) : (
//             <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
//               {journals.map((journal) => (
//                 <Card key={journal.id} className="overflow-hidden">
//                   <CardHeader className="pb-2">
//                     <CardTitle>{journal.title}</CardTitle>
//                     <CardDescription>
//                       {new Date(journal.updatedAt).toLocaleDateString()}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="pb-2">
//                     <p className="line-clamp-3 text-sm text-muted-foreground">
//                       {journal.content}
//                     </p>
//                   </CardContent>
//                   <CardFooter className="flex justify-between">
//                     <Button variant="outline" size="sm" onClick={() => handleEditJournal(journal)}>
//                       <Edit className="mr-2 h-4 w-4" /> Edit
//                     </Button>
//                     <Button variant="destructive" size="sm" onClick={() => handleDeleteJournal(journal.id)}>
//                       <Trash2 className="mr-2 h-4 w-4" /> Delete
//                     </Button>
//                   </CardFooter>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default JournalsPage;
