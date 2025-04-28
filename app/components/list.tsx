'use client';

import React from 'react';
import {Avatar, Button, List} from 'antd';

interface IListCom {
    data: Record<string, any>
}

const insert = async () => {
    const res = await fetch('http://169.254.151.235:3000/api/todos', {method: 'POST'})
    const {data} = await res.json()
    console.log('insert', data)
}
const ListCom: React.FC<IListCom> = ({data = []}) => (
    <div>
        <Button onClick={insert}>click insert</Button>

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
    </div>
);

export default ListCom;


