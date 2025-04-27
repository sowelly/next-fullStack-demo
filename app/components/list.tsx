'use client';

import React from 'react';
import {Avatar, List} from 'antd';

interface IListCom {
    data: Record<string, any>
}

const ListCom: React.FC<IListCom> = ({data = []}) => (
    <List
        itemLayout="horizontal"
        dataSource={data}
        renderItem={(item, index) => (
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}/>}
                    title={<a href="https://ant.design">{item.task}</a>}
                    description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
            </List.Item>
        )}
    />
);

export default ListCom;