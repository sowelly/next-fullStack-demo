import type {ProFormInstance} from '@ant-design/pro-components';
import {
  ProCard,
  ProForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import {message} from 'antd';
import React, {useRef} from 'react';
import {userConfigStore} from "../../../store/userConfigStore";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

interface ISettingProps {
  setCallback: () => void
}

const Setting: React.FC<ISettingProps> = ({setCallback}) => {
    const formRef = useRef<ProFormInstance | null>(null);
    const setApiKey = userConfigStore(s => s.setApiKey)
    const setPassword = userConfigStore(s => s.setPassword)
    const setUsername = userConfigStore(s => s.setUsername)

    const onFinish = async () => {
      message.success('提交成功');
      setCallback()
    }

    return (
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          formRef={formRef}
          onFinish={onFinish}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          <StepsForm.StepForm<{
            username: string;
            password: string;
          }>
            name="base"
            title="个人信息"
            stepProps={{
              description: '一键快捷登录或注册',
            }}
            onFinish={async () => {
              const {username, password} = formRef.current?.getFieldsValue()
              await waitTime(2000);
              setUsername(username)
              setPassword(password)
              return true;
            }}
          >
            <ProFormText
              name="username"
              label="用户名"
              width="md"
              tooltip="最长为 24 位"
              placeholder="请输入用户名"
              rules={[{required: true}]}
            />
            <ProFormText
              name="password"
              label="登录密码"
              width="md"
              tooltip="最长为 24 位，用于标定的唯一 id"
              placeholder="请输入名称"
              rules={[{required: true}]}
            />
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            siliconflow: string;
          }>
            name="key"
            title="设置参数"
            stepProps={{
              description: '输入通用siliconflow key',
            }}
            onFinish={async () => {
              const {siliconflow} = formRef.current?.getFieldsValue()
              setApiKey(siliconflow)
              return true;
            }}
          >
            <ProFormText
              name="siliconflow"
              label="siliconflow key"
              width="md"
              tooltip="最长为 24 位，用于标定的唯一 id"
              placeholder="请输入名称"
              rules={[{required: true}]}
            />


          </StepsForm.StepForm>

        </StepsForm>
      </ProCard>
    );
  }
;
export default Setting