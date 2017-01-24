import {
    fetchContent,
    fetchPostInfo,
} from '../services/posts';

export default {
    namespace: 'editor',
    state: {
        post: {
            title: null,
            post_id: null,
            content: '',
            author: {},
            created_at: null
        },
        isCreator: false
    },
    subscriptions: {},
    effects: {
        initializeEditor: function *({payload, onComplete}, {call, put}) {
            const {post_id} = payload;
            const {data} = yield call(fetchPostInfo, {post_id});
            if (data) {
                yield put({
                    type: 'saveEditorInitialValue',
                    payload: {post: data}
                });
                onComplete(); // Enter the Editor Component
                yield put({type: 'initializeEditorContent'});
            }
        },
        initializeEditorContent: function*({payload}, {call, put, select}) {
            const post_id = yield select(state => state.editor.post.post_id);
            const {data} = yield call(fetchContent, {post_id});
            if (data) {
                const {content} = data;
                yield put({
                    type: 'saveEditorInitialContent',
                    payload: {content}
                });
            }
        },
        initializeCreator: function *({onComplete}, {put}) {
            yield put({type: 'saveCreatorInitialValue'});
            onComplete();
        }
    },
    reducers: {
        saveEditorInitialValue: function (state, {payload}) {
            const {post} = payload;
            return {
                ...state,
                post: {
                    ...state.post,
                    ...post
                },
                isCreator: false
            };
        },
        saveEditorInitialContent: function (state, {payload}) {
            const {content} = payload;
            return {
                ...state,
                post: {
                    ...state.post,
                    content
                }
            };
        },
        saveCreatorInitialValue: function (state, {payload}) {
            return {
                isCreator: true
            };
        }
    }
}
