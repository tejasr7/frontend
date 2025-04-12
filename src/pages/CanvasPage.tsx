import React, { useRef, useState, useEffect } from 'react';
import { Sidebar } from "@/components/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveCanvas, getSpaces } from "@/services/chat-service";
import { useToast } from "@/hooks/use-toast";
import { Save, Wand2 } from "lucide-react";
import { Tldraw, exportToBlob } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';

const CanvasPage = () => {
  const isMobile = useIsMobile();
  const [canvasName, setCanvasName] = useState('Untitled Canvas');
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>('');
  const [spaces, setSpaces] = useState<Array<{ id: string; name: string }>>([]);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();
  const tldrawRef = useRef<any>(null);

  useEffect(() => {
    // Fetch available spaces
    setSpaces(getSpaces().map(space => ({ id: space.id, name: space.name })));
  }, []);

  const handleSaveCanvas = async () => {
    try {
      if (!tldrawRef.current) return;
      
      const blob = await exportToBlob({
        editor: tldrawRef.current.editor,
        format: 'png',
        quality: 1,
      });
      
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const imageData = reader.result as string;
        saveCanvas(canvasName, imageData, selectedSpaceId || undefined);
        toast({
          title: "Canvas Saved",
          description: `"${canvasName}" has been saved successfully.`,
        });
        setSaveDialogOpen(false);
      };
    } catch (error) {
      console.error('Error saving canvas:', error);
      toast({
        title: "Error",
        description: "Failed to save canvas. Please try again.",
        variant: "destructive"
      });
    }
  };

  const analyzeWithGemini = async () => {
    if (!tldrawRef.current) return;
    
    setIsAnalyzing(true);
    setGeminiResponse('');
    
    try {
      // Export Tldraw canvas to image blob
      const blob = await exportToBlob({
        editor: tldrawRef.current.editor,
        format: 'png',
        quality: 1,
      });
      
      // Convert blob to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
      });
      
      // Extract just the base64 part (remove the data URL prefix)
      const base64Data = base64Image.split(',')[1];
      
      // Call your backend API which will communicate with Gemini
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: 'image/png'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      const data = await response.json();
      setGeminiResponse(data.text || 'No description available');
    } catch (error) {
      console.error('Error analyzing drawing:', error);
      toast({
        title: "Error",
        description: "Failed to analyze drawing. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="max-w-4xl h-full rounded px-[19px] py-[12px] my-0 mx-0">
          <h1 className="text-2xl font-bold mb-4">Canvas</h1>

          {/* Tldraw Canvas Editor */}
          <div className="mb-6 border border-gray-300 rounded-md overflow-hidden" style={{ height: '65vh' }}>
            <Tldraw ref={tldrawRef} />
          </div>

          {/* Controls */}
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <Button 
              onClick={analyzeWithGemini} 
              variant="outline" 
              size="sm"
              disabled={isAnalyzing}
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze with Gemini'}
            </Button>

            {/* <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto" size="sm">
                  <Save className="mr-2 h-4 w-4" /> Save Canvas
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Canvas</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">Name</label>
                    <Input id="name" value={canvasName} onChange={e => setCanvasName(e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="space" className="text-right">Space (Optional)</label>
                    <Select value={selectedSpaceId} onValueChange={setSelectedSpaceId}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select a space" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {spaces.map(space => (
                          <SelectItem key={space.id} value={space.id}>{space.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveCanvas}>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
          </div>

          {/* Display Gemini Analysis Result */}
          <div className="mt-6 p-4 border rounded-md bg-muted">
            <h3 className="font-semibold mb-2">AI Analysis:</h3>
            {isAnalyzing ? (
              <div className="text-muted-foreground">Analyzing your drawing...</div>
            ) : geminiResponse ? (
              <div className="whitespace-pre-wrap">{geminiResponse}</div>
            ) : (
              <div className="text-muted-foreground">Draw something and click "Analyze with Gemini"</div>
            )}
          </div>

          {analysisResults.length > 0 && (
            <div className="mt-4 p-4 border rounded-md bg-blue-50 shadow-sm">
              <h3 className="font-medium mb-2 text-blue-800">Solution</h3>
              <ul className="space-y-2">
                {analysisResults.map((result, i) => (
                  <li 
                    key={i} 
                    className={`p-2 rounded ${i === analysisResults.length - 1 
                      ? 'bg-blue-100 font-bold text-blue-900' 
                      : 'text-gray-800'}`}
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
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