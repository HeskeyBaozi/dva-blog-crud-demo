import React, {PropTypes} from 'react';
import {Table, Icon, Button, Popconfirm} from 'antd';
import Publish from '../CommentsPublish/CommentsPublish';
import styles from './CommentsList.css';
import moment from 'moment';
const {Column} = Table;

function CommentsList({
    descendants,
    loading,
    publishComment,
    user_id,
    getConfirmHandler
}) {

    const columnProps = {
        title: 'Comments',
        key: 'descendants',
        render: (text, record) => {
            const {
                content,
                author,
                created_at,
                visible,
                comment_id,
                ascendant
            } = record;

            const popConfirmProps = {
                title: 'Are you sure to delete this comment?',
                okText: 'Yes, sure',
                cancelText: 'Cancel',
                onConfirm: getConfirmHandler({comment_id, ascendant})
            };

            return (
                <div>
                    <div className={styles.content}>{visible ? content : 'can not see'}</div>
                    <p className={styles.meta}>
                        By <em>{author.username}</em>, {moment(created_at).fromNow()}
                    </p>
                    {
                        user_id === author.user_id ?
                            <Button.Group className={styles.panel}>
                                <Button size="small" type="ghost" icon="edit">Edit</Button>
                                <Popconfirm {...popConfirmProps}>
                                    <Button size="small" type="ghost" icon="delete">Delete</Button>
                                </Popconfirm>
                            </Button.Group> : null
                    }
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
    publishComment: PropTypes.func.isRequired,
    user_id: PropTypes.string.isRequired,
    getConfirmHandler: PropTypes.func.isRequired
};

export default CommentsList;