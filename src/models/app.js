'use strict';

import {auth, verifyToken} from '../services/app';
import {routerRedux} from 'dva/router';
import {message} from 'antd';


export default {
    namespace: 'app',
    state: {
        isLogin: false,
        account: {
            username: null,
            ability: null,
            user_id: null,
            email: null
        },
        token: null
    },
    subscriptions: {
        setup: function ({history, dispatch}) {
            history.listen(location => {
                if (!['/login', '/register'].includes(location.pathname)) {
                    dispatch({type: 'queryAuth'});
                }
            });
        }
    },
    effects: {
        auth: function *({payload}, {call, put}) {
            const result = yield call(auth, payload);

            // succeed to login
            if (result.data) {
                const {user, access_token} = result.data;
                const {token} = access_token;
                window.localStorage.setItem('blogDemoToken', token);
                yield put({
                    type: 'authSuccess',
                    payload: {account: user, token}
                });
                yield put(routerRedux.push('/'));
            } else {

                // fail to login
                message.error('Wrong UserName or Password. Please Try Again!', 3);
                yield put({type: 'authFail', payload: result.err});
            }
        },
        queryAuth: function*({payload}, {put, call, select}) {
            const token = window.localStorage.getItem('blogDemoToken');
            if (token) {
                yield put({type: 'verifySuccess', payload: {token}});
            } else {
                yield put({type: 'verifyFail'});
            }
            const isLogin = yield select(state => state.app.isLogin);
            if (!isLogin) {
                yield put(routerRedux.push('/login'));
            }
        }
    },
    reducers: {
        authSuccess: function (state, {payload}) {
            const {account, token} = payload;
            return {
                ...state,
                ...account,
                token,
                isLogin: true
            };
        },
        verifySuccess: function (state, {payload}) {
            const {token} = payload;
            return {
                ...state,
                token,
                isLogin: true
            }
        },
        authFail: function (state) {
            return {
                ...state,
                token: null,
                isLogin: false,
            };
        },
        verifyFail: function (state) {
            return {
                ...state,
                token: null,
                isLogin: false
            }
        }
    }

}
