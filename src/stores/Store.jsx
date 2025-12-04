import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { authApi } from "../api/api";
import axios from "axios";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      token: "",
      isDarkMode: true, //Kay
      login: async (input) => {
        const resp = await authApi.post("/api/auth/login", input);
        console.log("resp", resp);
        set({ token: resp.data.token, user: resp.data.user });
        return resp;
      },

      googleLogin: async (idToken) => {

    const API_URL = 'http://localhost:5500/api/auth/google/login';

    const res = await axios.post(API_URL, { idToken });

    const { token: appToken, user: userProfile } = res.data;

    const currentIsDarkMode = get().isDarkMode;
    localStorage.removeItem('useUserStore');

    set({
        token: appToken,
        user: userProfile,
        isDarkMode: currentIsDarkMode,
    });
    return res;
},

      logout: () => {
        set({
          token: "",
          user: null,
          isLoggedIn: false,
        });
        localStorage.removeItem("useUserStore")
      },

      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "useUserStore",
      storage: createJSONStorage(() => localStorage),
    }
  )
);



   

export default useUserStore;
