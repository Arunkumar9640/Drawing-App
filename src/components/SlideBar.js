import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSlide, setCurrentSlide, deleteSlide } from '../store/drawingSlice';
import { Button, Box, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const SlideBar = () => {
  const dispatch = useDispatch();
  const { slides, currentSlideIndex } = useSelector((state) => state.drawing);

  return (
    <Box className="flex items-center gap-2 px-6 py-2 bg-gray-100 border-b border-gray-200">
      {slides.map((_, idx) => (
        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
          <Button
            variant={currentSlideIndex === idx ? 'contained' : 'outlined'}
            color={currentSlideIndex === idx ? 'primary' : 'default'}
            size="small"
            onClick={() => dispatch(setCurrentSlide(idx))}
            style={{ position: 'relative', paddingRight: 24 }}
          >
            {idx + 1}
            {slides.length > 1 && (
              <span
                onClick={e => {
                  e.stopPropagation();
                  dispatch(deleteSlide(idx));
                }}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  background: 'transparent',
                  color: '#888',
                  fontWeight: 'bold',
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={e => {
                  e.target.style.background = '#f87171';
                  e.target.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#888';
                }}
                title="Delete this canvas"
              >
                ×
              </span>
            )}
          </Button>
        </div>
      ))}
      <IconButton color="primary" onClick={() => dispatch(addSlide())} size="small">
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default SlideBar; 