import React from 'react';
import {Router, Route, IndexRoute} from 'dva/router';
import App from './routes/app';

function RouterConfig({history, app}) {
    return (
        <Router history={history}>
            <Route path="/" component={App}>
                <div><h2>Logged!!!</h2></div>
            </Route>
        </Router>
    );
}

export default RouterConfig;
