import React, {PropTypes} from 'react';
import {Table, Card, Icon} from 'antd';
import Publish from '../CommentsPublish/CommentsPublish';
import styles from './CommentsList.css';
import moment from 'moment';
const {Column} = Table;

function CommentsList({
    descendants,
    loading,
    publishComment
}) {

    const columnProps = {
        title: 'Comments',
        key: 'descendants',
        render: (text, record) => {
            const {
                content,
                author,
                created_at,
                visible
            } = record;
            console.log('record = ', record);
            return (
                <div>
                    <p>{visible ? content : 'can not see'}</p>
                    <p>By <em>{author.username}</em>, {moment(created_at).fromNow()}</p>
                </div>
            );
        }
    };

    const commentsReady = descendants.length && descendants[0].comment_id;

    const tableProps = {
        dataSource: commentsReady ? descendants : [],
        showHeader: false,
        rowKey: 'comment_id',
        loading,
        title: currentPageData => {
            return <h2><Icon type="message" className={styles.icon}/>Comments</h2>;
        },
        size: 'small'
    };

    const publishProps = {
        loading,
        commit: publishComment
    };

    return (
        <div>
            <Table {...tableProps}>
                <Column {...columnProps}/>
            </Table>
            <Publish {...publishProps}/>
        </div>
    );
}

CommentsList.propTypes = {
    descendants: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    publishComment: PropTypes.func.isRequired
};

export default CommentsList;