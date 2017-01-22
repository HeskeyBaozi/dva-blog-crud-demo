import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import styles from './PostsListPage.css';
import {Button, Icon} from 'antd';
import PostsListBody from '../../components/PostsListBody/PostsListBody';

function PostsListPage({
    currentAccount,
    postsList,
    paging,
    dispatch,
    loadingPostsList
}) {
    return (
        <div>
            <div className={styles.title}>
                <Link to="/editor?type=creator">
                    <Button type="primary"
                            size="large"
                            icon="addfile"
                            className={styles.addPost}>
                        Add Post
                    </Button>
                </Link>
                <h1><Icon type="file-text" className={styles.icon}/>Posts</h1>
            </div>
            <PostsListBody
                currentAccountUserId={currentAccount.user_id}
                isSuper={currentAccount.ability === 'super'}
                postsList={postsList}
                loading={loadingPostsList}
                pagination={{
                    total: paging.total,
                    pageSize: paging.per_page,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10'],
                    showQuickJumper: true
                }}
                onDelete={({toDeletePostId}) => {
                    dispatch({
                        type: 'posts/deletePost',
                        payload: {
                            post_id: toDeletePostId,
                            paging: {limit: paging.per_page, page: paging.page}
                        }
                    });
                }}
                onChangeVisibility={(checked, {toSetVisiblePostId, toSetVisibleValue}) => {
                    dispatch({
                        type: 'posts/setPostVisibility',
                        payload: {
                            visible: toSetVisibleValue,
                            post_id: toSetVisiblePostId
                        }
                    });
                }}
                onSearch={keyword => {
                    dispatch({
                        type: 'posts/fetchPostsList',
                        payload: {
                            pageInfo: {limit: paging.per_page, page: paging.page},
                            keyword
                        }
                    });
                }}
                onTableChange={nextPaginationState => {
                    dispatch({
                        type: 'posts/fetchPostsList',
                        payload: {
                            pageInfo: {
                                limit: nextPaginationState.pageSize,
                                page: nextPaginationState.current
                            }
                        }
                    });
                }}/>
        </div>
    );
}

PostsListPage.propTypes = {
    currentAccount: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        ability: PropTypes.oneOf(['super', 'normal'])
    }).isRequired,
    postsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    paging: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};


function mapStateToProps(state, ownProps) {
    return {
        currentAccount: state.app.account,
        postsList: state.posts.postsList,
        paging: state.posts.paging,
        loadingPostsList: state.loading.effects['posts/fetchPostsList']
    };
}

export default connect(mapStateToProps)(PostsListPage);