import {PlusOutlined} from '@ant-design/icons';
import {
    ModalForm,
    ProFormSelect,
    ProFormText,
} from '@ant-design/pro-components';
import {Button, Form, message} from 'antd';
import {useState} from "react";

export default () => {
    const [form] = Form.useForm<{ name: string; company: string }>();
    const [open, setOpen] = useState<boolean>(false)

    const insert = async (value) => {
        const res = await fetch('http://169.254.151.235:3000/api/todos', {method: 'POST', body: value})
        const {data} = await res.json()
        message.success('操作成功')
        setOpen(false)
    }


    return (
        <ModalForm<{
            name: string;
            company: string;
        }>
            title="创建任务"
            open={open}
            onOpenChange={setOpen}
            trigger={
                <Button type="primary">
                    <PlusOutlined/>
                    创建任务
                </Button>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                onCancel: () => console.log('run'),
            }}
            submitTimeout={2000}
            onFinish={insert}
        >
            <ProFormText
                name="task"
                label="任务名称"
                placeholder="请输入名称"
            />
            <ProFormText name="link" label="任务链接"/>
            <ProFormSelect
                request={async () => [
                    {
                        value: 'chapter',
                        label: '盖章后生效',
                    },
                ]}
                width="sm"
                name="status"
                label="任务状态"
            />
        </ModalForm>
    );
};