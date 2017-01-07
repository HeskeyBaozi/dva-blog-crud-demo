'use strict';

import React from 'react';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
import styles from './MainLayout.css';

const {Header, Content, Footer, Sider} = Layout;
const MenuItem = Menu.Item;


class MainLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false
        };
        this.onCollapse = collapsed => {
            this.setState({collapsed});
        };
    }


    render() {
        const siderProps = {
            collapsible: true,
            collapsed: this.state.collapsed,
            onCollapse: this.onCollapse
        };

        const menuProps = {
            theme: 'dark',
            mode: 'inline',
            defaultSelectedKeys: ['1']
        };

        return (
            <Layout>
                <Sider {...siderProps}>
                    <div>LOGO</div>
                    <Menu {...menuProps}>
                        <MenuItem key="1">
                            <Icon type="user"/>
                            <span>nav 1</span>
                        </MenuItem>
                        <MenuItem key="2">
                            <Icon type="heart-o"/>
                            <span>nav 2</span>
                        </MenuItem>
                    </Menu>
                </Sider>
                <Layout>
                    <Header>
                        header
                    </Header>
                    <Content>
                        <Breadcrumb>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <div>
                            {this.props.children}
                        </div>
                    </Content>
                    <Footer>
                        Heskey Baozi
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default MainLayout;
