import pathToRegExp from 'path-to-regexp';
import {message} from 'antd';
import {routerRedux} from 'dva/router';

import {
    fetchPosts,
    fetchContent,
    fetchComments,
    createPost,
    fetchPostInfo,
    deletePost,
    patchPost,
    setVisibilityOfPost
} from '../services/posts';
import {
    createComment,
    deleteComment,
    patchComment,
    setVisibilityOfComment
} from '../services/comments';


export default {
    namespace: 'posts',
    state: {
        postsList: [],
        paging: {},
        current: {
            post: {
                post_id: null,
                author: {},
                title: null,
                visible: false,
                created_at: null,
                descendants: [],
                content: null
            }
        },
        editor: {
            post: {
                title: null,
                post_id: null,
                content: '',
                author: {},
                created_at: null
            }
        }
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

                if (pathToRegExp('/user').exec(location.pathname)) {
                    dispatch({
                        type: 'fetchPostsListForUser',
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
        fetchPostsListForUser: function*({payload}, {call, put, select}) {
            const user_id = yield select(state => state.app.account.user_id);
            const {pageInfo, keyword} = payload;
            const {data:list} = yield call(fetchPosts, {pageInfo, keyword, user_id});

            if (list) {
                yield put({
                    type: 'savePostsList',
                    payload: list
                });
            }
        },
        displayPost: function*({payload, onComplete}, {put, call, select}) {
            yield put({
                type: 'clearCurrentPostInfo'
            });
            const {post_id} = payload;
            const {data} = yield call(fetchPostInfo, {post_id});
            if (data) {
                yield put({
                    type: 'saveCurrentPostInfo',
                    payload: {postInfo: data}
                });
                onComplete();
                yield [
                    put({type: 'fetchPostContent'}),
                    put({type: 'fetchPostComments'})
                ];
            }
        },
        fetchPostContent: function*({payload}, {call, put, select}) {
            const post_id = yield select(state => state.posts.current.post.post_id);
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
            const post_id = yield select(state => state.posts.current.post.post_id);
            const {data} = yield call(fetchComments, {post_id});
            if (data) {
                const {descendants} = data;
                yield put({
                    type: 'saveComments',
                    payload: {descendants}
                });
            }
        },
        patchPost: function *({payload}, {call, put}) {
            const {title, content, post_id} = payload;
            const {data:updatedPost} = yield call(patchPost, {title, content, post_id});
            if (updatedPost) {
                message.success('patch post successfully :)');
                yield put(routerRedux.push(`/posts/${post_id}`));
            }
        },
        setPostVisibility: function*({payload}, {call, put, select}) {
            const {visible, post_id} = payload;
            const {data:updatedPost} = yield call(setVisibilityOfPost, {visible, post_id});
            if (updatedPost) {
                yield put({type: 'savePostVisibility', payload: {updatedPost}});
                const currentPostId = yield select(state => state.posts.current.post.post_id);
                if (currentPostId === post_id) {
                    yield put({type: 'saveCurrentPostVisibility', payload: {updatedPost}});
                }
                message.success('set post visibility successfully :)');
            }
        },
        setCommentVisibility: function*({payload}, {call, put}) {
            const {visible, comment_id} = payload;
            const {data:updatedComment} = yield call(setVisibilityOfComment, {visible, comment_id});
            if (updatedComment) {
                yield put({
                    type: 'saveCommentVisibility', payload: {updatedComment}
                });
                message.success('set comment visibility successfully :)');
            }
        },
        createNewPost: function*({payload}, {call, put}) {
            const {title, content} = payload;
            const {data} = yield call(createPost, {title, content});

            if (data) {
                const {post_id} = data;
                message.success('create post successfully :)');
                yield put(routerRedux.push(`/posts/${post_id}`));
            }
        },
        deletePost: function *({payload}, {call, put}) {
            const {post_id, paging} = payload;
            yield call(deletePost, {post_id});
            yield put({type: 'fetchPostsList', payload: {pageInfo: paging}});
            message.success('delete post successfully. :)');
        },
        createNewComment: function*({payload}, {call, put, select}) {
            const post_id = yield select(state => state.posts.current.post.post_id);
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
            const ascendant = yield select(state => state.posts.current.post_id);
            const {comment_id} = payload;
            yield call(deleteComment, {comment_id});
            yield put({
                type: 'removeComment',
                payload: {comment_id, ascendant}
            });
            message.success('Delete comment successfully. :)');
        },
        patchComment: function *({payload, onComplete}, {call, put, select}) {
            const {comment_id, editorContent} = payload;
            const {data} = yield call(patchComment, {comment_id, editorContent});
            if (data) {
                yield put({type: 'saveUpdatedComment', payload: {updatedComment: data}});
                onComplete();
                message.success('Update comment successfully. :)');
            }
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
        clearCurrentPostInfo: function (state, {payload}) {
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        post_id: null,
                        author: {},
                        title: null,
                        visible: false,
                        created_at: null,
                        descendants: [],
                        content: null
                    }
                }
            };
        },
        saveCurrentPostInfo: function (state, {payload}) {
            const {postInfo} = payload;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        ...postInfo
                    }
                }
            };
        },
        savePostContent: function (state, {payload}) {
            const {content} = payload;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        content
                    }
                }
            };
        },
        saveComments: function (state, {payload}) {
            const {descendants} = payload;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        descendants
                    }
                }
            };
        },
        pushNewComment: function (state, {payload}) {
            const {newComment} = payload;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        descendants: [...state.current.post.descendants, newComment]
                    }
                }
            };
        },
        removeComment: function (state, {payload}) {
            const {comment_id, ascendant} = payload;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        descendants: state.current.post.descendants.filter(comment => comment.comment_id !== comment_id)
                    }
                }
            };
        },
        saveUpdatedComment: function (state, {payload}) {
            const {updatedComment} = payload;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        descendants: state.current.post.descendants.map(comment => {
                            if (comment.comment_id === updatedComment.comment_id) {
                                return updatedComment;
                            }
                            return comment;
                        })
                    }
                }
            }
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
        },
        saveCurrentPostVisibility: function (state, {payload}) {
            const {updatedPost} = payload;
            const {visible} = updatedPost;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        visible
                    }
                }
            };
        },
        saveCommentVisibility: function (state, {payload}) {
            const {updatedComment} = payload;
            const {comment_id} = updatedComment;
            return {
                ...state,
                current: {
                    ...state.current,
                    post: {
                        ...state.current.post,
                        descendants: state.current.post.descendants.map(comment => {
                            return comment.comment_id === comment_id ? updatedComment : comment;
                        })
                    }
                }
            };
        }
    }
}
