import React, {PropTypes} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import PostContent from '../../components/PostContent/PostContent';
import {Spin} from 'antd';
import styles from './PostPage.css';
import CommentsList from '../../components/CommentsList/CommentsList';

function PostPage({
    currentPost,
    loading
}) {
    const {
        title,
        author,
        content,
        visible,
        created_at,
        descendants
    } = currentPost;

    const postContentProps = {
        visible,
        content
    };

    const commentsListProps = {
        loading,
        descendants
    };

    return (
        <Spin spinning={loading} className={styles.normal}>
            <div className={styles.postMeta}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.leading}>By <em>{author.username}</em>, {moment(created_at).fromNow()}</p>
            </div>
            <PostContent {...postContentProps}/>
            <CommentsList {...commentsListProps}/>
        </Spin>
    );
}

PostPage.propTypes = {
    currentPost: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const post_id = ownProps.params.post_id;
    return {
        currentPost: state.posts.postsById[post_id],
        loading: state.loading.models.posts
    };
}

export default connect(mapStateToProps)(PostPage);
