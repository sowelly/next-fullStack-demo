"use client"
import Sider from "./sider";
import Chat from "./chat";
import {cn} from "../../lib/utils";
import {Splitter} from "antd";
import React, {useContext, useEffect, useRef, useState} from "react";
import SettingModal from "./components/settingModal";
import ToolBox from "./components/toolBox";
import WelcomeCom from "./welcome";
import useChatSessions from "./hooks/useChatSessions";

type ChatContextType = {
  sideOpen: boolean
  setSideOpen: (value: (((prevState: boolean) => boolean) | boolean)) => void
  // isNewChatRef: boolean
  // chatID: string;
  // setChatID: React.Dispatch<React.SetStateAction<string>>;

};
export type ChatType = {
  id: string;
  message: { role: 'user' | 'assistant'; content: string }[];
  status?: 'success' | 'pending' | 'error';
};

const ChatContext = React.createContext<ChatContextType | null>(null)
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
}
export const commonOptions = {
  dbName: 'multiDB',
  version: 1,
  storeNames: ['messages', 'chats']
}

export default function HomeLayout() {
  const sizes = ['25%', '85%']
  const {messages} = useChatSessions()
  const [sideOpen, setSideOpen] = useState(true)


  return <ChatContext.Provider value={{sideOpen, setSideOpen}}>
    <Splitter>
      <Splitter.Panel size={sideOpen ? sizes[0] : 0} resizable={false}>
        <Sider/>
      </Splitter.Panel>
      <Splitter.Panel size={sizes[1]}>
        <div className={cn(sideOpen ? "hidden" : "")}>
          <ToolBox/>
        </div>
        <div className={cn('mx-auto w-[95%] h-full')}>
          <Chat/>
        </div>
      </Splitter.Panel>
    </Splitter>
    <SettingModal/>
  </ChatContext.Provider>
}