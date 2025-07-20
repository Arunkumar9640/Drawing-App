import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSlide, setCurrentSlide } from '../store/drawingSlice';
import { Button, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const SlideBar = () => {
  const dispatch = useDispatch();
  const { slides, currentSlideIndex } = useSelector((state) => state.drawing);

  return (
    <Box className="flex items-center gap-2 px-6 py-2 bg-gray-100 border-b border-gray-200">
      {slides.map((_, idx) => (
        <Button
          key={idx}
          variant={currentSlideIndex === idx ? 'contained' : 'outlined'}
          color={currentSlideIndex === idx ? 'primary' : 'default'}
          size="small"
          onClick={() => dispatch(setCurrentSlide(idx))}
        >
          {idx + 1}
        </Button>
      ))}
      <IconButton color="primary" onClick={() => dispatch(addSlide())} size="small">
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default SlideBar; 