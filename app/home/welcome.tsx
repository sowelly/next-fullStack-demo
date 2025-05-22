import {Welcome} from '@ant-design/x';
import {Button, Card, ConfigProvider, Flex, Space, theme} from 'antd';
import React from 'react';
import {cn} from "../../lib/utils";
import {EllipsisOutlined, ShareAltOutlined} from "@ant-design/icons";


const WelcomeCom = () => {
  return (
    <div className={cn('flex h-full flex-col items-center justify-center w-full')}>
      <Welcome
        variant="borderless"
        icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
        title="Hello, I'm Ant Design X"
        description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
        extra={
          <Space>
            <Button icon={<ShareAltOutlined />} />
            <Button icon={<EllipsisOutlined />} />
          </Space>
        }
      />
    </div>
  );
};

export default WelcomeCom;