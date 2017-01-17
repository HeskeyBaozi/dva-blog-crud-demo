import React, {PropTypes} from 'react';
import {Form, Input, Button, Row, Col} from 'antd';
import styles from './CommentsPublish.css';

function CommentsPublish({
    loading,
    form:{
        getFieldDecorator,
        validateFieldsAndScroll,
        resetFields
    },
    commit
}) {

    const formProps = {
        onSubmit: handlePublish,
        className:styles.form
    };
    const buttonProps = {
        loading,
        type: 'primary',
        size: 'large',
        icon: 'plus-square-o',
        className:styles.button,
        htmlType: 'submit'
    };

    function handlePublish(e) {
        e.preventDefault();
        validateFieldsAndScroll((error, {commentInput}) => {
            if (!error) {
                resetFields();
                commit({commentInput});
            }
        });
    }

    return (
        <Form {...formProps}>
            <Form.Item>
                {
                    getFieldDecorator('content', {
                        rules: [
                            {
                                required: true,
                                message: 'Please input your comment...'
                            }
                        ]
                    })(<Input type="textarea" placeholder="Add Comment..." autosize={true}/>)
                }
            </Form.Item>
            <Form.Item>
                <Row>
                    <Col span={4} offset={20}>
                        <Button {...buttonProps}>Publish</Button>
                    </Col>
                </Row>
            </Form.Item>
        </Form>
    );
}

CommentsPublish.propTypes = {
    form: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    commit: PropTypes.func.isRequired
};

export default Form.create({})(CommentsPublish);