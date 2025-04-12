import React, { useRef, useState, useEffect } from 'react';
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wand2, Download, Save } from "lucide-react";
import { Tldraw, exportToBlob, exportToSvg, TldrawEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { saveCanvas, getSpaces } from "@/services/chat-service";

const CanvasPage = () => {
  const isMobile = useIsMobile();
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const tldrawRef = useRef<TldrawEditor | null>(null);

  // Function to capture and export the canvas content as base64
  const captureCanvasAsBase64 = async () => {
    if (!tldrawRef.current) {
      toast({
        title: "Canvas Not Ready",
        description: "The drawing canvas is not fully loaded. Please try again.",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      // Get the current editor instance from the ref
      const editor = tldrawRef.current;
      
      // Export Tldraw canvas to PNG blob
      const blob = await exportToBlob({
        editor,
        format: 'png',
        quality: 1,
        scale: 2, // Higher scale for better quality
      });
      
      // Convert blob to base64
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Result is the full data URL (e.g., "data:image/png;base64,...")
          const base64Image = reader.result as string;
          resolve(base64Image);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error capturing canvas:', error);
      toast({
        title: "Export Failed",
        description: "Could not export the canvas as an image. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  };

  // Function to save the canvas to backend
  const saveCanvasToBackend = async (canvasName = '') => {
    setIsSaving(true);
    
    try {
      // If no name provided, generate one
      const finalName = canvasName || `Canvas-${new Date().toISOString().substring(0, 19).replace(/[:.]/g, '-')}`;
      
      // Capture the canvas as base64
      const imageData = await captureCanvasAsBase64();
      
      if (!imageData) {
        throw new Error('Failed to capture canvas data');
      }
      
      // Save to backend
      await saveCanvas(finalName, imageData, undefined);
      
      toast({
        title: "Canvas Saved",
        description: `Your drawing has been saved as "${finalName}"`,
      });
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your drawing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to save the canvas image locally
  const downloadImage = async () => {
    try {
      const imageData = await captureCanvasAsBase64();
      
      if (!imageData) {
        throw new Error('Failed to capture canvas data');
      }
      
      // Create an anchor element for download
      const link = document.createElement('a');
      
      // Set the download attribute with a filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `canvas-${timestamp}.png`;
      
      // Set the href to the image data
      link.href = imageData;
      
      // Append to the body
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      
      toast({
        title: "Image Downloaded",
        description: "Your drawing has been saved to your downloads folder.",
      });
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const analyzeCanvas = async () => {
    setIsAnalyzing(true);
    setGeminiResponse('');
    
    try {
      // Capture the canvas as base64
      const imageData = await captureCanvasAsBase64();
      
      // Make sure the image data is valid
      if (!imageData) {
        throw new Error('Error capturing canvas');
      }

      // Auto-save the canvas in the backend before analysis
      const canvasName = `Drawing-${new Date().toISOString().substring(0, 19).replace(/[:.]/g, '-')}`;
      await saveCanvas(canvasName, imageData, undefined);
      
      // Send to the backend for analysis
      const response = await fetch('http://localhost:8000/canvas-analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          image_data: imageData,
          prompt: "Analyze this drawing and describe what you see in detail. If it appears to be a diagram, chart, or sketch, explain its meaning and purpose. If it contains text, include that in your analysis."
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Analysis result:', result);
      setGeminiResponse(result.analysis || 'No analysis available');
      
      toast({
        title: "Analysis Complete",
        description: "Your drawing has been analyzed and saved successfully.",
      });
    } catch (error) {
      console.error('Error analyzing canvas:', error);
      toast({
        title: "Analysis Failed",
        description: `Could not analyze drawing: ${error.message}`,
        variant: "destructive"
      });
      setGeminiResponse('Error analyzing drawing. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle the tldraw editor instance when it's loaded
  const handleMount = (editor: TldrawEditor) => {
    tldrawRef.current = editor;
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="max-w-4xl h-full rounded px-[19px] py-[12px] my-0 mx-0">
          <h1 className="text-2xl font-bold mb-4">Canvas</h1>

          {/* Tldraw Canvas Editor */}
          <div className="mb-6 border border-gray-300 rounded-md overflow-hidden" style={{ height: '65vh' }}>
            <Tldraw onMount={handleMount} />
          </div>

          {/* Controls */}
          <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={analyzeCanvas} 
                variant="default" 
                size="sm"
                disabled={isAnalyzing}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}
              </Button>
              
              {/* <Button
                onClick={() => saveCanvasToBackend()}
                variant="secondary"
                size="sm"
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Canvas'}
              </Button> */}
            </div>
            
            <Button
              onClick={downloadImage}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
          </div>

          {/* Display Gemini Analysis Result */}
          <div className="mt-6 p-4 border rounded-md bg-muted">
            <h3 className="font-semibold mb-2">AI Analysis:</h3>
            {isAnalyzing ? (
              <div className="text-muted-foreground">Analyzing your drawing...</div>
            ) : geminiResponse ? (
              <div className="whitespace-pre-wrap">{geminiResponse}</div>
            ) : (
              <div className="text-muted-foreground">Draw something on the canvas above and click "Analyze with Gemini" to get an AI interpretation.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CanvasPage;


// import React, { useRef, useState, useEffect } from 'react';
// import { Sidebar } from "@/components/sidebar";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { saveCanvas, getSpaces } from "@/services/chat-service";
// import { useToast } from "@/hooks/use-toast";
// import { Save } from "lucide-react";
// import { Tldraw } from '@tldraw/tldraw';
// import '@tldraw/tldraw/tldraw.css';


// const CanvasPage = () => {
//   const isMobile = useIsMobile();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [color, setColor] = useState('#000000');
//   const [size, setSize] = useState(5);
//   const [lastX, setLastX] = useState(0);
//   const [lastY, setLastY] = useState(0);
//   const [canvasName, setCanvasName] = useState('Untitled Canvas');
//   const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
//   const [spaces, setSpaces] = useState<Array<{
//     id: string;
//     name: string;
//   }>>([]);
//   const [saveDialogOpen, setSaveDialogOpen] = useState(false);
//   const { toast } = useToast();
  
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Set canvas size to match parent container
//     const resizeCanvas = () => {
//       const container = canvas.parentElement;
//       if (!container) return;
//       canvas.width = container.clientWidth;
//       canvas.height = container.clientHeight;

//       // Clear canvas and redraw
//       ctx.fillStyle = 'white';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     };
//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     // Load spaces for the dropdown
//     setSpaces(getSpaces().map(space => ({
//       id: space.id,
//       name: space.name
//     })));
//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//     };
//   }, []);
  
//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const rect = canvas.getBoundingClientRect();
//     let clientX, clientY;
//     if ('touches' in e) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }
//     setLastX(clientX - rect.left);
//     setLastY(clientY - rect.top);
//   };
  
//   const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     const rect = canvas.getBoundingClientRect();
//     let clientX, clientY;
//     if ('touches' in e) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//       e.preventDefault();
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }
//     const x = clientX - rect.left;
//     const y = clientY - rect.top;
//     ctx.strokeStyle = color;
//     ctx.lineJoin = 'round';
//     ctx.lineCap = 'round';
//     ctx.lineWidth = size;
//     ctx.beginPath();
//     ctx.moveTo(lastX, lastY);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//     setLastX(x);
//     setLastY(y);
//   };
  
//   const stopDrawing = () => {
//     setIsDrawing(false);
//   };
  
//   const handleSaveCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     try {
//       const imageData = canvas.toDataURL('image/png');
//       saveCanvas(canvasName, imageData, selectedSpaceId || undefined);
//       toast({
//         title: "Canvas Saved",
//         description: `"${canvasName}" has been saved successfully.`
//       });
//       setSaveDialogOpen(false);
//     } catch (error) {
//       console.error('Error saving canvas:', error);
//       toast({
//         title: "Error",
//         description: "Failed to save canvas. Please try again.",
//         variant: "destructive"
//       });
//     }
//   };
  
//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };

//   return <div className="flex min-h-screen bg-background">
//       <Sidebar />
//       <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
//         <div className="max-w-4xl h-full rounded px-[19px] py-[12px] my-0 mx-0">
//           <h1 className="text-2xl font-bold mb-4">Canvas</h1>
          
//           <div className="mb-4 flex flex-wrap gap-2 items-center">
//             <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 border rounded" />
//             <input type="range" min="1" max="20" value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-32" />
//             <Button onClick={clearCanvas} variant="secondary" size="sm">
//               Clear
//             </Button>
            
//             <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button className="ml-auto" size="sm">
//                   <Save className="mr-2 h-4 w-4" /> Save Canvas
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Save Canvas</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="name" className="text-right">
//                       Name
//                     </label>
//                     <Input id="name" value={canvasName} onChange={e => setCanvasName(e.target.value)} className="col-span-3" />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="space" className="text-right">
//                       Space (Optional)
//                     </label>
//                     <Select value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
//                       <SelectTrigger className="col-span-3">
//                         <SelectValue placeholder="Select a space" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="">None</SelectItem>
//                         {spaces.map(space => <SelectItem key={space.id} value={space.id}>
//                             {space.name}
//                           </SelectItem>)}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button onClick={handleSaveCanvas}>Save</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>
          
//           <div className="border rounded-md bg-white w-full h-[60vh] overflow-hidden touch-none">
//             <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-full cursor-crosshair" />
//           </div>
//         </div>
//       </main>
//     </div>;
// };

// export default CanvasPage;






// import React, { useRef, useState, useEffect } from 'react';
// import { Sidebar } from "@/components/sidebar";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { saveCanvas, getSpaces } from "@/services/chat-service";
// import { useToast } from "@/hooks/use-toast";
// import { Save } from "lucide-react";
// const CanvasPage = () => {
//   const isMobile = useIsMobile();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [color, setColor] = useState('#000000');
//   const [size, setSize] = useState(5);
//   const [lastX, setLastX] = useState(0);
//   const [lastY, setLastY] = useState(0);
//   const [canvasName, setCanvasName] = useState('Untitled Canvas');
//   const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
//   const [spaces, setSpaces] = useState<Array<{
//     id: string;
//     name: string;
//   }>>([]);
//   const [saveDialogOpen, setSaveDialogOpen] = useState(false);
//   const {
//     toast
//   } = useToast();
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Set canvas size to match parent container
//     const resizeCanvas = () => {
//       const container = canvas.parentElement;
//       if (!container) return;
//       canvas.width = container.clientWidth;
//       canvas.height = container.clientHeight;

//       // Clear canvas and redraw
//       ctx.fillStyle = 'white';
//       ctx.fillRect(0, 0, canvas.width, canvas.height);
//     };
//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     // Load spaces for the dropdown
//     setSpaces(getSpaces().map(space => ({
//       id: space.id,
//       name: space.name
//     })));
//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//     };
//   }, []);
//   const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
//     setIsDrawing(true);
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const rect = canvas.getBoundingClientRect();
//     let clientX, clientY;
//     if ('touches' in e) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }
//     setLastX(clientX - rect.left);
//     setLastY(clientY - rect.top);
//   };
//   const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
//     if (!isDrawing) return;
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     const rect = canvas.getBoundingClientRect();
//     let clientX, clientY;
//     if ('touches' in e) {
//       clientX = e.touches[0].clientX;
//       clientY = e.touches[0].clientY;
//       e.preventDefault();
//     } else {
//       clientX = e.clientX;
//       clientY = e.clientY;
//     }
//     const x = clientX - rect.left;
//     const y = clientY - rect.top;
//     ctx.strokeStyle = color;
//     ctx.lineJoin = 'round';
//     ctx.lineCap = 'round';
//     ctx.lineWidth = size;
//     ctx.beginPath();
//     ctx.moveTo(lastX, lastY);
//     ctx.lineTo(x, y);
//     ctx.stroke();
//     setLastX(x);
//     setLastY(y);
//   };
//   const stopDrawing = () => {
//     setIsLoading(false);
//   };
//   const handleSaveCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     try {
//       const imageData = canvas.toDataURL('image/png');
//       saveCanvas(canvasName, imageData, selectedSpaceId || undefined);
//       toast({
//         title: "Canvas Saved",
//         description: `"${canvasName}" has been saved successfully.`
//       });
//       setSaveDialogOpen(false);
//     } catch (error) {
//       console.error('Error saving canvas:', error);
//       toast({
//         title: "Error",
//         description: "Failed to save canvas. Please try again.",
//         variant: "destructive"
//       });
//     }
//   };
//   const clearCanvas = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;
//     ctx.fillStyle = 'white';
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
//   };
//   return <div className="flex min-h-screen bg-background">
//       <Sidebar />
//       <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
//         <div className="max-w-4xl h-full rounded px-[19px] py-[12px] my-0 mx-0">
//           <h1 className="text-2xl font-bold mb-4">Canvas</h1>
          
//           <div className="mb-4 flex flex-wrap gap-2 items-center">
//             <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 border rounded" />
//             <input type="range" min="1" max="20" value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-32" />
//             <Button onClick={clearCanvas} variant="secondary" size="sm">
//               Clear
//             </Button>
            
//             <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
//               <DialogTrigger asChild>
//                 <Button className="ml-auto" size="sm">
//                   <Save className="mr-2 h-4 w-4" /> Save Canvas
//                 </Button>
//               </DialogTrigger>
//               <DialogContent>
//                 <DialogHeader>
//                   <DialogTitle>Save Canvas</DialogTitle>
//                 </DialogHeader>
//                 <div className="grid gap-4 py-4">
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="name" className="text-right">
//                       Name
//                     </label>
//                     <Input id="name" value={canvasName} onChange={e => setCanvasName(e.target.value)} className="col-span-3" />
//                   </div>
//                   <div className="grid grid-cols-4 items-center gap-4">
//                     <label htmlFor="space" className="text-right">
//                       Space (Optional)
//                     </label>
//                     <Select value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
//                       <SelectTrigger className="col-span-3">
//                         <SelectValue placeholder="Select a space" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="">None</SelectItem>
//                         {spaces.map(space => <SelectItem key={space.id} value={space.id}>
//                             {space.name}
//                           </SelectItem>)}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>
//                 <DialogFooter>
//                   <Button onClick={handleSaveCanvas}>Save</Button>
//                 </DialogFooter>
//               </DialogContent>
//             </Dialog>
//           </div>
          
//           <div className="border rounded-md bg-white w-full h-[60vh] overflow-hidden touch-none">
//             <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} className="w-full h-full cursor-crosshair" />
//           </div>
//         </div>
//       </main>
//     </div>;
// };
// export default CanvasPage;