import React, {PropTypes} from 'react';
import {Button, Popconfirm, Switch} from 'antd';
import styles from './PostPanel.css';


function PostPanel({
    isSuper,
    onEdit,
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
        <Button.Group>
            <Button size="small" type="ghost" icon="edit"
                    onClick={onEdit}
            >
                Edit
            </Button>
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
        </Button.Group>
    </div>);
}

PostPanel.propTypes = {
    isSuper: PropTypes.bool.isRequired,
    visible: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onChangeVisibility: PropTypes.func.isRequired

};

export default PostPanel;