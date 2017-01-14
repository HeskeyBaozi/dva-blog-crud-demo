'use strict';

import React, {PropTypes} from 'react';
import {Layout, Menu, Breadcrumb, Button} from 'antd';
import LogoImg from '../../assets/dog_48px_1182381_easyicon.net.png';
import styles from './MainLayout.less';
const {Header, Content, Footer} = Layout;

const MainLayout = ({
    routes,
    params,
    account,
    children,
    handleClickLogOut
}) => {

    const menuProps = {
        theme: 'light',
        mode: 'horizontal',
        defaultSelectedKeys: ['1'],
    };

    const breadcrumbProps = {
        routes,
        params
    };
    return (
        <Layout>
            <Header className={styles.header}>
                <div className={styles.logo}>
                    <img src={LogoImg} alt="my blog!"/>
                </div>
                <div className={styles.user}>
                    <span>Hello, {account.ability === 'super' ? 'Super' : 'Normal'}<em>{account.username}</em></span>
                    <Button type="ghost" icon="logout" onClick={handleClickLogOut}>Logout</Button>
                </div>
                <Menu {...menuProps} className={styles.menu}>
                    <Menu.Item key="1">Posts</Menu.Item>
                </Menu>
            </Header>
            <Content className={styles.content}>
                <Breadcrumb {...breadcrumbProps} className={styles.breadcrumb}/>
                <div className={styles.mainContent}>
                    {children}
                </div>
            </Content>
            <Footer className={styles.footer}>
                Heskey Baozi, 15331097
            </Footer>
        </Layout>
    )
};

MainLayout.propTypes = {};

export default MainLayout;
