import React, {PropTypes} from 'react';
import {Table, Icon, Alert} from 'antd';
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

            const isSelf = currentAccount.user_id === author.user_id;
            const isSuper = currentAccount.ability === 'super';

            return (
                <div>
                    <div className={styles.content}>
                        {
                            visible
                                ? content
                                : <div>
                                    <Alert type="warning"
                                           message={"This Comment was hidden by the Super Admin..." +
                                           " Only the Author and Super Admin can see it."
                                           } showIcon/>
                                    {
                                        isSelf || isSuper
                                            ? content
                                            : null
                                    }
                                </div>
                        }
                    </div>
                    <p className={styles.meta}>
                        by <em>{author.username}</em>, {moment(created_at).fromNow()}
                    </p>
                    <CommentPanel
                        isSelf={isSelf}
                        isSuper={currentAccount.ability === 'super'}
                        visible={visible}
                        commit={({editorContent, onComplete}) => dispatch({
                            type: 'posts/patchComment',
                            payload: {editorContent, comment_id},
                            onComplete
                        })}
                        initialValue={content}
                        onDelete={() => dispatch({
                            type: 'posts/deleteComment',
                            payload: {comment_id}
                        })}
                        onChangeVisibility={checked => dispatch({
                            type: 'posts/setCommentVisibility',
                            payload: {
                                visible: !visible,
                                comment_id
                            }
                        })}
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