import {
    fetchPosts,
    setVisibilityOfPost,
    deletePost
} from '../services/posts';

import {
    fetchUserDetail
} from '../services/user';

import {message} from 'antd';
import {normalize, schema} from 'normalizr';

const post = new schema.Entity('posts', {}, {idAttribute: 'post_id'});

export default {
    namespace: 'profile',
    state: {
        account: {
            user_id: null,
            username: null,
            email: null,
            ability: null
        },
        posts: {
            list: [],
            paging: {},
            byId: {}
        }
    },
    effects: {
        initializeProfile: function*({payload, onComplete}, {put}) {
            const {user_id} = payload;
            yield put({type: 'saveUserId', payload: {user_id}});
            onComplete();
            yield [put({
                type: 'fetchPostsList',
                payload: {
                    pageInfo: {
                        limit: 5,
                        page: 1
                    }
                }
            }), put({type: 'fetchUserInfo'})];
        },
        fetchPostsList: function*({payload}, {call, put, select}) {
            const user_id = yield select(state => state.profile.account.user_id);
            const {pageInfo, keyword} = payload;
            const {data} = yield call(fetchPosts, {pageInfo, keyword, user_id});
            if (data) {
                yield put({
                    type: 'savePostsList',
                    payload: data
                });
            }
        },
        fetchUserInfo: function*({payload}, {call, put, select}) {
            const user_id = yield select(({profile}) => profile.account.user_id);
            const {data} = yield call(fetchUserDetail, {user_id});
            if (data) {
                yield put({
                    type: 'saveUserDetail',
                    payload: {user: data}
                });
            }
        },
        setPostVisibility: function*({payload}, {call, put}) {
            const {visible, post_id} = payload;
            const {data} = yield call(setVisibilityOfPost, {visible, post_id});
            if (data) {
                yield put({type: 'savePostVisibility', payload: {updatedPost: data}});
                message.success('set post visibility successfully :)');
            }
        },
        deletePost: function *({payload}, {call, put}) {
            const {post_id, paging} = payload;
            yield call(deletePost, {post_id});
            yield put({type: 'fetchPostsList', payload: {pageInfo: paging}});
            message.success('delete post successfully. :)');
        }
    },
    reducers: {
        saveUserId: function (state, {payload}) {
            const {user_id} = payload;
            return {
                ...state,
                account: {
                    ...state.account,
                    user_id
                }
            };
        },
        savePostsList: function (state, {payload}) {
            const {paging, data} = payload;
            const normalized = normalize(data, [post]);
            return {
                ...state,
                posts: {
                    ...state.posts,
                    paging,
                    list: normalized.result,
                    byId: normalized.entities.posts
                }
            };
        },
        saveUserDetail: function (state, {payload}) {
            const {user} = payload;
            return {
                ...state,
                account: {
                    ...state.account,
                    ...user
                }
            }
        },
        savePostVisibility: function (state, {payload}) {
            const {updatedPost} = payload;
            const {post_id} = updatedPost;
            return {
                ...state,
                posts: {
                    ...state.posts,
                    byId: {
                        ...state.posts.byId,
                        [post_id]: updatedPost
                    }
                }
            };
        }
    },
    subscriptions: {},
}
