'use client';

import React, {ReactNode, useState} from 'react';
import {Layout, Menu, MenuProps} from 'antd';
import {useRouter, usePathname} from 'next/navigation';

const {Header, Content, Footer} = Layout;

const items = [
    {
        key: '/',
        label: `home`,
    },
    {
        key: '/todoList',
        label: `todoList`,
    },
]

const BasicLayout = ({children}: { children: ReactNode }) => {
    // const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
    const [activeKeys, setActiveKeys] = useState(['/home'])
    const router = useRouter()
    const pathname = usePathname()
    console.log('pathname', pathname)
    const isLoginPage = pathname.startsWith(('/login'))
    const pushState: MenuProps['onClick'] = (e) => {
        router.push(e.key)
        setActiveKeys([e.key])
    }
    return (
        isLoginPage ? children :
            <Layout>
                <Header className={'sticky flex items-center top-0'}>
                    <div className="demo-logo"/>
                    <Menu
                        theme="dark"
                        selectedKeys={activeKeys}
                        onClick={pushState}
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        items={items}
                        style={{flex: 1, minWidth: 0}}
                    />
                </Header>
                <Content style={{padding: '0 48px'}}>
                    <div
                        style={{
                            minHeight: 280,
                            padding: 24,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    Ant Design ©{new Date().getFullYear()} Created by Ant UED
                </Footer>
            </Layout>
    );
};

export default BasicLayout;