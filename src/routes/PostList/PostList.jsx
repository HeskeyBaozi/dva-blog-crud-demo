import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {Link} from 'dva/router';
import styles from './PostList.css';
import {Table, Card, Button, Tag, Icon, Tooltip, Spin, Input} from 'antd';
import PostPanel from '../../components/PostPanel/PostPanel';
import SearchKeyword from '../../components/SearchKeyword/SearchKeyword';
import moment from 'moment';

const {Column} = Table;

function PostList({
    dispatch,
    postsList,
    paging,
    loading,
    currentAccount,
    loadVisible
}) {
    const columnProps = {
        title: 'posts',
        key: 'posts',
        render: (text, record) => {
            const {
                post_id,
                descendants,
                author,
                created_at,
                title,
                visible
            } = record;
            return (
                <Spin spinning={!!loadVisible} tip="Setting...">
                    <Card>
                        <div className={styles.panelContainer}>
                            <PostPanel
                                visible={visible}
                                isSuper={currentAccount.ability === 'super'}
                                isSelf={currentAccount.user_id === author.user_id}
                                editPostId={post_id}
                                onDelete={() => dispatch({
                                    type: 'posts/deletePost',
                                    payload: {
                                        post_id, paging: {limit: paging.per_page, page: paging.page}
                                    }
                                })}
                                onChangeVisibility={checked => dispatch({
                                    type: 'posts/setPostVisibility',
                                    payload: {
                                        visible: !visible,
                                        post_id
                                    }
                                })}
                            />
                        </div>
                        <div className={styles.cardContent}>
                        <span className={styles.commentNumber}>
                            <Link to={`/posts/${post_id}`}>
                                {descendants.length}
                            </Link>
                        </span>
                            <span>
                            <Link to={`/posts/${post_id}`}>
                            <h3>{title}</h3>
                            <p>By <em>{author.username}</em> | {moment(created_at).fromNow()}</p>
                            </Link>
                        </span>
                            <Link to={`/posts/${post_id}`}>
                                <div className={styles.tagGroup}>
                                    {
                                        visible
                                            ? null
                                            : <Tooltip title="The Post has been hidden by the Super Admin..."
                                                       placement="topLeft">
                                                <Tag color="#FFC100">Hidden</Tag>
                                            </Tooltip>
                                    }
                                </div>
                            </Link>
                        </div>
                    </Card>
                </Spin>
            );
        }
    };

    const pagination = {
        total: paging.total,
        pageSize: paging.per_page,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10'],
        showQuickJumper: true,
        onChange: nextPage => {
            dispatch({
                type: 'posts/fetchPostsList',
                payload: {
                    pageInfo: {
                        limit: paging.per_page,
                        page: nextPage
                    }
                }
            });
        },
        onShowSizeChange: (current, size) => {
            dispatch({
                type: 'posts/fetchPostsList',
                payload: {
                    pageInfo: {
                        limit: size,
                        page: current
                    }
                }
            });
        }
    };

    const tableProps = {
        dataSource: postsList,
        showHeader: false,
        rowKey: 'post_id',
        pagination,
        loading,
        title: () => <SearchKeyword
            onSearch={keyword => dispatch({
                type: 'posts/fetchPostsList',
                payload: {pageInfo: {limit: paging.per_page, page: paging.page}, keyword}
            })}
        />
    };

    return (
        <div>
            <div className={styles.title}>
                <Link to="/editor?type=creator">
                    <Button type="primary" size="large" icon="addfile" className={styles.addPost}>Add Post</Button>
                </Link>
                <h1><Icon type="file-text" className={styles.icon}/>Posts</h1>
            </div>
            <Table {...tableProps}>
                <Column {...columnProps}/>
            </Table>
        </div>

    );
}

PostList.propTypes = {
    dispatch: PropTypes.func.isRequired,
    postsList: PropTypes.array.isRequired,
    paging: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
    return {
        postsList: state.posts.postsList,
        paging: state.posts.paging,
        loading: state.loading.effects['posts/fetchPostsList'],
        loadVisible: state.loading.effects['posts/setPostVisibility'],
        currentAccount: state.app.account
    };
}

export default connect(mapStateToProps)(PostList);
