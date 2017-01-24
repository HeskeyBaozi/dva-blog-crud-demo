import React, {PropTypes} from 'react';
import {connect} from 'dva';
import MainLayout from '../components/MainLayout/MainLayout';
import {message} from 'antd';

const App = ({
    children,
    dispatch,
    routes,
    params,
    isLogin,
    account
}) => {
    const mainLayoutProps = {
        routes,
        params,
        account,
        handleClickLogOut: function (e) {
            e.preventDefault();
            message.success('Log out successfully :)');
            dispatch({type: 'app/logout'});
        }
    };

    return isLogin ? <MainLayout {...mainLayoutProps}>{children}</MainLayout> : <div/>
};

App.propTypes = {
    children: PropTypes.element.isRequired,
    isLogin: PropTypes.bool.isRequired,
    routes: PropTypes.array.isRequired,
    params: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};


export default connect((state, ownProps) => {
    return {
        loading: state.loading.models.app,
        isLogin: state.app.isLogin,
        account: state.app.account
    };
})(App);