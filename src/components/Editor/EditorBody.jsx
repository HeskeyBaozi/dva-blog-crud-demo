import React, {PropTypes} from 'react';
import styles from './EditorBody.less';
import {Input, Button, Row, Form} from 'antd';

function EditorBody({
    initialValue,
    commit,
    onClose,
    form
}) {
    const {validateFields, getFieldDecorator} = form;

    function handleSubmit(e) {
        e.preventDefault();
        validateFields((error, {editorContent}) => {
            if (!error) {
                commit({editorContent});
            }
        });
    }

    return (<Form onSubmit={handleSubmit} className={styles.form}>
        <Form.Item>
            {
                getFieldDecorator('editorContent', {
                    initialValue,
                    rules: [
                        {
                            required: true,
                            message: 'The content cannot be empty.'
                        }
                    ]
                })(<Input type="textarea" rows={5}/>)
            }
        </Form.Item>
        <Form.Item>
            <Button.Group className={styles.group}>
                <Button type="ghost" onClick={onClose}>Close</Button>
                <Button htmlType="submit" type="primary" icon="edit">Patch</Button>
            </Button.Group>
        </Form.Item>
    </Form>);
}

EditorBody.propTypes = {
    initialValue: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default Form.create({})(EditorBody);