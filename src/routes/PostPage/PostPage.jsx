import React, {PropTypes} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import PostContent from '../../components/PostContent/PostContent';
import styles from './PostPage.css';
import CommentsList from '../../components/CommentsList/CommentsList';

function PostPage({
    currentPost:{
        title,
        author,
        content,
        visible,
        created_at,
        descendants,
        post_id
    },
    loading,
    dispatch,
    account:{user_id}
}) {
    const postContentProps = {
        loading: loading.content,
        visible,
        content: content || 'Loading...'
    };

    const commentsReady = descendants.length && descendants[0].comment_id;
    const commentsListProps = {
        loading: loading.comments,
        descendants: commentsReady ? descendants : [], // coming from state.posts.currentPost.descendants...
        publishComment: ({commentInput}) => {
            dispatch({
                type: 'posts/createNewComment',
                payload: {commentInput}
            });
        },
        patchComment: ({editorContent}) => {

        },
        user_id,
        getConfirmHandler: ({comment_id}) => () => {
            dispatch({
                type: 'posts/deleteComment',
                payload: {comment_id}
            });
        }
    };

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
    return {
        currentPost: state.posts.currentPost,
        loading: {
            content: state.loading.effects['posts/fetchPostContent'],
            comments: state.loading.effects['posts/fetchPostComments']
        },
        account: state.app.account
    };
}

export default connect(mapStateToProps)(PostPage);
