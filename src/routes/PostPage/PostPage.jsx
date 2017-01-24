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
    dispatch,
    currentAccount,
    commentsById,
    loading
}) {
    const isSelf = author.user_id === currentAccount.user_id;
    const isSuper = currentAccount.ability === 'super';
    return (
        <div>
            <div className={styles.header}>
                <div className={styles.editPost}>
                    {
                        isSuper
                            ?
                            <Spin spinning={!!loading.setVisible}>
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

                            <Link to={`/editor/${post_id}`}>
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
                loading={loading.content || loading.setVisible}
                visible={visible}
                content={content}
                isSelf={isSelf}
                isSuper={isSuper}
            />
            <CommentsList
                loading={loading.comment}
                commentsList={descendants.map(comment_id => commentsById[comment_id]).filter(comment => comment)}

                onCreate={({commentInput}) => {
                    dispatch({
                        type: 'post_detail/createComment',
                        payload: {commentInput}
                    });
                }}
                onDelete={({comment_id}) => {
                    dispatch({
                        type: 'post_detail/deleteCommentById',
                        payload: {comment_id}
                    });
                }}
                onPatch={({editorContent, comment_id, closeEditor}) => {
                    dispatch({
                        type: 'post_detail/patchCommentById',
                        payload: {
                            updatedContent: editorContent,
                            comment_id
                        },
                        onComplete: closeEditor
                    })
                }}
                onChangeCommentVisibility={({visible, comment_id}) => {
                    dispatch({
                        type: 'post_detail/setCommentVisibilityById',
                        payload: {
                            comment_id,
                            visible
                        }
                    });
                }}
                currentAccountUserId={currentAccount.user_id}
                isSuper={isSuper}/>
        </div>
    );
}

PostPage.propTypes = {
    currentPost: PropTypes.object.isRequired,
    commentsById: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    currentAccount: PropTypes.object.isRequired,
    loading: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    function useOrOperation(prefix) {
        return effectsNameArray => effectsNameArray
            .map(effectsName => state.loading.effects[`${prefix}/${effectsName}`])
            .reduce((left, right) => left || right);
    }

    return {
        currentPost: state.post_detail.currentPost,
        commentsById: state.post_detail.commentsById,
        currentAccount: state.app.account,
        loading: {
            comment: useOrOperation('post_detail')([
                'fetchPostComments',
                'createComment',
                'deleteCommentById',
                'patchCommentById',
                'setCommentVisibilityById'
            ]),
            content: state.loading.effects['post_detail/fetchPostContent'],
            postVisible: state.loading.effects['posts/setPostVisibility']
        }
    };
}

export default connect(mapStateToProps)(PostPage);
