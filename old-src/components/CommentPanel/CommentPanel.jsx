import React, {PropTypes} from 'react';
import {Button, Popconfirm, Switch} from 'antd';
import {Link} from 'dva/router';
import styles from './CommentPanel.css';
import Editor from './Editor/Editor';


function CommentPanel({
    isSuper,
    isSelf,
    initialValue,
    patchLoading,
    commit,
    onDelete,
    onChangeVisibility,
    visible
}) {
    return (
        <div className={styles.panel}>
            {
                isSuper
                    ? <Switch checked={visible}
                              checkedChildren="visible"
                              unCheckedChildren="unvisible"
                              onChange={onChangeVisibility}
                              className={styles.switch}
                    />
                    : null
            }
            {
                isSelf
                    ? <Button.Group>
                        <Editor
                            initialValue={initialValue}
                            loading={patchLoading}
                            commit={commit}
                        >
                            <Button size="small" type="ghost" icon="edit">
                                Edit
                            </Button>
                        </Editor>
                        <Popconfirm
                            title="Are you sure to delete this comment?"
                            okText="Yes, sure"
                            cancelText="Cancel"
                            onConfirm={onDelete}
                        >
                            <Button size="small" type="ghost" icon="delete">
                                Delete
                            </Button>
                        </Popconfirm>
                    </Button.Group>
                    : null
            }
        </div>
    );
}

CommentPanel.propTypes = {
    isSuper: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    commit: PropTypes.func.isRequired,
    initialValue: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChangeVisibility: PropTypes.func.isRequired
};

export default CommentPanel;