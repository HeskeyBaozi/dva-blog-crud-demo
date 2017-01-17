import React, {PropTypes} from 'react';
import {Alert} from 'antd';
import marked from 'marked';
import styles from './PostContent.css'

function PostContent({
    content,
    visible
}) {
    const alertProps = {
        message: 'this post was hidden by the super admin..',
        type: 'warning',
        showIcon: true
    };

    return (
        <div className={styles.normal}>
            {
                visible
                    ? content
                        ? <div dangerouslySetInnerHTML={{__html: marked(content)}}/>
                        : <div>{content}</div>
                    : <Alert {...alertProps}/>
            }
        </div>
    );
}

PostContent.propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.string
};

export default PostContent;