import React, {useEffect, useRef, useState} from "react";
import {useIndexedDB} from "../../../hooks/useIndexedDB";
import {ChatType} from "../page";
import OpenAI from 'openai'
import {useSessionStore} from "../../../store/sesseionStore";

const BASE_URL = 'https://api.siliconflow.cn/v1';
const MODEL = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
const API_KEY = process.env.NEXT_PUBLIC_SILICONFLOW_API_KEY;


const streamFromRes = (response): string => {
  let content = response.choices?.[0]?.delta.content
  console.log('content', content)

  return content
}


const client = new OpenAI({
  baseURL: BASE_URL,
  apiKey: API_KEY,
  dangerouslyAllowBrowser: true
})

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
        label: currentValue.message?.[0]?.content,
        timestamp: currentValue.id,
        group: time
      }
    ]
    return previousValue
  }, [])
}

const useChatSessions = () => {
  const {ready, getAll, add, getItem, update, updateMsg} = useIndexedDB<ChatType>('chat_db', 'chats');
  const currentSessionID = useSessionStore(s => s.currentSessionID)
  const setCurrentSessionID = useSessionStore(s => s.setCurrentSessionID)
  const setSessionList = useSessionStore(s => s.setSessionList)
  const setCurrentSession = useSessionStore(s => s.setCurrentSession)
  const currentSession = useSessionStore(s => s.currentSession)

  const [isNewChat, setIsNewChat] = useState(true);
  let updateSourceRef = useRef<'ai' | 'history'>('ai')

  const [abortController, setAbortController] = useState<AbortController | null>(null)


  useEffect(() => {
    if (ready) {
      fetchAll()
    }
  }, [ready]);

  const fetchAll = async () => {
    const res = await getAll()
    if (res.length === 0) return

    const formatted = sideDataFormat(res.reverse())
    const activeID = formatted[0]?.key
    updateSourceRef.current = 'history'

    getSession(activeID)
    setSessionList(formatted)
    setCurrentSessionID(activeID)
  }
  const switchSession = (id: string) => {
    setCurrentSessionID(id)
    getSession(id)
    updateSourceRef.current = 'history'
  }


  const getSession = async (id) => {
    const res = await getItem(id)
    setCurrentSession(res?.message)
  }

  useEffect(() => {
    setIsNewChat(currentSessionID === '')
  }, [currentSessionID]);
  const abort = () => {
    abortController?.abort()
  }
  const sendMessage = async (nextContent: string) => {
    updateSourceRef.current = 'ai'
    const sessionID = isNewChat ? Date.now().toString() : currentSessionID

    setAbortController(new AbortController())

    if (isNewChat) {
      await add({id: sessionID, message: []})
      setCurrentSessionID(sessionID)
    }
    setCurrentSession(prev => [...prev, {
        role: 'user',
        content: nextContent
      }, {
        role: 'assistant',
        content: ''
      }]
    )

    await insertTDB({
        role: 'user',
        content: nextContent
      },
      sessionID)
    await insertTDB({
        role: 'assistant',
        content: '...'
      },
      sessionID)
    onRequest({content: nextContent, sessionID});
  }


  const onRequest = async ({content, sessionID}) => {
    const completions = await client.chat.completions.create({
      model: MODEL,
      stream: true,
      messages: [
        {
          role: 'user',
          content,
          sessionID,
        }
      ]
    }, {
      signal: abortController?.signal
    })

    try {
      let fullReply = ''
      for await (const chunk of completions) {
        const delta = chunk.choices?.[0]?.delta
        const text = delta?.content || '';
        if (!text) continue;
        fullReply += text

        // 为了及时的每个字更新上去
        await new Promise(resolve => setTimeout(resolve, 0))

        setCurrentSession(prev => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          const last = updated[lastIndex];

          if (last?.role === 'assistant') {
            updated[lastIndex] = {
              ...last,
              content: fullReply
            };
          }

          return updated;
        })
      }

      console.log('finish')

      await insertTDB({role: 'assistant', content: fullReply}, sessionID, true)
      setAbortController(null)
    } catch (e) {
      if (e.name === 'AbortError') {
        console.warn('请求被用户终止');
      } else {
        console.error('流式出错：', e);
      }
    }
  }

  const newSession = () => {
    setCurrentSession([])
    setCurrentSessionID('')
  }

  const insertTDB = async (msg: MessageType, sessionID, isUpdateAssistantReplay?: boolean) => {
    console.log('insertTDB', sessionID, msg)
    const row = await getItem(sessionID)
    let newMessage = []
    if (isUpdateAssistantReplay) {
      const targetIndex: number = row?.message.findLastIndex((r: MessageType) => r.content === '...' && r.role === 'assistant')
      if (targetIndex !== -1) {
        row?.message.splice(targetIndex, 1, msg)
      }
      newMessage = [...row?.message]
    } else {
      newMessage = [...row?.message, msg]
    }

    await update(sessionID, {id: sessionID, message: newMessage})
    await fetchAll()
  }


  return {
    sendMessage,
    abort,
    isNewChat: currentSessionID === '',
    switchSession,
    newSession,
    insertTDB,
  }
}
export default useChatSessions