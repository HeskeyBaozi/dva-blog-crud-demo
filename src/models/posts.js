import {fetchPosts, fetchContent, fetchComments, createComment} from '../services/posts';
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

                    dispatch({
                        type: 'fetchPostComments',
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
        },
        fetchPostComments: function*({payload}, {call, put}) {
            const {post_id} = payload;
            const {data} = yield call(fetchComments, {post_id});
            if (data) {
                const {descendants} = data;
                yield put({
                    type: 'saveComments',
                    payload: {descendants, post_id}
                });
            }
        },
        createNewComment: function*({payload}, {call, put}) {
            const {commentInput, post_id} = payload;
            const {data:newComment} = yield call(createComment, {post_id, commentInput});
            if (newComment) {
                yield put({
                    type: 'pushNewComment',
                    payload: {newComment, post_id}
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
                postsById: {
                    ...state.postsById,
                    [post_id]: {...state.postsById[post_id], content}
                }
            };
        },
        saveComments: function (state, {payload}) {
            const {descendants, post_id} = payload;
            return {
                ...state,
                postsById: {
                    ...state.postsById,
                    [post_id]: {
                        ...state.postsById[post_id],
                        descendants
                    }
                }
            };
        },
        pushNewComment: function (state, {payload}) {
            const {newComment, post_id} = payload;
            const currentPost = state.postsById[post_id];
            return {
                ...state,
                postsById: {
                    ...state.postsById,
                    [post_id]: {
                        ...currentPost,
                        descendants: [...currentPost.descendants, newComment]
                    }

                }
            };
        }
    }
}
