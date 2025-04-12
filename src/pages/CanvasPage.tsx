import React, { useRef, useState, useEffect } from 'react';
import { Sidebar } from '../components/sidebar';
import { useIsMobile } from '../hooks/use-mobile';
import { Button } from '../components/ui/button';
import { analyzeDrawingWithAI } from '../services/ai-service';

const CanvasPage = () => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(5);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);
  const [analysisResults, setAnalysisResults] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (!container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    setLastX(e.clientX - rect.left);
    setLastY(e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = color;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    setLastX(x);
    setLastY(y);
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setAnalysisResults([]);
  };

  const analyzeDrawing = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsAnalyzing(true);
    setAnalysisResults([]);
    try {
      const imageData = canvas.toDataURL('image/png');
      const results = await analyzeDrawingWithAI(imageData);
      setAnalysisResults(results);
    } catch (error) {
      setAnalysisResults(['Error analyzing drawing. Please try again.']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="max-w-4xl h-full rounded px-[19px] py-[12px] my-0 mx-0">
          <h1 className="text-2xl font-bold mb-4">Math Problem Solver</h1>
          
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-2">
              <label>Pen:</label>
              <input 
                type="color" 
                value={color} 
                onChange={e => setColor(e.target.value)} 
                className="w-8 h-8 border rounded cursor-pointer" 
              />
              <input 
                type="range" 
                min="1" 
                max="20" 
                value={size} 
                onChange={e => setSize(Number(e.target.value))} 
                className="w-24 cursor-pointer" 
              />
            </div>
            
            <Button 
              onClick={clearCanvas} 
              variant="outline" 
              size="sm"
            >
              Clear
            </Button>

            <Button 
              onClick={analyzeDrawing}
              variant="default"
              size="sm"
              disabled={isAnalyzing}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
          
          <div className="border rounded-md bg-white w-full h-[60vh] overflow-hidden touch-none shadow-sm">
            <canvas 
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              className="w-full h-full cursor-crosshair bg-white"
            />
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
};

export default CanvasPage;
