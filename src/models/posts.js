import {fetchPosts, fetchContent, fetchComments, createComment, deleteComment} from '../services/posts';
import pathToRegExp from 'path-to-regexp';
import {message} from 'antd';

export default {
    namespace: 'posts',
    state: {
        postsList: [],
        paging: {},
        postsById: {},
        currentPost: {
            post_id: null,
            author: null,
            title: null,
            visible: null,
            created_at: null,
            descendants: [],
            content: null
        }
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
                        type: 'displayPost',
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
        displayPost: function*({payload}, {put}) {
            yield put({
                type: 'clearCurrentPostInfo'
            });
            const {post_id} = payload;
            yield put({
                type: 'saveCurrentPostInfo',
                payload: {post_id}
            });

            yield [
                put({type: 'fetchPostContent'}),
                put({type: 'fetchPostComments'})
            ];

        },
        fetchPostContent: function*({payload}, {call, put, select}) {
            const post_id = yield select(state => state.posts.currentPost.post_id);
            const {data} = yield call(fetchContent, {post_id});

            if (data) {
                const {content} = data;
                yield put({
                    type: 'savePostContent',
                    payload: {content}
                });
            }
        },
        fetchPostComments: function*({payload}, {call, put, select}) {
            const post_id = yield select(state => state.posts.currentPost.post_id);
            const {data} = yield call(fetchComments, {post_id});
            if (data) {
                const {descendants} = data;
                yield put({
                    type: 'saveComments',
                    payload: {descendants}
                });
            }
        },
        createNewComment: function*({payload}, {call, put, select}) {
            const post_id = yield select(state => state.posts.currentPost.post_id);
            const {commentInput} = payload;
            const {data:newComment} = yield call(createComment, {commentInput, post_id});
            if (newComment) {
                yield put({
                    type: 'pushNewComment',
                    payload: {newComment, post_id}
                });
                message.success('create comment successfully. :)');
            }
        },
        deleteComment: function*({payload}, {call, put, select}) {
            const ascendant = yield select(state => state.posts.currentPost.post_id);
            const {comment_id} = payload;
            yield call(deleteComment, {comment_id});
            yield put({
                type: 'removeComment',
                payload: {comment_id, ascendant}
            });
            message.success('Delete comment successfully. :)');
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
        clearCurrentPostInfo: function (state, {payload}) {
            return {
                ...state,
                currentPost: {
                    post_id: null,
                    author: null,
                    title: null,
                    visible: null,
                    created_at: null,
                    descendants: [],
                    content: null
                }
            };
        },
        saveCurrentPostInfo: function (state, {payload}) {
            const {post_id} = payload;
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    ...state.postsById[post_id]
                }
            };
        },
        savePostContent: function (state, {payload}) {
            const {content} = payload;
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    content
                }
            };
        },
        saveComments: function (state, {payload}) {
            const {descendants} = payload;
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    descendants
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
                        descendants: [...currentPost.descendants, newComment.comment_id]
                    }
                },
                currentPost: {
                    ...state.currentPost,
                    descendants: [...state.currentPost.descendants, newComment]
                }
            };
        },
        removeComment: function (state, {payload}) {
            const {comment_id, ascendant} = payload;
            const currentPost = state.postsById[ascendant];
            return {
                ...state,
                postsById: {
                    ...state.postsById,
                    [ascendant]: {
                        ...currentPost,
                        descendants: currentPost.descendants.filter(comment => comment !== comment_id)
                    }
                },
                currentPost: {
                    ...state.currentPost,
                    descendants: state.currentPost.descendants.filter(comment => comment.comment_id !== comment_id)
                }
            };
        }
    }
}
