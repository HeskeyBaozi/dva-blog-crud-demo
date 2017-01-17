import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect} from 'dva/router';
import App from './routes/app';
import Login from './routes/Login/Login';
import Register from './routes/Register/Register';
import PostList from './routes/PostList/PostList';
import PostPage from "./routes/PostPage/PostPage";

function RouterConfig({history, app}) {

    return (
        <Router history={history}>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/" breadcrumbName="Home" component={App}>
                <IndexRedirect to="posts"/>
                <Route path="posts" breadcrumbName="Posts" component={PostList}/>
                <Route path="posts/:post_id" breadcrumbName="Post Detail" component={PostPage}/>
                <Route path="*" breadcrumbName="Not Found" component={props => <h1>Oops! Not Found</h1>}/>
            </Route>
        </Router>
    );
}

export default RouterConfig;
