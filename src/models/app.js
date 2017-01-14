'use strict';

import {auth, fetchUser} from '../services/app';
import {routerRedux} from 'dva/router';
import {message} from 'antd';
import {storageTokenKey} from '../utils/constant';

export default {
    namespace: 'app',
    state: {
        isLogin: false,
        account: {
            username: null,
            ability: null,
            user_id: null,
            email: null
        }
    },
    subscriptions: {
        setup: function ({history, dispatch}) {
            history.listen(location => {
                if (!['/login', '/register'].includes(location.pathname)) {
                    dispatch({type: 'checkToken'});
                }
            });
        }
    },
    effects: {
        auth: function *({payload}, {call, put}) {
            const {username, password} = payload;
            const {data} = yield call(auth, {username, password});

            // succeed to login
            if (data) {
                const {user, access_token} = data;
                const {token} = access_token;

                // save the token to the local storage.
                window.localStorage.setItem(storageTokenKey, token);
                yield put({
                    type: 'authSuccess',
                    payload: {account: user}
                });
                yield put(routerRedux.push('/posts'));
            }
        },
        checkToken: function*({payload}, {put, call, select}) {

            // get the token from local storage.
            const token = window.localStorage.getItem(storageTokenKey);
            if (token) {
                yield put({type: 'hasToken'});
                yield put({type: 'queryUser'});
            } else {
                yield put({type: 'authFail'});
            }
        },
        logout: function *({payload}, {put}) {
            yield put({type: 'authFail'});
            window.localStorage.removeItem(storageTokenKey);
            yield put(routerRedux.push('/login'));
            message.success('Log out successfully! :)');
        },
        queryUser: function *({payload}, {put, call}) {
            const {data} = yield call(fetchUser);
            if (data) {
                yield put({
                    type: 'queryUserSuccess',
                    payload: {
                        account: data
                    }
                })
            }
        }
    },
    reducers: {
        authSuccess: function (state, {payload}) {
            const {account} = payload;
            return {
                ...state,
                account,
                isLogin: true
            };
        },
        hasToken: function (state) {
            return {
                ...state,
                isLogin: true
            };
        },
        queryUserSuccess: function (state, {payload}) {
            const {account} = payload;
            return {
                ...state,
                account
            };
        },
        authFail: function (state) {
            return {
                ...state,
                isLogin: false,
                account: {
                    username: null,
                    ability: null,
                    user_id: null,
                    email: null
                }
            };
        }
    }

}
