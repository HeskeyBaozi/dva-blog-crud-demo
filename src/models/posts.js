import pathToRegExp from 'path-to-regexp';
import {normalize, schema, denormalize} from 'normalizr';
import {message} from 'antd';

import {
    fetchPosts,
    deletePost,
    setVisibilityOfPost
} from '../services/posts';

export default {
    namespace: 'posts',
    state: {
        postsList: [],
        paging: {}
    },
    subscriptions: {
        setup: function ({history, dispatch}) {
            history.listen(location => {
                if (pathToRegExp('/posts').exec(location.pathname)) {
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
            });
        }
    },
    effects: {
        fetchPostsList: function *({payload}, {call, put}) {
            const {pageInfo, keyword} = payload;
            const {data:list} = yield call(fetchPosts, {pageInfo, keyword});

            if (list) {
                yield put({
                    type: 'savePostsList',
                    payload: list
                });
            }
        },
        setPostVisibility: function*({payload}, {call, put, select}) {
            const {visible, post_id} = payload;
            const {data} = yield call(setVisibilityOfPost, {visible, post_id});
            if (data) {
                yield put({type: 'savePostVisibility', payload: {updatedPost: data}});
                const currentPostId = yield select(({post_detail}) => post_detail.currentPost.post_id);
                if (currentPostId === post_id) {
                    yield put({type: 'post_detail/saveCurrentPostVisibility', payload: {updatedPost: data}});
                }
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
        savePostsList: function (state, {payload}) {
            const {paging, data:list} = payload;
            return {
                ...state,
                paging,
                postsList: list
            };
        },
        deletePostSuccess: function (state, {payload}) {
            const {post_id} = payload;
            const list = state.postsList.filter(post => post.post_id !== post_id);
            return {
                ...state,
                postsList: list
            };
        },
        savePostVisibility: function (state, {payload}) {
            const {updatedPost} = payload;
            const {post_id} = updatedPost;
            return {
                ...state,
                postsList: state.postsList.map(post => {
                    return post_id === post.post_id ? updatedPost : post;
                })
            };
        }
    }
}
