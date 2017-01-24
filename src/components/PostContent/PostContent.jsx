import React, {PropTypes} from 'react';
import {Alert, Spin} from 'antd';
import marked from 'marked';
import styles from './PostContent.css'

function PostContent({
    content,
    visible,
    loadContent,
    isSelf,
    isSuper,
    loading
}) {
    return (
        <Spin spinning={!!loading}>
            <div className={styles.content}>
                {
                    visible
                        ? <div dangerouslySetInnerHTML={{__html: marked(content)}}/>
                        : <div>
                            <Alert
                                message="This Post was hidden by the Super Admin.. Only the Author and Super Admin can see it."
                                type="warning"
                                showIcon
                            />
                            {
                                isSelf || isSuper
                                    ? <div dangerouslySetInnerHTML={{__html: marked(content)}}/>
                                    : null
                            }
                        </div>
                }
            </div>
        </Spin>
    );
}

PostContent.propTypes = {
    visible: PropTypes.bool.isRequired,
    content: PropTypes.string.isRequired,
    isSelf: PropTypes.bool.isRequired,
    isSuper: PropTypes.bool.isRequired
};

export default PostContent;