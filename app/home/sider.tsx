import React, {useEffect} from 'react';
import {cn} from "../../lib/utils";
import {CommentOutlined} from '@ant-design/icons';
import {Conversations} from '@ant-design/x';
import {type GetProp, Space} from 'antd';
import ToolBox from "./components/toolBox";
import useChatSessions from "./hooks/useChatSessions";
import {useSessionStore} from "../../store/sesseionStore";


const groupable: GetProp<typeof Conversations, 'groupable'> = {
  sort(a, b) {
    if (a === b) return 0;

    return a === 'Today' ? -1 : 1;
  },
  title: (group, {components: {GroupTitle}}) =>
    group ? (
      <GroupTitle>
        <Space>
          <CommentOutlined/>
          <span>{group}</span>
        </Space>
      </GroupTitle>
    ) : (
      <GroupTitle/>
    ),
};
const style = {
  width: 256,
};


export default () => {
  const {switchSession} = useChatSessions()
  const {sessionList, currentSessionID} = useSessionStore()


  return <div className={cn('h-full overflow-y-auto')}>
    <div className={cn('flex sticky top-0   bg-[#f5f5f5]')}><ToolBox/></div>
    <Conversations
      style={style}
      groupable={groupable}
      onActiveChange={(v) => switchSession(v)}
      activeKey={currentSessionID}
      items={sessionList}
    />
  </div>
}