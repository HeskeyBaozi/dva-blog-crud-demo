import React from 'react';
import {connect} from 'dva';
import styles from './PostList.css';
import {Table, Card} from 'antd';
import moment from 'moment';

const {Column} = Table;

function PostList({
    dispatch,
    postsList,
    paging
}) {
    const columnProps = {
        title: 'posts',
        key: 'posts',
        render: (text, record, index) => {
            return (<Card>
                <div className={styles.cardContent}>
                    <span className={styles.commentNumber}>
                    {record.descendants.length}
                </span>
                    <span>
                    <h3>{record.title}</h3>
                    <p>
                        By <em>{record.author_id}</em> | {moment.unix(record.created_at).fromNow()}
                    </p>
                </span>
                </div>
            </Card>);
        }
    };

    const pagination = {
        total: paging.total,
        pageSize:paging.per_page,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10'],
        showQuickJumper: true,
        onChange: nextPage => {
            dispatch({
                type: 'posts/queryPosts',
                payload: {
                    pageInfo: {
                        limit: 5,
                        page: nextPage
                    }
                }
            });
        }
    };

    const tableProps = {
        dataSource: postsList,
        showHeader: false,
        rowKey: 'post_id',
        pagination
    };

    return (
        <div className={styles.normal}>
            <Table {...tableProps}>
                <Column {...columnProps}/>
            </Table>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        ...state.posts
    };
}

export default connect(mapStateToProps)(PostList);
