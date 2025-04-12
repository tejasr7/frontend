export const analyzeDrawingWithAI = async (imageData: string): Promise<string[]> => {
    try {
        // Convert data URL to blob
        const res = await fetch(imageData);
        const blob = await res.blob();
        
        // Create file from blob
        const file = new File([blob], 'drawing.png', { type: 'image/png' });
        
        // Prepare form data
        const formData = new FormData();
        formData.append('file', file);

        // Call AI API endpoint with prompt
        const response = await fetch('http://localhost:8000/analyze-drawing', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`AI API error: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message || 'AI processing failed');
        }

        return [
            "AI ANALYSIS RESULTS:",
            data.result || "No analysis results returned"
        ];
    } catch (error) {
        console.error('AI analysis failed:', error);
        return [
            "AI ANALYSIS FAILED:",
            error instanceof Error ? error.message : "Connection error"
        ];
    }
};
