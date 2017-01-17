import React from 'react';
import styles from './Login.css';
import {Link} from 'dva/router';
import {connect} from 'dva';
import LoginLayout from '../../components/LoginLayout/LoginLayout';
import {Form, Icon, Input, Button, Checkbox} from 'antd';
import blogLogo from '../../assets/dog_48px_1182381_easyicon.net.png';

function Login({
    loading,
    dispatch,
    form:{
        getFieldDecorator,
        validateFields
    }
}) {
    function commit(data) {
        const {username, password} = data;
        dispatch({type: 'app/auth', payload: {username, password}});
    }


    function handleSubmit(e) {
        e.preventDefault();
        validateFields((error, values) => {
            if (!error) {
                commit(values);
            }
        });
    }

    return (
        <LoginLayout>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <img className={styles.logoImg} src={blogLogo} alt="my blog"/>
                    <span>My Blog!</span>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Item>
                        {
                            getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your username!'
                                    }
                                ]
                            })(<Input addonBefore={<Icon type="user"/>} placeholder="Username"/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('password', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input your Password!'
                                    }
                                ]
                            })(<Input addonBefore={<Icon type="lock"/>} type="password" placeholder="Password"/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(<Checkbox>Remember me</Checkbox>)
                        }
                        <span className={styles.toOther }>Or <Link to="/register">register now!</Link></span>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className={styles.button}
                            loading={loading}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </LoginLayout>
    );
}

export default connect((state, ownProps) => {
    return {
        loading: state.loading.models.app,
    };
})(Form.create({})(Login));
