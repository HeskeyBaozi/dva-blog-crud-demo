import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {Icon, Row, Col, Tabs, Affix} from 'antd';
import normalAvatar from '../../assets/genji.jpg';
import superAvatar from '../../assets/hanzo.jpg';
import PostsListBody from '../../components/PostsListBody/PostsListBody';
import styles from './UserPage.less';

function UserPage({
    currentAccount,
    postsList,
    paging,
    dispatch,
    loadingUserPostList
}) {
    const isSuper = currentAccount.ability === 'super';
    return (
        <div>
            <Row className={styles.mainContainer}>
                <Col span={8} xs={0} sm={8} md={8} lg={8}>
                    <div className={styles.title}>
                        <h1><Icon type="user" className={styles.icon}/>User</h1>
                    </div>
                    <Affix offsetTop={40}>
                        <img src={isSuper ? superAvatar : normalAvatar} alt="avatar" className={styles.avatar}/>
                        <div className={styles.cardContainer}>
                            <h1>{currentAccount.username}</h1>
                        </div>
                        <ul>
                            <li><Icon type="team" className={styles.icon}/>{currentAccount.ability} user</li>
                            <li><Icon type="mail" className={styles.icon}/>{currentAccount.email}</li>
                        </ul>
                    </Affix>
                </Col>
                <Col span={16} xs={24} sm={16} md={16} lg={16}>
                    <Tabs>
                        <Tabs.TabPane key="posts" tab={<span><Icon type="file-text"/>My Posts</span>}>
                            <PostsListBody
                                currentAccountUserId={currentAccount.user_id}
                                isSuper={currentAccount.ability === 'super'}
                                postsList={postsList}
                                loading={loadingUserPostList}
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
                                        type: 'fetchPostsListForUser',
                                        payload: {
                                            pageInfo: {limit: paging.per_page, page: paging.page},
                                            keyword
                                        }
                                    });
                                }}
                                onTableChange={nextPaginationState => {
                                    dispatch({
                                        type: 'posts/fetchPostsListForUser',
                                        payload: {
                                            pageInfo: {
                                                limit: nextPaginationState.pageSize,
                                                page: nextPaginationState.current
                                            }
                                        }
                                    });
                                }}/>
                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
}

UserPage.propTypes = {
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
        loadingUserPostList: state.loading.effects['posts/fetchPostsListForUser']
    };
}
export default connect(mapStateToProps)(UserPage)