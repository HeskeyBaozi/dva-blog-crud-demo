import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {Icon, Row, Col, Tabs, Affix, Spin} from 'antd';
import normalAvatar from '../../assets/genji.jpg';
import superAvatar from '../../assets/hanzo.jpg';
import PostsListBody from '../../components/PostsListBody/PostsListBody';
import styles from './UserPage.less';

function UserPage({
    currentAccount,
    account,
    postsList,
    paging,
    dispatch,
    loadingUserPostList,
    loadingUserInfo
}) {
    const isSuper = currentAccount.ability === 'super';
    const isSelf = currentAccount.user_id === account.user_id;
    return (
        <div>
            <Row className={styles.mainContainer}>
                <Col span={8} xs={0} sm={8} md={8} lg={8}>
                    <div className={styles.title}>
                        <h1><Icon type="user" className={styles.icon}/>{isSelf ? 'My ' : 'Other '}Profile</h1>
                    </div>
                    <Affix offsetTop={40}>
                        <Spin spinning={!!loadingUserInfo} tip="Loading...">
                            <img src={account.ability === 'super' ? superAvatar : normalAvatar} alt="avatar"
                                 className={styles.avatar}/>
                            <div className={styles.cardContainer}>
                                <h1>{account.username}</h1>
                            </div>
                            <ul>
                                <li><Icon type="team" className={styles.icon}/>{account.ability} user</li>
                                <li><Icon type="mail" className={styles.icon}/>{account.email}</li>
                            </ul>
                        </Spin>
                    </Affix>
                </Col>
                <Col span={16} xs={24} sm={16} md={16} lg={16}>
                    <Tabs>
                        <Tabs.TabPane key="posts"
                                      tab={<span><Icon type="file-text"/>{isSelf ? 'My ' : 'His or Her '}Posts</span>}>
                            <PostsListBody
                                currentAccountUserId={currentAccount.user_id}
                                isSuper={account.ability === 'super'}
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
                                        type: 'profile/deletePost',
                                        payload: {
                                            post_id: toDeletePostId,
                                            paging: {limit: paging.per_page, page: paging.page}
                                        }
                                    });
                                }}
                                onChangeVisibility={(checked, {toSetVisiblePostId, toSetVisibleValue}) => {
                                    dispatch({
                                        type: 'profile/setPostVisibility',
                                        payload: {
                                            visible: toSetVisibleValue,
                                            post_id: toSetVisiblePostId
                                        }
                                    });
                                }}
                                onSearch={keyword => {
                                    dispatch({
                                        type: 'profile/fetchPostsList',
                                        payload: {
                                            pageInfo: {limit: paging.per_page, page: paging.page},
                                            keyword
                                        }
                                    });
                                }}
                                onTableChange={nextPaginationState => {
                                    dispatch({
                                        type: 'profile/fetchPostsList',
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
    account: PropTypes.shape({
        user_id: PropTypes.string.isRequired,
        ability: PropTypes.oneOf(['super', 'normal'])
    }).isRequired,
    currentAccount: PropTypes.object.isRequired,
    postsList: PropTypes.arrayOf(PropTypes.object).isRequired,
    paging: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        account: state.profile.account,
        currentAccount: state.app.account,
        postsList: state.profile.posts.list,
        paging: state.profile.posts.paging,
        loadingUserPostList: state.loading.effects['profile/fetchPostsList'],
        loadingUserInfo: state.loading.effects['profile/fetchUserInfo']
    };
}
export default connect(mapStateToProps)(UserPage)