'use strict';

import {auth} from '../services/app';

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
            dispatch({
                type: 'queryAuth',
                payload: {
                    token: localStorage.getItem('token')
                }
            });
        }
    },
    effects: {
        auth: function *({payload}, {call, put}) {
            const tokenData = yield call(auth, payload);
            if (tokenData.data) {
                const {user} = tokenData.data;
                yield put({
                    type: 'authSuccess',
                    payload: {
                        account: user
                    }
                });
            } else {
                yield put({type: 'authFail'});
            }
        },
        queryAuth: function ({p}) {
            console.log(p);
        }
    },
    reducers: {
        authSuccess: function (state, {payload}) {
            return {
                ...state,
                ...payload,
                isLogin: true
            };
        },
        authFail: function (state) {
            return {
                ...state,
                isLogin: false
            };
        }
    }

}
