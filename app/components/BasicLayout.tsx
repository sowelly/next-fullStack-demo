'use client';

import React, { ReactNode, useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { useRouter } from 'next/navigation';

const { Header, Content, Footer } = Layout;

const items = [
    {
        key: '/home',
        label: `home`,
    },
    {
        key: '/dashboard',
        label: `dashboard`,
    },
]

const BasicLayout = ({ children }: { children: ReactNode }) => {
    // const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const [activeKeys, setActiveKeys] = useState(['/home'])
    const router = useRouter()
    const pushState: MenuProps['onClick'] = (e) => {
        router.push(e.key)
        setActiveKeys([e.key])
    }
    return (
        <Layout>
            <Header className={'sticky flex items-center top-0'}>
                <div className="demo-logo" />
                <Menu
                    theme="dark"
                    selectedKeys={activeKeys}
                    onClick={pushState}
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    items={items}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>
            <Content style={{ padding: '0 48px' }}>
                {/* <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                </Breadcrumb> */}
                <div
                    style={{
                        // background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        // borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default BasicLayout;