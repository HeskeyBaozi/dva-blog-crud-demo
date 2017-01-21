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
        descendants
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
        loadingComments: loading.comments,
        loadingPatch: loading.patchComment,
        dispatch,
        descendants: commentsReady ? descendants : [], // coming from state.posts.current.descendants...
        user_id,

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
    dispatch: PropTypes.func.isRequired,
    account: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
    return {
        post_id: ownProps.params.post_id,
        currentPost: state.posts.current.post,
        loading: {
            content: state.loading.effects['posts/fetchPostContent'],
            comments: state.loading.effects['posts/fetchPostComments'],
            post: state.loading.effects['posts/displayPost'],
            patchComment: state.loading.effects['posts/patchComment']
        },
        account: state.app.account
    };
}

export default connect(mapStateToProps)(PostPage);
