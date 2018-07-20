import React, {PropTypes} from 'react';
import {Input, Button, Form, Popover} from 'antd';
import styles from './Editor.less';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((error, {editorContent}) => {
            if (!error) {
                this.props.commit({
                    editorContent,
                    closeEditor: () => this.handleClose()
                });
            }
        });
    };

    handleClose = () => {
        this.setState({
            visible: false
        });
        this.props.form.resetFields();
    };

    handleVisibleChange = visible => {
        this.setState({visible});
        if (visible === false) {
            this.props.form.resetFields();
        }
    };

    render() {
        return (
            <Popover
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
                title={<div>
                    <Button.Group className={styles.group}>
                        <Button key="close" type="ghost" size="small" onClick={this.handleClose}>Close</Button>
                        <Button key="submit"
                                htmlType="submit"
                                type="primary"
                                icon="edit"
                                size="small"
                                onClick={this.handleSubmit}
                                loading={this.props.loading}
                        >Patch</Button>
                    </Button.Group>
                    <h3>Edit the Comment</h3>
                </div>}
                trigger="click"
                placement="topRight"
                content={<Form>
                    <Form.Item>
                        {
                            this.props.form.getFieldDecorator('editorContent', {
                                initialValue: this.props.initialValue,
                                rules: [
                                    {
                                        required: true,
                                        message: 'The content cannot be empty.'
                                    }
                                ]
                            })(<Input type="textarea" rows={5} className={styles.input}/>)
                        }
                    </Form.Item>
                </Form>}
            >
                {this.props.children}
            </Popover>
        );
    }
}

Editor.propTypes = {
    initialValue: PropTypes.string.isRequired,
    commit: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired
};

export default Form.create({})(Editor);