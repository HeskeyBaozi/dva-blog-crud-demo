import React, {PropTypes} from 'react';
import {Button, Popconfirm, Switch} from 'antd';
import {Link} from 'dva/router';
import styles from './PostPanel.css';


function PostPanel({
    isSuper,
    isSelf,
    editPostId,
    onDelete,
    onChangeVisibility,
    visible
}) {

    function handleConfirm() {
        onDelete({toDeletePostId: editPostId});
    }

    function handleChange(checked) {
        onChangeVisibility(checked, {toSetVisiblePostId: editPostId, toSetVisibleValue: !visible});
    }

    return (<div className={styles.panel}>
        {
            isSuper
                ? <Switch checked={visible}
                          checkedChildren="visible"
                          unCheckedChildren="unvisible"
                          onChange={handleChange}
                          className={styles.switch}/>
                : null
        }
        {
            isSelf
                ? <div>
                    <Link to={`/editor/${editPostId}`}>
                        <Button size="small" type="ghost" icon="edit">
                            Edit
                        </Button>
                    </Link>
                    <Popconfirm
                        title="Are you sure to delete this Post?"
                        onText="Yes, sure"
                        cancelText="Cancel"
                        onConfirm={handleConfirm}
                    >
                        <Button size="small" type="ghost" icon="delete">
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
                : null
        }
    </div>);
}

PostPanel.propTypes = {
    isSuper: PropTypes.bool.isRequired,
    isSelf: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    editPostId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChangeVisibility: PropTypes.func.isRequired

};

export default PostPanel;