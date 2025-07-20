import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addShape,
  updateShape,
  setSelectedShape,
  setIsDrawing,
} from '../store/drawingSlice';
import {
  drawShape,
  drawSelection,
  isPointInShape,
  createRectangle,
  createCircle,
  createLine,
  createFreehandPath,
} from '../utils/shapeUtils';

const Canvas = () => {
  const canvasRef = useRef(null);
  const dispatch = useDispatch();
  const {
    slides,
    currentSlideIndex,
    selectedShapeId,
    currentTool,
    drawingStyle,
    isDrawing,
  } = useSelector((state) => state.drawing);

  const shapes = slides[currentSlideIndex].shapes;

  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [drawingStart, setDrawingStart] = useState({ x: 0, y: 0 });
  const [freehandPoints, setFreehandPoints] = useState([]);

  // Get canvas context and dimensions
  const getCanvasContext = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    return { ctx, rect };
  };

  // Get mouse position relative to canvas
  const getMousePos = (e) => {
    const { rect } = getCanvasContext();
    if (!rect) return { x: 0, y: 0 };
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  // Clear canvas and redraw all shapes
  const redrawCanvas = useCallback(() => {
    const { ctx } = getCanvasContext();
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw all shapes
    shapes.forEach((shape) => {
      drawShape(ctx, shape);
    });

    // Draw selection indicator
    if (selectedShapeId) {
      const selectedShape = shapes.find(shape => shape.id === selectedShapeId);
      if (selectedShape) {
        drawSelection(ctx, selectedShape);
      }
    }
  }, [shapes, selectedShapeId]);

  // Redraw canvas when shapes or selection changes
  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Handle mouse down
  const handleMouseDown = (e) => {
    const mousePos = getMousePos(e);
    const { ctx } = getCanvasContext();
    if (!ctx) return;

    // Check if clicking on an existing shape
    const clickedShape = shapes.findLast(shape => isPointInShape(mousePos, shape));

    if (currentTool === 'select') {
      if (clickedShape) {
        dispatch(setSelectedShape(clickedShape.id));
        setIsDragging(true);
        setDragStart(mousePos);
      } else {
        dispatch(setSelectedShape(null));
      }
    } else {
      // Start drawing new shape
      dispatch(setIsDrawing(true));
      setDrawingStart(mousePos);
      
      if (currentTool === 'freehand') {
        setFreehandPoints([mousePos]);
      }
    }
  };

  // Handle mouse move
  const handleMouseMove = (e) => {
    const mousePos = getMousePos(e);
    const { ctx } = getCanvasContext();
    if (!ctx) return;

    if (currentTool === 'select' && isDragging && selectedShapeId) {
      // Handle shape dragging
      const selectedShape = shapes.find(shape => shape.id === selectedShapeId);
      if (selectedShape) {
        const deltaX = mousePos.x - dragStart.x;
        const deltaY = mousePos.y - dragStart.y;

        let updates = {};
        switch (selectedShape.type) {
          case 'rectangle':
            updates = { x: selectedShape.x + deltaX, y: selectedShape.y + deltaY };
            break;
          case 'circle':
            updates = { x: selectedShape.x + deltaX, y: selectedShape.y + deltaY };
            break;
          case 'line':
            updates = {
              x1: selectedShape.x1 + deltaX,
              y1: selectedShape.y1 + deltaY,
              x2: selectedShape.x2 + deltaX,
              y2: selectedShape.y2 + deltaY,
            };
            break;
          case 'freehand':
            updates = {
              points: selectedShape.points.map(point => ({
                x: point.x + deltaX,
                y: point.y + deltaY,
              })),
            };
            break;
          default:
            updates = {};
            break;
        }

        dispatch(updateShape({ id: selectedShapeId, updates }));
        setDragStart(mousePos);
      }
    } else if (isDrawing && currentTool !== 'freehand') {
      // Preview drawing
      redrawCanvas();
      
      // Draw preview
      ctx.save();
      ctx.strokeStyle = drawingStyle.strokeColor;
      ctx.fillStyle = drawingStyle.fillColor;
      ctx.lineWidth = drawingStyle.lineWidth;
      
      if (drawingStyle.lineStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      }

              switch (currentTool) {
          case 'rectangle':
            const width = mousePos.x - drawingStart.x;
            const height = mousePos.y - drawingStart.y;
            ctx.beginPath();
            ctx.rect(drawingStart.x, drawingStart.y, width, height);
            ctx.fill();
            ctx.stroke();
            break;
          
          case 'circle':
            const radius = Math.sqrt(
              Math.pow(mousePos.x - drawingStart.x, 2) + 
              Math.pow(mousePos.y - drawingStart.y, 2)
            );
            ctx.beginPath();
            ctx.arc(drawingStart.x, drawingStart.y, radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
          
          case 'line':
            ctx.beginPath();
            ctx.moveTo(drawingStart.x, drawingStart.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.stroke();
            break;
          default:
            break;
        }
      
      ctx.restore();
    } else if (isDrawing && currentTool === 'freehand') {
      // Add point to freehand drawing
      setFreehandPoints(prev => [...prev, mousePos]);
      
      // Draw the line segment
      ctx.save();
      ctx.strokeStyle = drawingStyle.strokeColor;
      ctx.lineWidth = drawingStyle.lineWidth;
      ctx.beginPath();
      ctx.moveTo(freehandPoints[freehandPoints.length - 1].x, freehandPoints[freehandPoints.length - 1].y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.stroke();
      ctx.restore();
    }
  };

  // Handle mouse up
  const handleMouseUp = (e) => {
    if (isDrawing && currentTool !== 'select') {
      const mousePos = getMousePos(e);
      
      let newShape;
      switch (currentTool) {
        case 'rectangle':
          const width = mousePos.x - drawingStart.x;
          const height = mousePos.y - drawingStart.y;
          newShape = createRectangle(drawingStart.x, drawingStart.y, width, height, drawingStyle);
          break;
        
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(mousePos.x - drawingStart.x, 2) + 
            Math.pow(mousePos.y - drawingStart.y, 2)
          );
          newShape = createCircle(drawingStart.x, drawingStart.y, radius, drawingStyle);
          break;
        
        case 'line':
          newShape = createLine(drawingStart.x, drawingStart.y, mousePos.x, mousePos.y, drawingStyle);
          break;
        
        case 'freehand':
          if (freehandPoints.length > 1) {
            newShape = createFreehandPath(freehandPoints, drawingStyle);
          }
          break;
        default:
          break;
      }
      
      if (newShape) {
        dispatch(addShape(newShape));
      }
      
      dispatch(setIsDrawing(false));
      setFreehandPoints([]);
    }
    
    setIsDragging(false);
  };

  // Handle mouse leave
  const handleMouseLeave = () => {
    if (isDrawing) {
      dispatch(setIsDrawing(false));
      setFreehandPoints([]);
    }
    setIsDragging(false);
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className={`${isDragging ? 'dragging' : ''} ${currentTool === 'select' ? 'selecting' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
};

export default Canvas; 