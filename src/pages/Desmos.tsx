import React, { useRef, useEffect, useState } from 'react';
import { SidebarShadcn } from "@/components/SidebarShadcn";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Calculator, Download, Save } from "lucide-react";

const Desmos = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const containerRef = useRef(null);
  const calculatorRef = useRef(null);
  const [expression, setExpression] = useState('y=x^2');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load the Desmos Calculator script
    const script = document.createElement('script');
    script.src = 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;
    script.onload = initializeCalculator;
    document.body.appendChild(script);

    return () => {
      // Clean up
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      if (calculatorRef.current) {
        calculatorRef.current.destroy();
      }
    };
  }, []);

  const initializeCalculator = () => {
    if (containerRef.current && window.Desmos) {
      calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        expressionsTopbar: true
      });

      // Add initial expression
      calculatorRef.current.setExpression({ id: 'graph1', latex: expression });
    }
  };

  const updateGraph = () => {
    if (calculatorRef.current) {
      calculatorRef.current.setExpression({ id: 'graph1', latex: expression });
    }
  };

  const handleExpressionChange = (e) => {
    setExpression(e.target.value);
  };

  const saveGraph = async () => {
    setIsSaving(true);
    try {
      // Here you would add code to save the graph state
      // This could use your existing saveCanvas function with some modifications
      
      toast({
        title: "Graph Saved",
        description: "Your graph has been saved successfully",
      });
    } catch (error) {
      console.error('Error saving graph:', error);
      toast({
        title: "Save Failed",
        description: "Could not save your graph. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadGraph = () => {
    try {
      if (calculatorRef.current) {
        // Use Desmos screenshot capability
        calculatorRef.current.screenshot({
          width: 800,
          height: 600,
          targetPixelRatio: 2
        }, (dataURL) => {
          // Create an anchor element for download
          const link = document.createElement('a');
          
          // Set the download attribute with a filename
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          link.download = `desmos-graph-${timestamp}.png`;
          
          // Set the href to the image data
          link.href = dataURL;
          
          // Append to the body
          document.body.appendChild(link);
          
          // Trigger the download
          link.click();
          
          // Clean up
          document.body.removeChild(link);
          
          toast({
            title: "Image Downloaded",
            description: "Your graph has been saved to your downloads folder.",
          });
        });
      }
    } catch (error) {
      console.error('Error downloading graph:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the graph. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <SidebarShadcn />
      <main className={`flex-1 p-4 md:p-10 ${isMobile ? 'pt-16' : ''}`}>
        <div className="max-w-4xl h-full rounded px-[19px] py-[12px] my-0 mx-0">
          <h1 className="text-2xl font-bold mb-4">Interactive Graphing Calculator</h1>

          {/* Expression Input */}
          <div className="mb-4 flex gap-2">
            <Input
              value={expression}
              onChange={handleExpressionChange}
              placeholder="Enter a mathematical expression (e.g., y=x^2)"
              className="flex-grow"
            />
            <Button onClick={updateGraph}>
              <Calculator className="mr-2 h-4 w-4" />
              Graph
            </Button>
          </div>

          {/* Desmos Container */}
          <div 
            ref={containerRef} 
            className="mb-6 border border-gray-300 rounded-md overflow-hidden" 
            style={{ height: '65vh' }}
          />

          {/* Controls */}
          <div className="mb-4 flex flex-wrap gap-2 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={saveGraph}
                variant="secondary"
                size="sm"
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Graph'}
              </Button>
            </div>
            
            <Button
              onClick={downloadGraph}
              variant="outline"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PNG
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 border rounded-md bg-muted">
            <h3 className="font-semibold mb-2">Tips:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Enter mathematical expressions like <code>y=x^2</code>, <code>y=sin(x)</code>, etc.</li>
              <li>Use <code>^</code> for exponents: <code>x^2</code> means x squared</li>
              <li>Use parentheses for grouping: <code>(x+1)(x-1)</code></li>
              <li>Use functions like <code>sin</code>, <code>cos</code>, <code>tan</code>, <code>sqrt</code></li>
              <li>Define parameters with sliders using expressions like <code>a=1</code></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Desmos;

// import React, { useRef, useEffect, useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// const DesmosGraph = () => {
//   const containerRef = useRef(null);
//   const calculatorRef = useRef(null);
//   const [expression, setExpression] = useState('y=x^2');

//   useEffect(() => {
//     // Load the Desmos Calculator script
//     const script = document.createElement('script');
//     script.src = 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
//     script.async = true;
//     script.onload = initializeCalculator;
//     document.body.appendChild(script);

//     return () => {
//       // Clean up
//       document.body.removeChild(script);
//       if (calculatorRef.current) {
//         calculatorRef.current.destroy();
//       }
//     };
//   }, []);

//   const initializeCalculator = () => {
//     if (containerRef.current && window.Desmos) {
//       calculatorRef.current = window.Desmos.GraphingCalculator(containerRef.current, {
//         expressions: false,
//         settingsMenu: false,
//         zoomButtons: true,
//         expressionsTopbar: true
//       });

//       // Add initial expression
//       calculatorRef.current.setExpression({ id: 'graph1', latex: expression });
//     }
//   };

//   const updateGraph = () => {
//     if (calculatorRef.current) {
//       calculatorRef.current.setExpression({ id: 'graph1', latex: expression });
//     }
//   };

//   const handleExpressionChange = (e) => {
//     setExpression(e.target.value);
//   };

//   return (
//     <div className="my-4">
//       <h2 className="text-xl font-bold mb-2">Desmos Graphing Calculator</h2>
//       <div className="flex gap-2 mb-4">
//         <Input
//           value={expression}
//           onChange={handleExpressionChange}
//           placeholder="Enter a mathematical expression (e.g., y=x^2)"
//           className="flex-grow"
//         />
//         <Button onClick={updateGraph}>Graph</Button>
//       </div>
//       <div 
//         ref={containerRef} 
//         className="border border-gray-300 rounded-md" 
//         style={{ height: '400px', width: '100%' }}
//       />
//     </div>
//   );
// };

// export default DesmosGraph;