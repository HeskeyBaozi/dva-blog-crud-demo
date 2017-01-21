import React, {PropTypes} from 'react';
import {Alert, Spin} from 'antd';
import marked from 'marked';
import styles from './PostContent.css'

function PostContent({
    content,
    visible,
    loading
}) {
    return (
        <Spin spinning={!!loading}>
            <div className={styles.content}>
                {
                    visible
                        ? <div dangerouslySetInnerHTML={{__html: marked(content)}}/>
                        : <Alert
                            message="this post was hidden by the super admin.."
                            type="warning"
                            showIcon/>
                }
            </div>
        </Spin>
    );
}

PostContent.propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.string.isRequired
};

export default PostContent;