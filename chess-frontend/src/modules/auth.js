import { createAction, handleActions } from 'redux-actions';
import { connectNamespace } from '../lib/websocket/websocket';
import { takeEvery, fork, take, cancel } from 'redux-saga/effects';

import createRequestThunk, { createRequestActionTypes } from '../lib/createRequestThunk';
import * as authAPI from '../lib/api/auth';

const CONNECT_WEBSOCKET = 'auth/CONNECT_WEBSOCKET';
const DISCONNECT_WEBSOCKET = 'auth/DISCONNECT_WEBSOCKET';
export const connectWebsocket = createAction(CONNECT_WEBSOCKET);
export const disconnectWebsocket = createAction(DISCONNECT_WEBSOCKET);

const INITIALIZE_SOCKET = 'auth/INITIALIZE_SOCKET';
const INITIALIZE_VALUE = 'auth/INITIALIZE_VALUE';
export const initializeSocket = createAction(INITIALIZE_SOCKET, payload => payload);
export const initializeValue = createAction(INITIALIZE_VALUE, payload => payload);

const [ SET_SESSION, SET_SESSION_SUCCESS, SET_SESSION_FAILURE ] = createRequestActionTypes('auth/SET_SESSION');
export const setSessionThunk = createRequestThunk(SET_SESSION, authAPI.getSession);

function* connectWebsocketSaga (action) {
    const key = action.payload;
        
    const query = `key=${key}`;
    
    const socketTask = yield fork(connectNamespace, {
        url: '/auth',
        initializeSocket,
        initializeValue,
        query,
    });
    
    yield take(DISCONNECT_WEBSOCKET);
    yield cancel(socketTask);
}

export function* authSaga () {
    yield takeEvery(CONNECT_WEBSOCKET, connectWebsocketSaga);
}

//  session 정보와 socket정보가 혼재되어 있는 reducer
//  tempAuth의 경우 key로 소켓마다 가지고 있는 정보
const initialState = {
    socket: null,
    tempAuth: null,
    session: null,
    error: null,
};

export default handleActions({
    [INITIALIZE_SOCKET]: (state, { payload: { socket } }) => ({
        ...state,
        socket,
    }),
    [INITIALIZE_VALUE]: (state, { payload: { type, ...rest} }) => ({
        ...state,
        tempAuth: { ...rest },
    }),
    [SET_SESSION_SUCCESS]: (state, { payload: session }) => ({
        ...state,
        session,
    }),
    [SET_SESSION_FAILURE]: (state, { payload: error }) => ({
        ...state,
        session: null,
        error,
    }),
}, initialState);