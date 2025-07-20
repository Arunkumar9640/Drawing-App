// Save drawing to localStorage
export const saveDrawingToStorage = (drawingData) => {
  try {
    localStorage.setItem('savedDrawing', JSON.stringify(drawingData));
    return true;
  } catch (error) {
    console.error('Error saving drawing to localStorage:', error);
    return false;
  }
};

// Load drawing from localStorage
export const loadDrawingFromStorage = () => {
  try {
    const savedDrawing = localStorage.getItem('savedDrawing');
    if (savedDrawing) {
      return JSON.parse(savedDrawing);
    }
    return null;
  } catch (error) {
    console.error('Error loading drawing from localStorage:', error);
    return null;
  }
};

// Clear saved drawing from localStorage
export const clearDrawingFromStorage = () => {
  try {
    localStorage.removeItem('savedDrawing');
    return true;
  } catch (error) {
    console.error('Error clearing drawing from localStorage:', error);
    return false;
  }
};

// Auto-save drawing data
export const autoSaveDrawing = (shapes) => {
  const drawingData = {
    shapes,
    timestamp: new Date().toISOString(),
    version: '1.0',
  };
  return saveDrawingToStorage(drawingData);
}; 