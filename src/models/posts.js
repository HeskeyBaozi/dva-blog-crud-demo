import {fetchPosts, fetchContent} from '../services/posts';
import pathToRegExp from 'path-to-regexp';

export default {
    namespace: 'posts',
    state: {
        postsList: [],
        paging: {},
        postsById: {}
    },
    subscriptions: {
        setup: function ({history, dispatch}) {
            history.listen(location => {
                if (['/posts'].includes(location.pathname)) {
                    dispatch({
                        type: 'fetchPostsList',
                        payload: {
                            pageInfo: {
                                limit: 5,
                                page: 1
                            }
                        }
                    });
                }

                const match = pathToRegExp('/posts/:post_id').exec(location.pathname);
                if (match) {
                    const post_id = match[1];
                    dispatch({
                        type: 'fetchPostContent',
                        payload: {post_id}
                    });
                }
            });
        }
    },
    effects: {
        fetchPostsList: function *({payload}, {call, put}) {
            const {pageInfo} = payload;
            const {data:list} = yield call(fetchPosts, {pageInfo});

            if (list) {
                yield put({
                    type: 'savePostsList',
                    payload: list
                });
            }
        },
        fetchPostContent: function*({payload}, {call, put}) {
            const {post_id} = payload;
            const {data} = yield call(fetchContent, {post_id});

            if (data) {
                const {content} = data;
                yield put({
                    type: 'savePostContent',
                    payload: {content, post_id}
                });
            }
        }
    },
    reducers: {
        savePostsList: function (state, {payload}) {
            const {paging, data:list} = payload;

            const posts = list.reduce((memo, post) => {
                memo[post.post_id] = post;
                return memo;
            }, {});

            return {
                ...state,
                paging,
                postsList: list,
                postsById: {...state.postsById, ...posts}
            };
        },
        savePostContent: function (state, {payload}) {
            const {content, post_id} = payload;
            return {
                ...state,
                postsById: {...state.postsById, [post_id]: {...state.postsById[post_id], content}}
            }
        }
    }
}
