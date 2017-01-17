import dva from 'dva';
import {message} from 'antd';
import createLoading from 'dva-loading';
import './index.html';
import './index.less';

// 1. Initialize
const app = dva({
    onError(e, dispatch) {
        dispatch({type: 'app/logout'});
        if (e.message === 'Unauthorized') {
            message.info('Please Login :)', 5);
        } else {
            message.error(e.message, 5);
        }
    }
});

// 2. Plugins
app.use(createLoading());

// 3. Model

app.model(require("./models/app"));
app.model(require('./models/posts'));
// 4. Router

app.router(require('./router'));

// 5. Start
app.start('#root');
