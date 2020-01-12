import React from 'react';
import { useDispatch } from 'react-redux';

import useAsync from '../../lib/hook/useAsync';
import { setSessionThunk } from '../../modules/auth';
import GameLayout from '../../components/game/GameLayout';

import { connectWebsocket, disconnectWebsocket } from '../../modules/games';

const GameLayoutContainer = () => {
    const dispatch = useDispatch();

    const connection = async() => {
        await dispatch(setSessionThunk());
        
        dispatch(disconnectWebsocket());
        await Promise.resolve().then(() => {
            dispatch(connectWebsocket());
        });
        return true;
    };

    const [state] = useAsync(connection, [ dispatch ]);

    const { loading, data, error } = state;

    if(loading) return null;
    if(error) return null;
    if(data) {
        return (
            <GameLayout />
        )
    }
    return null;
};

export default GameLayoutContainer;