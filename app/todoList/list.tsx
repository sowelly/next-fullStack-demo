'use client';

import React from 'react';
import {Avatar, Button, List} from 'antd';
import {ProColumns, ProList, ProTable, TableDropdown} from '@ant-design/pro-components';
import {DownOutlined} from "@ant-design/icons";
import CreateModal from './modal'

interface IListCom {
    data: Record<string, any>
}

type ListItem = {
    task: string;
    id: number;
    created_at: string;
};
const columns: ProColumns<ListItem>[] = [
    {
        title: '任务名称',
        width: 80,
        dataIndex: 'task',
        render: (_) => <a>{_}</a>,
    },
    {
        title: '状态',
        width: 80,
        dataIndex: 'status',
        initialValue: 'all',
        valueEnum: {
            all: {text: '全部', status: 'Default'},
            close: {text: '关闭', status: 'Default'},
            running: {text: '运行中', status: 'Processing'},
            online: {text: '已上线', status: 'Success'},
            error: {text: '异常', status: 'Error'},
        },
    },
    {
        title: '创建时间',
        width: 80,
        dataIndex: 'created_at',
        valueType: 'dateTime'
    },
    {
        title: '操作',
        width: 180,
        key: 'option',
        valueType: 'option',
        render: () => [
            <a key="link">链路</a>,
            <a key="link2">报警</a>,
            <a key="link3">监控</a>,
            <TableDropdown
                key="actionGroup"
                menus={[
                    {key: 'copy', name: '复制'},
                    {key: 'delete', name: '删除'},
                ]}
            />,
        ],
    },
];
const ListCom: React.FC<IListCom> = ({data = []}) => (
    <ProTable<ListItem>
        dataSource={data}
        rowKey="id"
        pagination={{
            showQuickJumper: true,
        }}
        columns={columns}
        search={false}
        dateFormatter="string"
        toolBarRender={() => [
            <Button key="show">查看日志</Button>,
            <Button key="out">
                导出数据
                <DownOutlined/>
            </Button>,
            <CreateModal/>
        ]}
    />
);

export default ListCom;


