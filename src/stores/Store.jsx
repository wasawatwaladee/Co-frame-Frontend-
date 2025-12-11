import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import  authApi  from "../api/api";
import axios from "axios";

const useUserStore = create(persist((set, get) => ({
    user: null,
    token: '',
    isDarkMode: true, //Kay
    movies: [],
    categories: [],


    setUser: (user) => set({ user: user }),

    login: async (input) => {
        const resp = await authApi.post('/api/auth/login', input)
        
        set({
            token: resp.data.token,
            user: resp.data.user})},
   
    
    getMovies: async() => {
        try {
            const resp = await authApi.get('/movies')
            
            set({movies:resp.data})
            return resp.data
        } catch (error) {
            console.log('Error fetching movies:', error)
            throw error
        }
    },
    getCategories:async()=>{
        try {
            const resp = await authApi.get('/api/categories')
            set({categories:resp.data.categories})

            return resp.data
        } catch (error) {
            console.log('Error fetching movies:', error)
            throw error
        }
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
            token: '',
            user: null,
            isLoggedIn: false,
        });
    },
    toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })) //Kay
}), {
    name: 'useUserStore',
    storage: createJSONStorage(() => localStorage)
}))

export default useUserStore;
