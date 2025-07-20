// Generate unique ID for shapes
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate distance between two points
export const calculateDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

// Check if a point is inside a shape
export const isPointInShape = (point, shape) => {
  const { x, y } = point;
  
  switch (shape.type) {
    case 'rectangle':
      return x >= shape.x && x <= shape.x + shape.width &&
             y >= shape.y && y <= shape.y + shape.height;
    
    case 'circle':
      const distance = calculateDistance(x, y, shape.x + shape.radius, shape.y + shape.radius);
      return distance <= shape.radius;
    
    case 'line':
      const { x1, y1, x2, y2 } = shape;
      const lineLength = calculateDistance(x1, y1, x2, y2);
      const distance1 = calculateDistance(x, y, x1, y1);
      const distance2 = calculateDistance(x, y, x2, y2);
      const tolerance = 5; // pixels
      return Math.abs(distance1 + distance2 - lineLength) <= tolerance;
    
    default:
      return false;
  }
};

// Create shape objects
export const createRectangle = (x, y, width, height, style) => ({
  id: generateId(),
  type: 'rectangle',
  x,
  y,
  width,
  height,
  ...style,
});

export const createCircle = (x, y, radius, style) => ({
  id: generateId(),
  type: 'circle',
  x,
  y,
  radius,
  ...style,
});

export const createLine = (x1, y1, x2, y2, style) => ({
  id: generateId(),
  type: 'line',
  x1,
  y1,
  x2,
  y2,
  ...style,
});

export const createFreehandPath = (points, style) => ({
  id: generateId(),
  type: 'freehand',
  points: [...points],
  ...style,
});

// Draw shapes on canvas
export const drawShape = (ctx, shape) => {
  ctx.save();
  
  // Set line style
  if (shape.lineStyle === 'dashed') {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }
  
  ctx.strokeStyle = shape.strokeColor;
  ctx.fillStyle = shape.fillColor;
  ctx.lineWidth = shape.lineWidth;
  
  switch (shape.type) {
    case 'rectangle':
      ctx.beginPath();
      ctx.rect(shape.x, shape.y, shape.width, shape.height);
      ctx.fill();
      ctx.stroke();
      break;
    
    case 'circle':
      ctx.beginPath();
      ctx.arc(shape.x + shape.radius, shape.y + shape.radius, shape.radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      break;
    
    case 'line':
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
      break;
    
    case 'freehand':
      if (shape.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      }
      break;
    default:
      break;
  }
  
  ctx.restore();
};

// Draw selection indicator
export const drawSelection = (ctx, shape) => {
  ctx.save();
  ctx.strokeStyle = '#2196F3';
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  
  switch (shape.type) {
    case 'rectangle':
      ctx.strokeRect(shape.x - 2, shape.y - 2, shape.width + 4, shape.height + 4);
      break;
    
    case 'circle':
      ctx.beginPath();
      ctx.arc(shape.x + shape.radius, shape.y + shape.radius, shape.radius + 2, 0, 2 * Math.PI);
      ctx.stroke();
      break;
    
    case 'line':
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
      break;
    
    case 'freehand':
      if (shape.points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        for (let i = 1; i < shape.points.length; i++) {
          ctx.lineTo(shape.points[i].x, shape.points[i].y);
        }
        ctx.stroke();
      }
      break;
    default:
      break;
  }
  
  ctx.restore();
}; 