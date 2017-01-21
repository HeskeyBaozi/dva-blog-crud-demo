import React, {PropTypes} from 'react';
import moment from 'moment';
import {connect} from 'dva';
import {Link} from 'dva/router';
import {Button, Switch, Spin} from 'antd';
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
    account
}) {
    const commentsReady = descendants.length && descendants[0].comment_id;
    const commentsListProps = {
        loadingComments: loading.comments,
        loadingPatch: loading.patchComment,
        dispatch,
        descendants: commentsReady ? descendants : [], // coming from state.posts.current.descendants...
        currentAccount: account

    };
    const isSelf = author.user_id === account.user_id;
    const isSuper = account.ability === 'super';
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.editPost}>
                    {
                        isSuper
                            ? <Spin spinning={!!loading.setVisible}>
                                <Switch checked={visible}
                                        checkedChildren="visible"
                                        unCheckedChildren="unvisible"
                                        onChange={checked => dispatch({
                                            type: 'posts/setPostVisibility',
                                            payload: {
                                                visible: !visible,
                                                post_id
                                            }
                                        })}
                                        className={styles.switch}/>
                            </Spin>
                            : null
                    }
                    {
                        isSelf
                            ?

                            <Link to={`/editor?post_id=${post_id}`}>
                                <Button type="primary" icon="edit">
                                    Edit Post
                                </Button>
                            </Link>
                            : null
                    }
                </div>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.leading}>By <em>{author.username}</em>, {moment(created_at).fromNow()}</p>
            </div>
            <PostContent
                loadContent={loading.content}
                visible={visible}
                content={content || 'Loading...'}
                isSelf={isSelf}
                isSuper={isSuper}
            />
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
            patchComment: state.loading.effects['posts/patchComment'],
            setVisible: state.loading.effects['posts/setPostVisibility']
        },
        account: state.app.account
    };
}

export default connect(mapStateToProps)(PostPage);
