import {UserOutlined} from '@ant-design/icons';
import {Bubble, Sender, useXAgent, useXChat} from '@ant-design/x';
import {Flex, type GetProp, message} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import {cn} from "../../lib/utils";
import useChatSessions from "./hooks/useChatSessions";
import WelcomeCom from "./welcome";
import {useSessionStore} from "../../store/sesseionStore";


const roles: GetProp<typeof Bubble.List, 'roles'> = {
  assistant: {
    placement: 'start',
    avatar: {icon: <UserOutlined/>, style: {background: '#fde3cf'}},
  },
  user: {
    placement: 'end',
    avatar: {icon: <UserOutlined/>, style: {background: '#87d068'}},
  },
};

const Chat = () => {
  const {loading, abortController, sendMessage} = useChatSessions()
  const {currentSession, currentSessionID} = useSessionStore()

  const [content, setContent] = React.useState('');
  useEffect(() => {
    console.log('currentSession', currentSession)
    if (currentSession.length > 0)
      setShowWelcome(false)

  }, [currentSession]);

  useEffect(() => {
    setContent('');
  }, [currentSessionID]);


  const handleSendMessage = async (nextContent) => {
    console.log('handleSendMessage', nextContent)
    setShowWelcome(false)
    await sendMessage(nextContent)
    setContent('');
  }
  const [showWelcome, setShowWelcome] = useState(true)

  return (
    <div className={cn('flex flex-col h-full')}>
      {
        showWelcome ?
          <WelcomeCom/>
          : <div className={cn('flex-1 min-h-[80%] overflow-y-auto')}>
            <Bubble.List
              style={{height: '100%'}}
              roles={roles}
              items={currentSession.map(({id, message}) => ({
                key: id,
                role: message.role,
                content: message.content,
              }))}
            />
          </div>
      }

      <div className={cn('flex-end')}>
        <Sender
          loading={loading}
          value={content}
          onCancel={() => {
            abortController?.current?.abort?.();
          }}
          onChange={setContent}
          onSubmit={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;