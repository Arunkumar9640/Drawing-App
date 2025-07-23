import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store/store';
import { loadDrawing } from './store/drawingSlice';
import { loadDrawingFromStorage } from './utils/storageUtils';
import Toolbar from './components/Toolbar';
import SlideBar from './components/SlideBar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  useEffect(() => {
    const savedDrawing = loadDrawingFromStorage();
    if (savedDrawing) {
      store.dispatch(loadDrawing(savedDrawing));
    }
  }, []);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App h-screen flex flex-col bg-gray-50">
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-800"> Drawing App</h1>
              <p className="text-gray-600 mt-1">Create, Edit, And Save Your Drawings....</p>
            </div>
          </header>
          <Toolbar />
          <SlideBar />
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex items-center justify-center p-6">
              <Canvas />
            </div>
            <PropertiesPanel />
          </div>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
