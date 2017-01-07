import React from 'react';
import styles from './Register.css';
import {Link} from 'dva/router';
import LoginLayout from '../components/LoginLayout/LoginLayout';

import {Form, Input, Button} from 'antd';

const FormItem = Form.Item;

const Register = Form.create()(({form}) => {
    let passwordDirty = false;
    const getFieldDecorator = form.getFieldDecorator;

    function handleSubmit(e) {
        e.preventDefault();
        form.validateFieldsAndScroll((error, values) => {
            if (!error) {
                console.log('Received values of form: ', values);
            }
        });
    }

    function handlePasswordBlue(e) {
        const value = e.target.value;
        passwordDirty = passwordDirty || !!value;
    }


    function checkPassword(rule, value, callback) {
        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords that you enter is inconsistent!');
        } else {
            callback();
        }
    }

    function checkConfirm(rule, value, callback) {
        if (value && passwordDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    }

    const formItemLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 17}
    };

    const tailFormItemLayout = {
        wrapperCol: {
            span: 17,
            offset: 6,
        }
    };

    return (
        <LoginLayout>
            <div className={styles.container}>
                <div className={styles.logo}>Welcome to Register!</div>
                <Form horizontal onSubmit={handleSubmit}>
                    <FormItem
                        {...formItemLayout}
                        label="UserName"
                        hasFeedback
                    >
                        {
                            getFieldDecorator('userName', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your username!'
                                    }
                                ],
                            })(<Input />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="E-mail"
                        hasFeedback
                    >
                        {
                            getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    }
                                ],
                            })(<Input />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Password"
                        hasFeedback
                    >
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                    {
                                        validator: checkConfirm,
                                    }
                                ],
                            })(<Input type="password" onBlur={handlePasswordBlue}/>)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Confirm Password"
                        hasFeedback
                    >
                        {
                            getFieldDecorator('confirm', {
                                rules: [{
                                    required: true, message: 'Please confirm your password!',
                                }, {
                                    validator: checkPassword,
                                }],
                            })(<Input type="password"/>)
                        }
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" size="large">Register</Button>
                        <span className={styles.toOther}>Have an account? <Link to="/login">Log in!</Link></span>
                    </FormItem>
                </Form>
            </div>
        </LoginLayout>
    );
});

export default Register;
