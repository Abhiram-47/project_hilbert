import React, { useRef, useEffect, useState, useCallback } from 'react';
import { RotateCcw, Circle, Minus, Plus } from 'lucide-react';

interface Stone {
  id: string;
  x: number;
  y: number;
  size: number;
  isDragging: boolean;
}

const ZenGarden: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRaking, setIsRaking] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [stones, setStones] = useState<Stone[]>([]);
  const [draggedStone, setDraggedStone] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Create sand texture background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#f5f1eb');
    gradient.addColorStop(0.5, '#ede7d9');
    gradient.addColorStop(1, '#e8dcc7');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle sand grain texture
    for (let i = 0; i < 1000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      ctx.fillStyle = `rgba(139, 125, 107, ${Math.random() * 0.1})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }, []);

  const drawRakeMark = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'multiply';
    ctx.strokeStyle = '#d4c4a8';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Add rake lines effect
    for (let i = -2; i <= 2; i++) {
      ctx.strokeStyle = `rgba(180, 160, 130, ${0.3 - Math.abs(i) * 0.05})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + i * 8 - 20, y);
      ctx.lineTo(x + i * 8 + 20, y);
      ctx.stroke();
    }
    
    ctx.globalCompositeOperation = 'source-over';
  }, [brushSize]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a stone
    const clickedStone = stones.find(stone => {
      const distance = Math.sqrt((x - stone.x) ** 2 + (y - stone.y) ** 2);
      return distance <= stone.size;
    });

    if (clickedStone) {
      setDraggedStone(clickedStone.id);
      setDragOffset({
        x: x - clickedStone.x,
        y: y - clickedStone.y
      });
      setStones(prev => prev.map(stone => 
        stone.id === clickedStone.id 
          ? { ...stone, isDragging: true }
          : stone
      ));
    } else {
      setIsRaking(true);
      drawRakeMark(x, y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedStone) {
      setStones(prev => prev.map(stone => 
        stone.id === draggedStone
          ? { ...stone, x: x - dragOffset.x, y: y - dragOffset.y }
          : stone
      ));
    } else if (isRaking) {
      drawRakeMark(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsRaking(false);
    if (draggedStone) {
      setStones(prev => prev.map(stone => 
        stone.id === draggedStone
          ? { ...stone, isDragging: false }
          : stone
      ));
      setDraggedStone(null);
    }
  };

  const clearGarden = () => {
    initializeCanvas();
  };

  const addStone = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newStone: Stone = {
      id: Date.now().toString(),
      x: Math.random() * (canvas.width - 100) + 50,
      y: Math.random() * (canvas.height - 100) + 50,
      size: 15 + Math.random() * 25,
      isDragging: false
    };

    setStones(prev => [...prev, newStone]);
  };

  useEffect(() => {
    initializeCanvas();

    const handleResize = () => {
      setTimeout(initializeCanvas, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initializeCanvas]);

  // Draw stones on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Redraw canvas background and rake marks are preserved
    // Only redraw stones
    stones.forEach(stone => {
      ctx.save();
      
      // Stone shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(stone.x + 2, stone.y + 2, stone.size, stone.size * 0.8, 0, 0, 2 * Math.PI);
      ctx.fill();
      
      // Stone gradient
      const gradient = ctx.createRadialGradient(
        stone.x - stone.size * 0.3, 
        stone.y - stone.size * 0.3, 
        0,
        stone.x, 
        stone.y, 
        stone.size
      );
      gradient.addColorStop(0, '#9ca3af');
      gradient.addColorStop(0.5, '#6b7280');
      gradient.addColorStop(1, '#4b5563');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(stone.x, stone.y, stone.size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Stone highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(stone.x - stone.size * 0.3, stone.y - stone.size * 0.3, stone.size * 0.4, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.restore();
    });
  }, [stones]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-stone-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-light text-stone-700 mb-2">
            Digital Zen Garden
          </h1>
          <p className="text-stone-600 text-lg">
            Find peace through digital meditation • Rake patterns • Place stones
          </p>
        </div>

        {/* Garden Container */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="w-full h-96 md:h-[600px] cursor-crosshair"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />

          {/* Controls */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
            <div className="flex flex-col space-y-4">
              {/* Brush Size */}
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-stone-600 w-16">Rake Size</span>
                <button
                  onClick={() => setBrushSize(Math.max(10, brushSize - 5))}
                  className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm text-stone-700 w-8 text-center">{brushSize}</span>
                <button
                  onClick={() => setBrushSize(Math.min(40, brushSize + 5))}
                  className="p-1 rounded-lg bg-stone-100 hover:bg-stone-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Add Stone */}
              <button
                onClick={addStone}
                className="flex items-center space-x-2 px-3 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
              >
                <Circle size={16} />
                <span>Add Stone</span>
              </button>

              {/* Clear Garden */}
              <button
                onClick={clearGarden}
                className="flex items-center space-x-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <RotateCcw size={16} />
                <span>Clear Garden</span>
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg max-w-xs">
            <h3 className="font-medium text-stone-700 mb-2">How to use:</h3>
            <ul className="text-sm text-stone-600 space-y-1">
              <li>• Click and drag to rake sand patterns</li>
              <li>• Drag stones to reposition them</li>
              <li>• Add new stones with the button</li>
              <li>• Clear to start fresh</li>
            </ul>
          </div>
        </div>

        {/* Zen Quote */}
        <div className="text-center mt-8">
          <blockquote className="text-lg md:text-xl text-stone-600 font-light italic">
            "The quieter you become, the more you are able to hear."
          </blockquote>
          <cite className="text-stone-500 text-sm mt-2 block">— Rumi</cite>
        </div>
      </div>
    </div>
  );
};

export default ZenGarden;