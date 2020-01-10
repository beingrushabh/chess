import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../components/common/Header';
import { connectWebsocket } from '../../modules/room';
import { logoutThunk, clearField } from '../../modules/auth';
import { withRouter } from 'react-router-dom';

const HeaderContainer = ({ history }) => {
    const { session, auth } = useSelector(({ auth }) => ({
        session: auth.session,
        auth: auth.auth,
    }));
    const dispatch = useDispatch();

    const [ openModal, setOpenModal ] = useState(false);

    const onToggle = useCallback(() => {
        setOpenModal(true);
        dispatch(connectWebsocket());
    }, [dispatch]);

    const onLogout = useCallback(() => {
        dispatch(logoutThunk());
    }, [dispatch]);
    
    const onRecord = useCallback(() => {
        alert('onRecord');
    }, []);
    
    //  link 태그로 단순히 넘어갈 경우 dispatch전에 라우팅이 먼저 넘어가기 때문에
    //  onClick으로 받아 dispatch를 마치고 routing이 넘어가도록 변경
    const onLogin = useCallback(() => {
        dispatch(clearField({ form: 'login' }));
        history.push('/login');
    }, [dispatch, history]);

    return (
        <Header
            onToggle={onToggle}
            openModal={openModal}
            setOpenModal={setOpenModal}
            onRecord={onRecord}
            onLogout={onLogout}
            onLogin={onLogin}
            session={session}
            auth={auth}
        />
    );
};

export default withRouter(HeaderContainer);