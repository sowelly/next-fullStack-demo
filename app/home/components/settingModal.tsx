import React, {useEffect, useState} from 'react';
import { Modal} from 'antd';
import {useLocalStorageState} from 'ahooks';
import Setting from "./setting";

const SettingModal: React.FC = () => {
  const [settingState, setSettingState] = useLocalStorageState<boolean>(
    'user-has-setting',
    {
      defaultValue: false,
    },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setSettingState(true)
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkSetting = () => {
    showModal()
  }
  const setCallback = () => {
    setIsModalOpen(false)
    setSettingState(true)
  }

  useEffect(() => {
    if (!settingState) checkSetting()
  }, [checkSetting, settingState]);

  return (
    <>
      <Modal
        width={800}
        title="快捷登录"
        closable={{'aria-label': 'Custom Close Button'}}
        open={isModalOpen}
        footer={null}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Setting setCallback={setCallback}/>
      </Modal>
    </>
  );
};

export default SettingModal;