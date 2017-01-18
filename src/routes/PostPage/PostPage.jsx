import React, {PropTypes} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import PostContent from '../../components/PostContent/PostContent';
import {Spin} from 'antd';
import styles from './PostPage.css';
import CommentsList from '../../components/CommentsList/CommentsList';

function PostPage({
    currentPost,
    loading,
    dispatch,
    account
}) {
    const {
        title,
        author,
        content,
        visible,
        created_at,
        descendants,
        post_id
    } = currentPost;

    const {user_id} = account;

    const postContentProps = {
        loading: loading.content,
        visible,
        content
    };

    const commentsListProps = {
        loading: loading.comments,
        descendants,
        publishComment,
        user_id,
        getConfirmHandler: ({comment_id, ascendant}) => () => {
            dispatch({
                type: 'posts/deleteComment',
                payload: {comment_id, ascendant}
            });
        }
    };

    function publishComment({commentInput}) {
        dispatch({
            type: 'posts/createNewComment',
            payload: {commentInput, post_id}
        });
    }

    return (
        <div>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.leading}>By <em>{author.username}</em>, {moment(created_at).fromNow()}</p>
            <PostContent {...postContentProps}/>
            <CommentsList {...commentsListProps}/>
        </div>
    );
}

PostPage.propTypes = {
    currentPost: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    const post_id = ownProps.params.post_id;
    return {
        currentPost: state.posts.postsById[post_id],
        loading: {
            content: state.loading.effects['posts/fetchPostContent'],
            comments: state.loading.effects['posts/fetchPostComments']
        },
        account: state.app.account
    };
}

export default connect(mapStateToProps)(PostPage);
