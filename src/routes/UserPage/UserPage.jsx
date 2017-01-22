import React, {PropTypes} from 'react';
import {connect} from 'dva';
import {Icon, Row, Col, Tabs} from 'antd';
import normalAvatar from '../../assets/genji.jpg';
import superAvatar from '../../assets/hanzo.jpg';
import styles from './UserPage.less';

function UserPage({
    currentAccount
}) {
    const isSuper = currentAccount.ability === 'super';
    return (
        <div>
            <div className={styles.title}>
                <h1><Icon type="user" className={styles.icon}/>User</h1>
            </div>
            <Row className={styles.mainContainer}>
                <Col span={8} xs={0} sm={8} md={8} lg={8}>
                    <img src={isSuper ? superAvatar : normalAvatar} alt="avatar" className={styles.avatar}/>
                    <div className={styles.cardContainer}>
                        <h1>{currentAccount.username}</h1>
                    </div>
                    <ul>
                        <li><Icon type="team" className={styles.icon}/>{currentAccount.ability} user</li>
                        <li><Icon type="mail" className={styles.icon}/>{currentAccount.email}</li>
                    </ul>
                </Col>
                <Col span={16} xs={24} sm={16} md={16} lg={16}>
                    <Tabs>
                        <Tabs.TabPane key="posts" tab="Posts">

                        </Tabs.TabPane>
                    </Tabs>
                </Col>
            </Row>
        </div>
    );
}

UserPage.propTypes = {
    currentAccount: PropTypes.object.isRequired
};

function mapStateToProps(state, ownProps) {
    return {
        currentAccount: state.app.account
    };
}
export default connect(mapStateToProps)(UserPage)