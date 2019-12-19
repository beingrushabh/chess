import React, { useCallback } from 'react';
import Canvas from '../../components/content/Canvas';
import { useSelector, useDispatch } from 'react-redux';
import { clickPieceThunk } from '../../modules/canvas';

const CanvasContainer = () => {
    const { board, clicked } = useSelector(({ canvas }) => ({
        board: canvas.board,
        clicked: canvas.clicked,
    }));

    const dispatch = useDispatch();
    
    const onClick = useCallback((y, x) => {
        dispatch(clickPieceThunk({board, clicked, y, x, turn: 1}));
    }, [dispatch, board, clicked]);

    return (
        <Canvas
            board={board}
            onClick={onClick}
        />
    )
};

export default CanvasContainer;