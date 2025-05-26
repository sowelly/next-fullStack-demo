import {create} from "zustand";
import {persist} from "zustand/middleware";

const userConfigStoreBase = (set: any, get: any) => ({
  username: '',
  setUsername: (val: string) => set({username: val}),
  password: '',
  setPassword: (val: string) => set({password: val}),
  apiKey: '',
  setApiKey: (val: string) => set({apiKey: val}),
  _hasHydrated: false,
  setHasHydrated: (val:boolean) => set({_hasHydrated: val}),
})
type UserConfig = ReturnType<typeof userConfigStoreBase>

export const userConfigStore = create<UserConfig>(
  persist(
    userConfigStoreBase,
    {
      name: 'user-config',
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log('an error happened during hydration', error)
          } else {
            console.log('hydration finished')
            state?.setHasHydrated(true)
          }
        }
      }
    }
  )
)


