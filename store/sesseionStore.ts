import {create} from "zustand";
import {persist} from "zustand/middleware";
interface Session {
  id: string
  messages: string[]
}
interface SessionState {
  currentSessionID: string
  setCurrentSessionID: (id: string) => void
  sessionList: Session[]
  setSessionList: (list: Session[]) => void
  currentSession: Session | null
  setCurrentSession: (session: Session | null) => void
}

export const useSessionStore = create<SessionState>(
  persist(
    (set) => ({
      currentSession: [],
      setCurrentSession: (val) => set({'currentSession': val}),
      currentSessionID: Date.now().toString(),
      setCurrentSessionID: (val) => set({'currentSessionID': val}),
      sessionList: [],
      setSessionList: (val) => set({'sessionList': val}),
    }),
    {
      name: 'session-store'
    }
  )
)