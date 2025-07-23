import { createSlice } from '@reduxjs/toolkit';
import { autoSaveDrawing } from '../utils/storageUtils';

const initialState = {
  slides: [
    {
      shapes: [],
      history: [],
      historyIndex: -1,
    },
  ],
  currentSlideIndex: 0,
  selectedShapeId: null,
  currentTool: 'select', // 'select', 'rectangle', 'circle', 'line', 'freehand'
  drawingStyle: {
    strokeColor: '#000000',
    fillColor: '#ffffff',
    lineWidth: 2,
    lineStyle: 'solid', // 'solid', 'dashed'
  },
  isDrawing: false,
};

const drawingSlice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    addShape: (state, action) => {
      const slide = state.slides[state.currentSlideIndex];
      slide.shapes.push(action.payload);
      state.selectedShapeId = action.payload.id;
      // Add to history
      slide.history = slide.history.slice(0, slide.historyIndex + 1);
      slide.history.push([...slide.shapes]);
      slide.historyIndex = slide.history.length - 1;
      // Auto-save
      autoSaveDrawing(slide.shapes);
    },
    updateShape: (state, action) => {
      const slide = state.slides[state.currentSlideIndex];
      const { id, updates } = action.payload;
      const shapeIndex = slide.shapes.findIndex(shape => shape.id === id);
      if (shapeIndex !== -1) {
        slide.shapes[shapeIndex] = { ...slide.shapes[shapeIndex], ...updates };
        // Add to history
        slide.history = slide.history.slice(0, slide.historyIndex + 1);
        slide.history.push([...slide.shapes]);
        slide.historyIndex = slide.history.length - 1;
        // Auto-save
        autoSaveDrawing(slide.shapes);
      }
    },
    removeShape: (state, action) => {
      const slide = state.slides[state.currentSlideIndex];
      slide.shapes = slide.shapes.filter(shape => shape.id !== action.payload);
      if (state.selectedShapeId === action.payload) {
        state.selectedShapeId = null;
      }
      // Add to history
      slide.history = slide.history.slice(0, slide.historyIndex + 1);
      slide.history.push([...slide.shapes]);
      slide.historyIndex = slide.history.length - 1;
      // Auto-save
      autoSaveDrawing(slide.shapes);
    },
    setSelectedShape: (state, action) => {
      state.selectedShapeId = action.payload;
    },
    setCurrentTool: (state, action) => {
      state.currentTool = action.payload;
    },
    updateDrawingStyle: (state, action) => {
      state.drawingStyle = { ...state.drawingStyle, ...action.payload };
    },
    setIsDrawing: (state, action) => {
      state.isDrawing = action.payload;
    },
    clearCanvas: (state) => {
      const slide = state.slides[state.currentSlideIndex];
      slide.shapes = [];
      state.selectedShapeId = null;
      slide.history = [];
      slide.historyIndex = -1;
      // Auto-save
      autoSaveDrawing(slide.shapes);
    },
    loadDrawing: (state, action) => {
      // For backward compatibility, load into the first slide
      state.slides = [
        {
          shapes: action.payload.shapes || [],
          history: [],
          historyIndex: -1,
        },
      ];
      state.currentSlideIndex = 0;
      state.selectedShapeId = null;
    },
    undo: (state) => {
      const slide = state.slides[state.currentSlideIndex];
      if (slide.historyIndex > 0) {
        slide.historyIndex--;
        slide.shapes = [...slide.history[slide.historyIndex]];
        state.selectedShapeId = null;
      }
    },
    redo: (state) => {
      const slide = state.slides[state.currentSlideIndex];
      if (slide.historyIndex < slide.history.length - 1) {
        slide.historyIndex++;
        slide.shapes = [...slide.history[slide.historyIndex]];
        state.selectedShapeId = null;
      }
    },
    addSlide: (state) => {
      state.slides.push({ shapes: [], history: [], historyIndex: -1 });
      state.currentSlideIndex = state.slides.length - 1;
      state.selectedShapeId = null;
    },
    deleteSlide: (state, action) => {
      const idx = action.payload;
      if (state.slides.length === 1) return; // Prevent deleting last slide
      state.slides.splice(idx, 1);
      if (state.currentSlideIndex >= state.slides.length) {
        state.currentSlideIndex = state.slides.length - 1;
      }
      state.selectedShapeId = null;
    },
    setCurrentSlide: (state, action) => {
      state.currentSlideIndex = action.payload;
      state.selectedShapeId = null;
    },
  },
});

export const {
  addShape,
  updateShape,
  removeShape,
  setSelectedShape,
  setCurrentTool,
  updateDrawingStyle,
  setIsDrawing,
  clearCanvas,
  loadDrawing,
  undo,
  redo,
  addSlide,
  deleteSlide,
  setCurrentSlide,
} = drawingSlice.actions;

export default drawingSlice.reducer; 