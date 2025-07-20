import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Box,
  FormControl,
  Select,
  MenuItem,
  Slider,
  Typography,
  Divider,
} from '@mui/material';
import {
  CropSquare,
  RadioButtonUnchecked,
  ShowChart,
  Create,
  TouchApp,
  Undo,
  Redo,
  Clear,
  Upload,
  Download,
} from '@mui/icons-material';
import {
  setCurrentTool,
  updateDrawingStyle,
  clearCanvas,
  undo,
  redo,
} from '../store/drawingSlice';
import { saveAs } from 'file-saver';
import { saveDrawingToStorage } from '../utils/storageUtils';

const Toolbar = () => {
  const dispatch = useDispatch();
  const { currentTool, drawingStyle, shapes, historyIndex, history } = useSelector(
    (state) => state.drawing
  );

  const tools = [
    { id: 'select', icon: <TouchApp />, label: 'Select' },
    { id: 'rectangle', icon: <CropSquare />, label: 'Rectangle' },
    { id: 'circle', icon: <RadioButtonUnchecked />, label: 'Circle' },
    { id: 'line', icon: <ShowChart />, label: 'Line' },
    { id: 'freehand', icon: <Create />, label: 'Freehand' },
  ];

  const handleToolChange = (toolId) => {
    dispatch(setCurrentTool(toolId));
  };

  const handleStyleChange = (property, value) => {
    dispatch(updateDrawingStyle({ [property]: value }));
  };

  const handleSave = () => {
    const drawingData = {
      shapes,
      timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(drawingData, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, `drawing-${Date.now()}.json`);
  };

  const handleLoad = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const drawingData = JSON.parse(e.target.result);
          // Save to localStorage and reload
          saveDrawingToStorage(drawingData);
          window.location.reload(); // Simple reload to load the drawing
        } catch (error) {
          console.error('Error loading drawing:', error);
          alert('Error loading drawing file');
        }
      };
      reader.readAsText(file);
    }
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <Box className="bg-white border-b border-gray-200 p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Drawing Tools */}
        <div className="flex items-center gap-2">
          <Typography variant="subtitle2" className="text-gray-700">
            Tools:
          </Typography>
          <ButtonGroup variant="outlined" size="small">
            {tools.map((tool) => (
              <Button
                key={tool.id}
                variant={currentTool === tool.id ? 'contained' : 'outlined'}
                onClick={() => handleToolChange(tool.id)}
                title={tool.label}
                className="min-w-0 px-3"
              >
                {tool.icon}
              </Button>
            ))}
          </ButtonGroup>
        </div>

        <Divider orientation="vertical" flexItem />

        {/* Stroke Color */}
        <div className="flex items-center gap-2">
          <Typography variant="subtitle2" className="text-gray-700">
            Stroke:
          </Typography>
          <input
            type="color"
            value={drawingStyle.strokeColor}
            onChange={(e) => handleStyleChange('strokeColor', e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        {/* Fill Color */}
        <div className="flex items-center gap-2">
          <Typography variant="subtitle2" className="text-gray-700">
            Fill:
          </Typography>
          <input
            type="color"
            value={drawingStyle.fillColor}
            onChange={(e) => handleStyleChange('fillColor', e.target.value)}
            className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          />
        </div>

        <Divider orientation="vertical" flexItem />

        {/* Line Width */}
        <div className="flex items-center gap-2 min-w-32">
          <Typography variant="subtitle2" className="text-gray-700">
            Width:
          </Typography>
          <Slider
            value={drawingStyle.lineWidth}
            onChange={(e, value) => handleStyleChange('lineWidth', value)}
            min={1}
            max={20}
            step={1}
            size="small"
            className="flex-1"
          />
          <Typography variant="caption" className="text-gray-500 min-w-8">
            {drawingStyle.lineWidth}
          </Typography>
        </div>

        <Divider orientation="vertical" flexItem />

        {/* Line Style */}
        <div className="flex items-center gap-2">
          <Typography variant="subtitle2" className="text-gray-700">
            Style:
          </Typography>
          <FormControl size="small" className="min-w-24">
            <Select
              value={drawingStyle.lineStyle}
              onChange={(e) => handleStyleChange('lineStyle', e.target.value)}
              displayEmpty
            >
              <MenuItem value="solid">Solid</MenuItem>
              <MenuItem value="dashed">Dashed</MenuItem>
            </Select>
          </FormControl>
        </div>

        <Divider orientation="vertical" flexItem />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outlined"
            size="small"
            onClick={() => dispatch(undo())}
            disabled={!canUndo}
            startIcon={<Undo />}
          >
            Undo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => dispatch(redo())}
            disabled={!canRedo}
            startIcon={<Redo />}
          >
            Redo
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => dispatch(clearCanvas())}
            startIcon={<Clear />}
            color="error"
          >
            Clear
          </Button>
        </div>

        <Divider orientation="vertical" flexItem />

        {/* Save/Load Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="contained"
            size="small"
            onClick={handleSave}
            startIcon={<Download />}
            color="primary"
          >
            Save
          </Button>
          <Button
            variant="outlined"
            size="small"
            component="label"
            startIcon={<Upload />}
          >
            Load
            <input
              type="file"
              accept=".json"
              onChange={handleLoad}
              style={{ display: 'none' }}
            />
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default Toolbar; 