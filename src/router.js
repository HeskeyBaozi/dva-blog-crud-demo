import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect} from 'dva/router';
import App from './routes/app';
import Login from './routes/Login';
import Register from './routes/Register';
import PostList from './routes/PostList';

function RouterConfig({history, app}) {

    return (
        <Router history={history}>
            <Route path="/" breadcrumbName="Home" component={App}>
                <IndexRedirect to="posts"/>
                <Route path="posts" breadcrumbName="Posts" component={PostList}/>
            </Route>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
        </Router>
    );
}

export default RouterConfig;
