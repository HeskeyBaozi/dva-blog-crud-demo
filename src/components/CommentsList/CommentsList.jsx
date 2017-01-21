import React, {PropTypes} from 'react';
import {Table, Icon} from 'antd';
import Publish from '../CommentsPublish/CommentsPublish';
import styles from './CommentsList.css';
import moment from 'moment';
import CommentPanel from '../CommentPanel/CommentPanel';
const {Column} = Table;

function CommentsList({
    descendants,
    loadingComments,
    loadingPatch,
    currentAccount,
    dispatch
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
            } = record;

            return (
                <div>
                    <div className={styles.content}>{visible ? content : 'can not see'}</div>
                    <p className={styles.meta}>
                        by <em>{author.username}</em>, {moment(created_at).fromNow()}
                    </p>
                    <CommentPanel
                        isSelf={currentAccount.user_id === author.user_id}
                        isSuper={currentAccount.ability === 'super'}
                        visible={visible}
                        commit={({editorContent, onComplete}) => dispatch({
                            type: 'posts/patchComment',
                            payload: {editorContent, comment_id},
                            onComplete
                        })}
                        initialValue={visible ? content : ''}
                        onDelete={() => dispatch({
                            type: 'posts/deleteComment',
                            payload: {comment_id}
                        })}
                        onChangeVisibility={visible => console.log(visible)}
                        patchLoading={loadingPatch}
                    />
                </div>
            );
        }
    };

    return (
        <div>
            <Table
                loading={loadingComments}
                rowKey="comment_id"
                size="small"
                showHeader={false}
                dataSource={descendants}
                title={() => <h2><Icon type="message" className={styles.icon}/>{descendants.length} Comment(s)</h2>}
            >
                <Column {...columnProps}/>
            </Table>
            <Publish
                loading={loadingComments}
                commit={({commentInput}) => {
                    dispatch({
                        type: 'posts/createNewComment',
                        payload: {commentInput}
                    });
                }}
            />
        </div>
    );
}

CommentsList.propTypes = {
    descendants: PropTypes.array.isRequired,
    currentAccount: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

export default CommentsList;