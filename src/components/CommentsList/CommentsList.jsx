import React, {PropTypes} from 'react';
import {Table, Icon, Alert} from 'antd';
import Publish from '../CommentsPublish/CommentsPublish';
import styles from './CommentsList.css';
import moment from 'moment';
import CommentPanel from '../CommentPanel/CommentPanel';
const {Column} = Table;

function CommentsList({
    loading,
    commentsList,
    loadingPatch,
    onDelete,
    onPatch,
    onCreate,
    onChangeCommentVisibility,
    isSuper,
    currentAccountUserId
}) {
    const columnProps = {
        title: 'Comments',
        key: 'descendants',
        render: (text, record) => {
            const isSelf = currentAccountUserId === record.author.user_id;

            function handleDelete() {
                onDelete({comment_id: record.comment_id});
            }

            function handlePatch({editorContent, closeEditor}) {
                onPatch({
                    editorContent,
                    comment_id: record.comment_id,
                    closeEditor
                });
            }

            function handleChangeVisibility(checked) {
                onChangeCommentVisibility({visible: !record.visible, comment_id: record.comment_id});
            }

            return (
                <div>
                    <div className={styles.content}>
                        {
                            record.visible
                                ? record.content
                                : <div>
                                    <Alert type="warning"
                                           message={"This Comment was hidden by the Super Admin..." +
                                           " Only the Author and Super Admin can see it."
                                           } showIcon/>
                                    {
                                        isSelf || isSuper
                                            ? record.content
                                            : null
                                    }
                                </div>
                        }
                    </div>
                    <p className={styles.meta}>
                        by <em>{record.author.username}</em>, {moment(record.created_at).fromNow()}
                    </p>
                    <CommentPanel
                        isSelf={isSelf}
                        isSuper={isSuper}
                        visible={record.visible}
                        commit={handlePatch}
                        initialValue={record.content}
                        onDelete={handleDelete}
                        onChangeVisibility={handleChangeVisibility}
                        patchLoading={loadingPatch}
                    />
                </div>
            );
        }
    };

    return (
        <div>
            <Table
                loading={loading}
                rowKey="comment_id"
                size="small"
                showHeader={false}
                dataSource={commentsList}
                title={() => <h2><Icon type="message" className={styles.icon}/>{commentsList.length} Comment(s)</h2>}
            >
                <Column {...columnProps}/>
            </Table>
            <Publish
                loading={loading}
                commit={onCreate}
            />
        </div>
    );
}

CommentsList.propTypes = {
    commentsList: PropTypes.array.isRequired,
    onDelete: PropTypes.func.isRequired,
    onPatch: PropTypes.func.isRequired,
    onChangeCommentVisibility: PropTypes.func.isRequired,
    onCreate: PropTypes.func.isRequired,
    isSuper: PropTypes.bool.isRequired,
    currentAccountUserId: PropTypes.string.isRequired

};

export default CommentsList;