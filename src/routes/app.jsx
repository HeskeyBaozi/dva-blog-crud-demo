'use strict';

import React, {PropTypes} from 'react';
import {connect} from 'dva';
import MainLayout from '../components/MainLayout/MainLayout';

const App = ({
    children,
    location,
    dispatch,
    loading,
    routes,
    params,
    app
}) => {
    const {isLogin} = app;

    const mainLayoutProps = {
        routes,
        params
    };

    return (
        <div>
            {isLogin ? <MainLayout {...mainLayoutProps}>{children}</MainLayout> : null}
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
})(App);