import { create } from "zustand";
import { createJSONStorage, persist} from "zustand/middleware"

const useUserStore = create ( persist ((set,get)=> ({
    user : null,
    accessToken: '',
    isLoggedIn: false,
    
    login: (userData ,tokenValue,) => set({ 
      user: userData, 
      accessToken: tokenValue,
      isLoggedIn: true 
  }),
    logout : ()=> set({
      accessToken: '', 
      user: null,
      isLoggedIn: false,
     })
}), {
    name: 'useState',
    storage : createJSONStorage(() => localStorage )
}))

export default useUserStore