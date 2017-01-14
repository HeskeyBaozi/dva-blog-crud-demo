import {fetchPosts} from '../services/posts';


export default {
    namespace: 'posts',
    state: {
        postsList: [],
        paging: {}
    },
    subscriptions: {
        setup: function ({history, dispatch}) {
            history.listen(location => {
                if (['/posts'].includes(location.pathname)) {
                    dispatch({
                        type: 'queryPosts',
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
        queryPosts: function *({payload}, {call, put, select}) {
            const {pageInfo} = payload;
            const {data, err} = yield call(fetchPosts, {
                token: yield select(state => state.app.token),
                pageInfo
            });

            if (data) {
                yield put({
                    type: 'queryPostsSuccess',
                    payload: data
                })
            }
        }
    },
    reducers: {
        queryPostsSuccess: function (state, {payload}) {
            const {paging, data} = payload;
            return {
                ...state,
                paging,
                postsList: data
            };
        }
    }
}
