import React, {PropTypes} from 'react';
import {Alert, Spin} from 'antd';
import marked from 'marked';
import styles from './PostContent.css'

function PostContent({
    content,
    visible,
    loading
}) {
    const alertProps = {
        message: 'this post was hidden by the super admin..',
        type: 'warning',
        showIcon: true
    };

    return (
        <Spin spinning={loading}>
            <div className={styles.content}>
                {
                    visible
                        ? content
                            ? <div dangerouslySetInnerHTML={{__html: marked(content)}}/>
                            : <div>{content}</div>
                        : <Alert {...alertProps}/>
                }
            </div>
        </Spin>
    );
}

PostContent.propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.string,
    loading: PropTypes.bool.isRequired
};

export default PostContent;