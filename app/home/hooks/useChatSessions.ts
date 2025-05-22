import React, {useEffect, useRef, useState} from "react";
import {useIndexedDB} from "../../../hooks/useIndexedDB";
import {ChatType} from "../page";
import {useXAgent, useXChat} from '@ant-design/x';
import {useSessionStore} from "../../../store/sesseionStore";

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
const MODEL = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
const API_KEY = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY;

type MessageType = {
  role: string;
  content: string;
};

function getDayStatus(timestamp) {
  const now = new Date();

  // 设置为当天 0 点时间
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  if (timestamp >= todayStart) {
    return '今天';
  } else if (timestamp >= yesterdayStart) {
    return '昨天';
  } else {
    return '更早';
  }
}

function sideDataFormat(data) {
  return data.reduce((previousValue, currentValue, currentIndex, array) => {
    const time = getDayStatus(currentValue.id)
    previousValue = [
      ...previousValue,
      {
        key: currentValue.id,
        label: currentValue.message?.[0]?.message?.content,
        timestamp: currentValue.id,
        group: time
      }
    ]
    return previousValue
  }, [])
}

const useChatSessions = () => {
  const {ready, getAll, add, getItem, update} = useIndexedDB<ChatType>('chat_db', 'chats');

  const {currentSessionID, setCurrentSessionID, setSessionList, setCurrentSession} = useSessionStore()

  const [isNewChat, setIsNewChat] = useState(true);

  const [agent] = useXAgent<MessageType>({
    baseURL: BASE_URL,
    model: MODEL,
    dangerouslyApiKey: `Bearer ${API_KEY}`,
    /** 🔥🔥 Its dangerously! */
  });

  const abortController = useRef<AbortController | null>(null);

  const {onRequest, messages, setMessages} = useXChat({
    agent,
    requestFallback: (_, {error}) => {
      if (error.name === 'AbortError') {
        return {
          content: 'Request is aborted',
          role: 'assistant',
        };
      }
      return {
        content: 'Request failed, please try again!',
        role: 'assistant',
      };
    },
    requestPlaceholder: () => {
      return {
        content: 'Please wait...',
        role: 'assistant',
      };
    },
    transformMessage: (info) => {
      const {originMessage, chunk} = info || {};
      let currentText = ''
      try {
        if (chunk?.data && !chunk?.data.includes('DONE')) {
          const message = JSON.parse(chunk?.data);
          currentText = !message?.choices?.[0].delta?.reasoning_content
            ? ''
            : message?.choices?.[0].delta?.reasoning_content;
        }

      } catch (error) {
        console.error(error);
      }
      return {
        content: (originMessage?.content || '') + currentText,
        role: 'assistant',
      }
    },
    resolveAbortController: (controller) => {
      abortController.current = controller;
    },
  });

  let updateSourceRef = useRef<'ai' | 'history'>('ai')

  useEffect(() => {
    if (ready) {
      fetchAll()
    }
  }, [ready]);

  useEffect(() => {
    if (messages.length > 0 && updateSourceRef.current === 'ai') {
      insertTDB(messages)
    }
  }, [messages, updateSourceRef.current]);

  const fetchAll = async () => {
    const res = await getAll()
    if (res.length === 0) return

    const formatted = sideDataFormat(res.reverse())
    const activeID = formatted[0]?.key
    console.log('activeID', activeID)
    updateSourceRef.current = 'history'

    getSession(activeID)
    setSessionList(formatted)
    setCurrentSessionID(activeID)
  }
  const switchSession = (id: string) => {
    console.log('switchSession')
    setCurrentSessionID(id)
    getSession(id)
    updateSourceRef.current = 'history'
  }
  useEffect(() => {
    setCurrentSession([...messages])
  }, [messages]);

  const getSession = async (id) => {
    const res = await getItem(id)
    console.log('res?.message', res?.message)
    setMessages(res?.message)
  }

  const sendMessage = async (nextContent: string) => {
    console.log('sendMessage', nextContent)
    updateSourceRef.current = 'ai'
    const timestamp = Date.now().toString()
    if (isNewChat) {
      await add({id: timestamp, message: []})
      setCurrentSessionID(timestamp)
      setIsNewChat(false)
    }
    const sessionID = isNewChat ? timestamp : currentSessionID

    onRequest({
      stream: true,
      params: {
        sessionID,
      },
      message: {
        role: 'user',
        content: nextContent,
      },
    });
  }
  const newSession = () => {
    setIsNewChat(true)
    setMessages([])
    setCurrentSession([])
    setCurrentSessionID('')
  }

  const insertTDB = async (msg) => {
    console.log('insertTDB', currentSessionID, msg)

    await update(currentSessionID, {id: currentSessionID, message: msg})
    await fetchAll()
  }


  return {
    loading: agent.isRequesting(),
    sendMessage,
    isNewChat,
    abortController,
    switchSession,
    newSession,
    insertTDB
  }
}
export default useChatSessions