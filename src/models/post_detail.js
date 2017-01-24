import {normalize, schema, denormalize} from 'normalizr';
import {message} from 'antd';

import {
    fetchPostInfo,
    fetchContent,
    fetchComments
} from '../services/posts';

import {
    createComment,
    deleteComment,
    patchComment,
    setVisibilityOfComment
} from '../services/comments';

const comment = new schema.Entity('comments', {}, {idAttribute: 'comment_id'});

export default {
    namespace: 'post_detail',
    state: {
        currentPost: {
            post_id: null,
            author: {
                user_id: null,
                username: null
            },
            title: null,
            visible: false,
            created_at: null,
            descendants: [],
            content: ''
        },
        commentsById: {}
    },
    subscriptions: {},
    effects: {
        initializePostDetail: function*({payload, onComplete}, {put, call}) {
            yield put({type: 'clear'});
            const {post_id} = payload;
            const {data} = yield call(fetchPostInfo, {post_id});
            if (data) {
                yield put({
                    type: 'saveInitialPostDetailInfo',
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
            const post_id = yield select(state => state.post_detail.currentPost.post_id);
            const {data} = yield call(fetchContent, {post_id});

            if (data) {
                const {content} = data;
                yield put({
                    type: 'saveCurrentPostContent',
                    payload: {content}
                });
            }
        },
        fetchPostComments: function*({payload}, {call, put, select}) {
            const post_id = yield select(state => state.post_detail.currentPost.post_id);
            const {data} = yield call(fetchComments, {post_id});
            if (data) {
                const {descendants} = data;
                yield put({
                    type: 'saveCurrentComments',
                    payload: {descendants}
                });
            }
        },
        createComment: function*({payload}, {call, put, select}) {
            const post_id = yield select(({post_detail}) => post_detail.currentPost.post_id);
            const {commentInput} = payload;
            const {data} = yield call(createComment, {commentInput, post_id});
            if (data) {
                yield put({
                    type: 'saveCreatedComment',
                    payload: {newComment: data}
                });
                message.success('create comment successfully. :)');
            }
        },
        deleteCommentById: function*({payload}, {call, put, select}) {
            const {comment_id} = payload;
            yield call(deleteComment, {comment_id});
            yield put({type: 'fetchPostComments'});
            message.success('Delete comment successfully. :)');
        },
        patchCommentById: function *({payload, onComplete}, {call, put, select}) {
            const {comment_id, updatedContent} = payload;
            const {data} = yield call(patchComment, {comment_id, updatedContent});
            if (data) {
                onComplete();
                yield put({
                    type: 'savePatchedComment',
                    payload: {patchedComment: data}
                });
                message.success('Update comment successfully. :)');
            }
        },
        setCommentVisibilityById: function*({payload}, {call, put}) {
            const {visible, comment_id} = payload;
            const {data} = yield call(setVisibilityOfComment, {visible, comment_id});
            if (data) {
                yield put({
                    type: 'savePatchedComment',
                    payload: {patchedComment: data}
                });
                message.success('set comment visibility successfully :)');
            }
        }
    },
    reducers: {
        clear: function (state, {payload}) {
            return {
                currentPost: {
                    post_id: null,
                    author: {
                        user_id: null,
                        username: null
                    },
                    title: null,
                    visible: false,
                    created_at: null,
                    descendants: [],
                    content: ''
                },
                commentsById: {}
            };
        },
        saveInitialPostDetailInfo: function (state, {payload}) {
            const {postInfo} = payload;
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    ...postInfo
                }
            };
        },
        saveCurrentComments: function (state, {payload}) {
            const {descendants} = payload;
            const normalized = normalize(descendants, [comment]);
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    descendants: normalized.result
                },
                commentsById: normalized.entities.comments || {}
            };
        },
        saveCurrentPostContent: function (state, {payload}) {
            const {content} = payload;
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    content
                }
            };
        },
        saveCurrentPostVisibility: function (state, {payload}) {
            const {updatedPost} = payload;
            const {visible} = updatedPost;
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    visible
                }
            };
        },
        saveCreatedComment: function (state, {payload}) {
            const {newComment} = payload;
            const {comment_id} = newComment;
            const denormalized = denormalize(state.currentPost.descendants, [comment], {comments: state.commentsById});
            return {
                ...state,
                currentPost: {
                    ...state.currentPost,
                    descendants: [...state.currentPost.descendants, comment_id]
                },
                commentsById: normalize([...denormalized, newComment], [comment]).entities.comments
            };
        },
        savePatchedComment: function (state, {payload}) {
            const {patchedComment} = payload;
            const {comment_id} = patchedComment;
            return {
                ...state,
                commentsById: {
                    ...state.commentsById,
                    [comment_id]: patchedComment
                }
            };
        }
    }
}
