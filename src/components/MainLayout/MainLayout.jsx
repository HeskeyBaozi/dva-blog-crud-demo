import React, {PropTypes} from 'react';
import {Layout, Menu, Breadcrumb, Icon, BackTop} from 'antd';
import {Link} from 'dva/router';
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
    return (
        <Layout className={styles.layoutContainer}>
            <Header className={styles.header}>
                <div className={styles.mainContainer}>
                    <div className={styles.logo}>
                        <img src={LogoImg} alt="my blog!"/>
                    </div>
                    <UserInfo account={account} handleClickLogOut={handleClickLogOut}/>
                    <Menu mode="horizontal" defaultSelectedKeys={['1']} className={styles.menu}>
                        <Menu.Item key="1">
                            <Link to="/posts">
                                <Icon type="file-text" className={styles.icon}/>Posts
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Link to={`/user/${account.user_id}`}>
                                <Icon type="user" className={styles.icon}/>User
                            </Link>
                        </Menu.Item>
                    </Menu>
                </div>
            </Header>
            <Content className={styles.content}>
                <div className={styles.mainContainer}>
                    <div className={styles.mainContent}>
                        <Breadcrumb
                            routes={routes}
                            params={params}
                            itemRender={(route, params, routes, paths) => {
                                const last = routes.indexOf(route) === routes.length - 1;
                                return last
                                    ? <span>
                                        <Icon type={route.icon} className={styles.icon}/>{route.breadcrumbName}</span>
                                    : <Link to={paths.join('/')}>
                                        <Icon type={route.icon} className={styles.icon}/>{route.breadcrumbName}
                                    </Link>
                            }}
                            className={styles.breadcrumb}/>
                        {children}
                    </div>
                </div>
            </Content>
            <Footer className={styles.footer}>
                Heskey Baozi, 15331097
            </Footer>
            <BackTop className={styles.backTop}/>
        </Layout>
    )
};

MainLayout.propTypes = {};

export default MainLayout;
