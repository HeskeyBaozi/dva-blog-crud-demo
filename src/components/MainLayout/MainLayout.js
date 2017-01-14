'use strict';

import React from 'react';
import {Layout, Menu, Breadcrumb} from 'antd';
const {Header, Content, Footer} = Layout;

import LogoImg from '../../assets/dog_48px_1182381_easyicon.net.png';
import styles from './MainLayout.css';


const MainLayout = props => {

    const {routes, params} = props;
    const menuProps = {
        theme: 'light',
        mode: 'horizontal',
        defaultSelectedKeys: ['1'],
    };


    return (
        <Layout className="layout">
            <Header className={styles.header}>
                <div className={styles.logo}>
                    <img src={LogoImg} alt="my blog!"/>
                </div>
                <Menu {...menuProps} className={styles.menu}>
                    <Menu.Item key="1">Posts</Menu.Item>
                </Menu>
            </Header>
            <Content style={{padding: '0 50px'}}>
                <Breadcrumb routes={routes} params={params} style={{margin: '12px 0'}}/>
                <div style={{background: '#fff', padding: 24, minHeight: 280}}>
                    {props.children}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Ant Design ©2016 Created by Ant UED
            </Footer>
        </Layout>
    )
};

export default MainLayout;
