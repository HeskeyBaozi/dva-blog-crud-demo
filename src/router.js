import React from 'react';
import {Router, Route, IndexRoute, IndexRedirect} from 'dva/router';
import App from './routes/app';
import Login from './routes/Login/Login';
import Register from './routes/Register/Register';
import PostsListPage from './routes/PostsListPage/PostsListPage';
import PostPage from "./routes/PostPage/PostPage";
import PostEditor from './routes/PostEditor/PostEditor';
import UserPage from './routes/UserPage/UserPage';

function RouterConfig({history, app}) {
    function requireAuth(nextState, replace, callback) {
        app._store.dispatch({
            type: 'app/enterAuth',
            payload: {},
            onComplete: callback
        });
    }

    function requirePrepared(nextState, replace, callback) {
        app._store.dispatch({
            type: 'posts/displayPost',
            payload: {post_id: nextState.params.post_id},
            onComplete: callback
        });
    }


    function requireEditorPrepared(nextState, replace, callback) {
        const post_id = nextState.params.post_id;
        if (post_id) {
            app._store.dispatch({
                type: 'editor/initializeEditor',
                payload: {post_id},
                onComplete: callback
            });
        } else {
            app._store.dispatch({
                type: 'editor/initializeCreator',
                payload: {},
                onComplete: callback
            });
        }
    }

    return (
        <Router history={history}>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/" breadcrumbName="Home" component={App} onEnter={requireAuth}>
                <IndexRedirect to="posts"/>
                <Route path="posts" breadcrumbName="Posts" component={PostsListPage}/>
                <Route path="posts/:post_id"
                       breadcrumbName="Post Detail"
                       onEnter={requirePrepared}
                       component={PostPage}/>
                <Route path="editor" breadcrumbName="Editor - Create Post" component={PostEditor}
                       onEnter={requireEditorPrepared}/>
                <Route path="editor/:post_id" breadcrumbName="Editor - Edit Post" component={PostEditor}
                       onEnter={requireEditorPrepared}/>
                <Route path="user" breadcrumbName="User Detail" component={UserPage}/>
            </Route>
            <Route path="*" breadcrumbName="Not Found" component={props => <h1>Oops! Not Found</h1>}/>
        </Router>
    );
}

export default RouterConfig;
