import React, {PropTypes} from 'react';
import styles from './Editor.less';
import {Input, Button, Modal, Form} from 'antd';

function EditorBody({
    loading,
    initialValue,
    visible,
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

    return (
        <Modal
            visible={visible}
            title={<h3>Editor</h3>}
            onCancel={onClose}
            footer={[
                <Button key="close" type="ghost" onClick={onClose}>Close</Button>,
                <Button key="submit"
                        htmlType="submit"
                        type="primary"
                        icon="edit"
                        onClick={handleSubmit}
                        loading={loading}
                >Patch</Button>
            ]}
        >
            <Form>
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
            </Form>
        </Modal>
    );
}

EditorBody.propTypes = {
    initialValue: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
};

export default Form.create({})(EditorBody);