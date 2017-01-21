'use strict';

import {auth, fetchUser} from '../services/app';
import {routerRedux} from 'dva/router';
import {storageTokenKey} from '../utils/constant';
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
        }
    },
    subscriptions: {},
    effects: {
        auth: function *({payload}, {call, put}) {
            const {username, password} = payload;
            try {
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
            } catch (error) {
                message.error('Wrong Username or Password.. :(', 4);
            }
        },
        enterAuth: function*({payload, onComplete}, {put, take}) {
            yield [put({type: 'checkToken'}), put({type: 'queryUser'})];
            yield [take('app/hasToken'), take('app/queryUserSuccess')];
            onComplete();
        },
        checkToken: function*({payload}, {put, call, select}) {
            // get the token from local storage.
            const token = window.localStorage.getItem(storageTokenKey);
            if (token) {
                yield put({type: 'hasToken'});
            } else {
                yield put({type: 'authFail'});
            }
        },
        logout: function *({payload}, {put}) {
            yield put({type: 'authFail'});
            window.localStorage.removeItem(storageTokenKey);
            yield put(routerRedux.push('/login'));
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
