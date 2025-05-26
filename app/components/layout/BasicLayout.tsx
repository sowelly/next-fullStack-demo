'use client';

import React, {ReactNode, Suspense, useEffect, useState, useTransition} from 'react';
import {Layout, Menu, MenuProps} from 'antd';
import {useRouter, usePathname} from 'next/navigation';
import {cn} from "../../../lib/utils";
import Loading from "../../loading";

const {Header, Content, Footer} = Layout;

const items = [
  {
    key: '/',
    label: `index`,
  }, {
    key: '/home',
    label: `home`,
  },
  {
    key: '/makeup',
    label: `makeup`,
  },
]

const BasicLayout = ({children}: { children: ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [activeKeys, setActiveKeys] = useState([pathname || '/home'])
  const pushState: MenuProps['onClick'] = (e) => {
    startTransition(() => {
      router.push(e.key)
      setActiveKeys([e.key])
    })
  }

  return (
    <Layout>
      <Header className={'sticky flex items-center top-0 z-999'}>
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
      <Content className={cn('p-6')}>
        <div className={cn('h-[80vh] ')}>
          {isPending ? <Loading/> : children}
        </div>
      </Content>
      <Footer style={{textAlign: 'center'}}>
        Ant Design ©{new Date().getFullYear()} Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default BasicLayout;