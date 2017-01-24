import React, {PropTypes} from 'react';
import PostPanel from '../../../components/PostPanel/PostPanel';
import styles from './PostItem.css';
import {Link} from 'dva/router';
import {Card, Tooltip, Tag} from 'antd';
import moment from 'moment';

function PostItem({
    record,
    isSelf,
    isSuper,
    onDelete,
    onChangeVisibility
}) {
    return (
        <Card>
            <div className={styles.panelContainer}>
                <PostPanel
                    visible={record.visible}
                    isSuper={isSuper}
                    isSelf={isSelf}
                    editPostId={record.post_id}
                    onDelete={onDelete}
                    onChangeVisibility={onChangeVisibility}
                />
            </div>
            <div className={styles.cardContent}>
                <span className={styles.commentNumber}>
                    <Link to={`/posts/${record.post_id}`}>
                        {record.descendants.length}
                    </Link>
                </span>
                <span>
                    <Link to={`/posts/${record.post_id}`}>
                        <h3>{record.title}</h3>
                    </Link>
                    <p>By <Link to={`/user/${record.author.user_id}`}>
                            <em className={styles.toUser}>{record.author.username}</em>
                        </Link> | {moment(record.created_at).fromNow()}</p>

                </span>
                <Link to={`/posts/${record.post_id}`}>
                    <div className={styles.tagGroup}>
                        {
                            record.visible
                                ? null
                                :
                                <Tooltip title="The Post has been hidden by the Super Admin..."
                                         placement="topLeft">
                                    <Tag color="#FFC100">Hidden</Tag>
                                </Tooltip>
                        }
                    </div>
                </Link>
            </div>
        </Card>
    );
}

PostItem.propTypes = {
    record: PropTypes.object.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isSuper: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChangeVisibility: PropTypes.func.isRequired
};

export default PostItem;
