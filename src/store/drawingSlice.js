import { createSlice } from '@reduxjs/toolkit';
import { autoSaveDrawing } from '../utils/storageUtils';

const initialState = {
  shapes: [],
  selectedShapeId: null,
  currentTool: 'select', // 'select', 'rectangle', 'circle', 'line', 'freehand'
  drawingStyle: {
    strokeColor: '#000000',
    fillColor: '#ffffff',
    lineWidth: 2,
    lineStyle: 'solid', // 'solid', 'dashed'
  },
  isDrawing: false,
  history: [],
  historyIndex: -1,
};

const drawingSlice = createSlice({
  name: 'drawing',
  initialState,
  reducers: {
    addShape: (state, action) => {
      state.shapes.push(action.payload);
      state.selectedShapeId = action.payload.id;
      // Add to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.shapes]);
      state.historyIndex = state.history.length - 1;
      // Auto-save
      autoSaveDrawing(state.shapes);
    },
    updateShape: (state, action) => {
      const { id, updates } = action.payload;
      const shapeIndex = state.shapes.findIndex(shape => shape.id === id);
      if (shapeIndex !== -1) {
        state.shapes[shapeIndex] = { ...state.shapes[shapeIndex], ...updates };
        // Add to history
        state.history = state.history.slice(0, state.historyIndex + 1);
        state.history.push([...state.shapes]);
        state.historyIndex = state.history.length - 1;
        // Auto-save
        autoSaveDrawing(state.shapes);
      }
    },
    removeShape: (state, action) => {
      state.shapes = state.shapes.filter(shape => shape.id !== action.payload);
      if (state.selectedShapeId === action.payload) {
        state.selectedShapeId = null;
      }
      // Add to history
      state.history = state.history.slice(0, state.historyIndex + 1);
      state.history.push([...state.shapes]);
      state.historyIndex = state.history.length - 1;
      // Auto-save
      autoSaveDrawing(state.shapes);
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
      state.shapes = [];
      state.selectedShapeId = null;
      state.history = [];
      state.historyIndex = -1;
      // Auto-save
      autoSaveDrawing(state.shapes);
    },
    loadDrawing: (state, action) => {
      state.shapes = action.payload.shapes || [];
      state.selectedShapeId = null;
      state.history = [];
      state.historyIndex = -1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex--;
        state.shapes = [...state.history[state.historyIndex]];
        state.selectedShapeId = null;
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        state.shapes = [...state.history[state.historyIndex]];
        state.selectedShapeId = null;
      }
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
} = drawingSlice.actions;

export default drawingSlice.reducer; 