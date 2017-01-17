import React, {PropTypes} from 'react';
import {Layout, Menu, Breadcrumb} from 'antd';
import LogoImg from '../../assets/dog_48px_1182381_easyicon.net.png';
import styles from './MainLayout.less';
import UserInfo from './UserInfo/UserInfo';
const {Header, Content, Footer} = Layout;

const MainLayout = ({
    routes,
    params,
    account,
    children,
    handleClickLogOut
}) => {

    const menuProps = {
        theme: 'dark',
        mode: 'horizontal',
        defaultSelectedKeys: ['1'],
    };

    const breadcrumbProps = {
        routes,
        params
    };

    const userInfoProps = {
        account,
        handleClickLogOut
    };
    return (
        <Layout className={styles.layoutContainer}>
            <Header className={styles.header}>
                <div className={styles.logo}>
                    <img src={LogoImg} alt="my blog!"/>
                </div>
                <UserInfo {...userInfoProps}/>
                <Menu {...menuProps} className={styles.menu}>
                    <Menu.Item key="1">Posts</Menu.Item>
                    <Menu.Item key="2">User</Menu.Item>
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
