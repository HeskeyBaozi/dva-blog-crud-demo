import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {routerRedux} from 'dva/router';
import {Icon, Input, Form, Row, Col, Button} from 'antd';
import styles from './PostEditor.css';
import marked from 'marked';


function PostEditor({
    form:{
        getFieldDecorator,
        validateFields,
        getFieldValue
    },
    dispatch,
    isCreator,
    loading
}) {

    function handleSubmit(e) {
        e.preventDefault();
        validateFields((error, {postTitle, postContent}) => {
            if (!error) {
                dispatch({
                    type: 'posts/createNewPost',
                    payload: {
                        title: postTitle,
                        content: postContent
                    }
                });
            }
        });
    }


    return (<div>
        <div className={styles.title}>
            <h3 className={styles.group}>
                <Icon type="smile-o" className={styles.icon}/>P.S. MarkDown supported!
            </h3>
            <h1><Icon type="edit" className={styles.icon}/>
                {isCreator ? 'Create New Post' : 'Edit Post'}

            </h1>
        </div>
        <Form className={styles.wrapper} onSubmit={handleSubmit}>
            <Row>
                <Col span={11}>
                    <Form.Item>
                        {
                            getFieldDecorator('postTitle', {
                                initialValue: 'Example title',
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input title!'
                                    }
                                ]
                            })(<Input placeholder="Title..."/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        {
                            getFieldDecorator('postContent', {
                                initialValue: '## this is a example \n\n wow~~',
                                rules: [
                                    {
                                        required: true,
                                        message: 'Please input content!'
                                    }
                                ]
                            })(<Input type="textarea" placeholder="Content..." autosize={{minRows: 18}}/>)
                        }
                    </Form.Item>
                </Col>
                <Col span={12} offset={1}>
                    <h2 className={styles.previewLeading}>{getFieldValue('postTitle')}</h2>
                    <div dangerouslySetInnerHTML={{__html: marked(getFieldValue('postContent'))}}/>
                </Col>
            </Row>
            <Row>
                <Form.Item>
                    <Button.Group className={styles.group}>
                        <Button type="ghost" onClick={() => dispatch(routerRedux.goBack())}>Back</Button>
                        <Button icon={isCreator ? 'plus-square-o' : 'edit'}
                                htmlType="submit"
                                type="primary"
                                loading={loading}
                        >{isCreator ? 'Create' : 'Edit'}</Button>
                    </Button.Group>
                </Form.Item>
            </Row>
        </Form>
    </div>);
}

PostEditor.propTypes = {
    dispatch: PropTypes.func.isRequired,
    isCreator: PropTypes.bool.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        isCreator: ownProps.location.query.type === 'creator',
        loading: state.loading.effects['posts/createNewPost']
    };
}

export default connect(mapStateToProps)(Form.create({})(PostEditor));