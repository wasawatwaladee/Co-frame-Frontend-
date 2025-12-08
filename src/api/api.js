import axios from "axios";
import { siteConfig } from "../constant/config";
import useUserStore from "../stores/Store";

export async function fetchMovies() {
  const res = await fetch(`${siteConfig.SERVER_URL}/movies`);
  return res.json(res);
}

export async function fetchMovie(id) {
  const res = await fetch(`${siteConfig.SERVER_URL}/${id}`);
  return res.json();
}


 const authApi = axios.create({
    baseURL:`${siteConfig.SERVER_URL}`
})

authApi.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default authApi


