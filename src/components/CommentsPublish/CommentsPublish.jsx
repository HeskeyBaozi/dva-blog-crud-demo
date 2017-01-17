import React, {PropTypes} from 'react';
import {Form, Input, Button, Row, Col} from 'antd';

function CommentsPublish({
    loading,
    form:{
        getFieldDecorator,
        validateFieldsAndScroll,
        resetFields
    }
}) {

    const formProps = {
        onSubmit: handlePublish
    };
    const buttonProps = {
        loading,
        type: 'primary',
        size: 'large',
        icon: 'message',
        style: {float: 'right'},
        htmlType: 'submit'
    };

    function handlePublish(e) {
        e.preventDefault();
        validateFieldsAndScroll((error, values) => {
            if (!error) {
                resetFields();
                console.log('Received values of form: ', values);
            }
        });
    }

    return (
        <Form {...formProps}>
            <Form.Item>
                {
                    getFieldDecorator('commentInput', {
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
    )
}

CommentsPublish.propTypes = {
    form: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired
};

export default Form.create({})(CommentsPublish);