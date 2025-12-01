import { create } from "zustand";
import { createJSONStorage, persist} from "zustand/middleware"
import { authApi } from "../api/api";

const useUserStore = create (persist((set,get)=> ({
    user : null,
    token: '',
    isDarkMode: true, //Kay
    login: async(input) => {
      const resp = await authApi.post('/api/auth/login',input)
      console.log('resp', resp)
       set({token:resp.data.token,
            user:resp.data.user
        })
        return resp
    },
    logout : ()=> set({
      token: '', 
      user: null,
      isLoggedIn: false,
     }),
    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })) //Kay
}), {
    name: 'useUserStore',
    storage : createJSONStorage(() => localStorage )
}))

export default useUserStore