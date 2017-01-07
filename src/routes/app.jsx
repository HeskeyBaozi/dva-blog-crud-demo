'use strict';

import React, {PropTypes} from 'react';
import {connect} from 'dva';
import Login from './Login';
import MainLayout from '../components/MainLayout/MainLayout';

const App = ({
    children,
    location,
    dispatch,
    loading,
    app
}) => {
    const {isLogin} = app;

    const LoginProps = {
        loading,
        commit: data => dispatch({type: 'app/auth', payload: data})
    };

    return (
        <div>
            {isLogin
                ? <MainLayout/>
                : <Login {...LoginProps}/>
            }
        </div>
    );
};

App.propTypes = {
    children: PropTypes.element,
    location: PropTypes.object,
    dispatch: PropTypes.func
};

export default connect((state, ownProps) => {
    return {
        loading: state.loading.models.app,
        app: state.app
    };
})(App)
