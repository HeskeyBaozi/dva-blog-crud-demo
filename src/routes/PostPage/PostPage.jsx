import React, {PropTypes} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import PostContent from '../../components/PostContent/PostContent';
import styles from './PostPage.css';

function PostPage({currentPost}) {
    const {title, author, content, visible, created_at} = currentPost;

    const postContentProps = {
        visible,
        content
    };

    return (
        <div className={styles.normal}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.leading}>By <em>{author.username}</em> {moment(created_at).fromNow()}</p>
            <PostContent {...postContentProps}/>
        </div>
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
