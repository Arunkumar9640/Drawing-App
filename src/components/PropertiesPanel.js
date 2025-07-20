import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { updateShape, removeShape, setSelectedShape } from '../store/drawingSlice';

const PropertiesPanel = () => {
  const dispatch = useDispatch();
  const { slides, currentSlideIndex, selectedShapeId } = useSelector((state) => state.drawing);
  const shapes = slides[currentSlideIndex].shapes;

  const selectedShape = shapes.find(shape => shape.id === selectedShapeId);

  if (!selectedShape) {
    return (
      <Box className="bg-white border-l border-gray-200 p-4 w-80">
        <Typography variant="h6" className="text-gray-500 mb-4">
          Properties
        </Typography>
        <Typography variant="body2" className="text-gray-400">
          Select a shape to edit its properties
        </Typography>
      </Box>
    );
  }

  const handlePropertyChange = (property, value) => {
    dispatch(updateShape({
      id: selectedShapeId,
      updates: { [property]: value }
    }));
  };

  const handleDelete = () => {
    dispatch(removeShape(selectedShapeId));
    dispatch(setSelectedShape(null));
  };

  const renderShapeProperties = () => {
    switch (selectedShape.type) {
      case 'rectangle':
        return (
          <>
            <TextField
              label="X Position"
              type="number"
              value={selectedShape.x}
              onChange={(e) => handlePropertyChange('x', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Y Position"
              type="number"
              value={selectedShape.y}
              onChange={(e) => handlePropertyChange('y', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Width"
              type="number"
              value={selectedShape.width}
              onChange={(e) => handlePropertyChange('width', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Height"
              type="number"
              value={selectedShape.height}
              onChange={(e) => handlePropertyChange('height', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
          </>
        );

      case 'circle':
        return (
          <>
            <TextField
              label="X Position"
              type="number"
              value={selectedShape.x}
              onChange={(e) => handlePropertyChange('x', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Y Position"
              type="number"
              value={selectedShape.y}
              onChange={(e) => handlePropertyChange('y', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Radius"
              type="number"
              value={selectedShape.radius}
              onChange={(e) => handlePropertyChange('radius', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
          </>
        );

      case 'line':
        return (
          <>
            <TextField
              label="Start X"
              type="number"
              value={selectedShape.x1}
              onChange={(e) => handlePropertyChange('x1', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="Start Y"
              type="number"
              value={selectedShape.y1}
              onChange={(e) => handlePropertyChange('y1', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="End X"
              type="number"
              value={selectedShape.x2}
              onChange={(e) => handlePropertyChange('x2', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
            <TextField
              label="End Y"
              type="number"
              value={selectedShape.y2}
              onChange={(e) => handlePropertyChange('y2', Number(e.target.value))}
              size="small"
              fullWidth
              margin="dense"
            />
          </>
        );

      case 'freehand':
        return (
          <Typography variant="body2" className="text-gray-500">
            Freehand paths cannot be edited numerically.
            Use the select tool to drag and move the path.
          </Typography>
        );

      default:
        return null;
    }
  };

  return (
    <Box className="bg-white border-l border-gray-200 p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <Typography variant="h6" className="text-gray-700">
          Properties
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={handleDelete}
          startIcon={<Delete />}
        >
          Delete
        </Button>
      </div>

      <Typography variant="subtitle2" className="text-gray-600 mb-2">
        Shape Type: {selectedShape.type.charAt(0).toUpperCase() + selectedShape.type.slice(1)}
      </Typography>

      <Divider className="mb-4" />

      {/* Position and Size Properties */}
      <Typography variant="subtitle2" className="text-gray-700 mb-2">
        Position & Size
      </Typography>
      {renderShapeProperties()}

      <Divider className="my-4" />

      {/* Style Properties */}
      <Typography variant="subtitle2" className="text-gray-700 mb-2">
        Style
      </Typography>

      <div className="mb-3">
        <Typography variant="caption" className="text-gray-600">
          Stroke Color
        </Typography>
        <input
          type="color"
          value={selectedShape.strokeColor}
          onChange={(e) => handlePropertyChange('strokeColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded mt-1 cursor-pointer"
        />
      </div>

      <div className="mb-3">
        <Typography variant="caption" className="text-gray-600">
          Fill Color
        </Typography>
        <input
          type="color"
          value={selectedShape.fillColor}
          onChange={(e) => handlePropertyChange('fillColor', e.target.value)}
          className="w-full h-10 border border-gray-300 rounded mt-1 cursor-pointer"
        />
      </div>

      <div className="mb-3">
        <Typography variant="caption" className="text-gray-600">
          Line Width: {selectedShape.lineWidth}
        </Typography>
        <Slider
          value={selectedShape.lineWidth}
          onChange={(e, value) => handlePropertyChange('lineWidth', value)}
          min={1}
          max={20}
          step={1}
          size="small"
          className="mt-1"
        />
      </div>

      <div className="mb-3">
        <FormControl size="small" fullWidth>
          <InputLabel>Line Style</InputLabel>
          <Select
            value={selectedShape.lineStyle}
            onChange={(e) => handlePropertyChange('lineStyle', e.target.value)}
            label="Line Style"
          >
            <MenuItem value="solid">Solid</MenuItem>
            <MenuItem value="dashed">Dashed</MenuItem>
          </Select>
        </FormControl>
      </div>
    </Box>
  );
};

export default PropertiesPanel; 