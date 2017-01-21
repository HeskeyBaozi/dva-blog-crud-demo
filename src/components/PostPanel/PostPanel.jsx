import React, {PropTypes} from 'react';
import {Button, Popconfirm, Switch} from 'antd';
import {Link} from 'dva/router';
import styles from './PostPanel.css';


function PostPanel({
    isSuper,
    editPostId,
    onDelete,
    onChangeVisibility,
    visible
}) {
    return (<div className={styles.panel}>
        {
            isSuper
                ? <Switch checked={visible}
                          checkedChildren="visible"
                          unCheckedChildren="unvisible"
                          onChange={onChangeVisibility}/>
                : null
        }
        <Link to={`/editor?post_id=${editPostId}`}>
            <Button size="small" type="ghost" icon="edit">
                Edit
            </Button>
        </Link>
        <Popconfirm
            title="Are you sure to delete this Post?"
            onText="Yes, sure"
            cancelText="Cancel"
            onConfirm={onDelete}
        >
            <Button size="small" type="ghost" icon="delete">
                Delete
            </Button>
        </Popconfirm>
    </div>);
}

PostPanel.propTypes = {
    isSuper: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    editPostId: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChangeVisibility: PropTypes.func.isRequired

};

export default PostPanel;