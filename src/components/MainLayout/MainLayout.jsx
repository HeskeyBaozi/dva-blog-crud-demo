import React, {PropTypes} from 'react';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
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
        mode: 'horizontal',
        defaultSelectedKeys: ['1'],
        className: styles.menu
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
                <div className={styles.mainContainer}>
                    <div className={styles.logo}>
                        <img src={LogoImg} alt="my blog!"/>
                    </div>
                    <UserInfo {...userInfoProps}/>
                    <Menu {...menuProps} >
                        <Menu.Item key="1"><Icon type="file-text" className={styles.icon}/>Posts</Menu.Item>
                        <Menu.Item key="2">User</Menu.Item>
                    </Menu>
                </div>
            </Header>
            <Content className={styles.content}>
                <div className={styles.mainContainer}>
                    <div className={styles.mainContent}>
                        <Breadcrumb {...breadcrumbProps} className={styles.breadcrumb}/>
                        {children}
                    </div>
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
