import axios from "axios";
import { siteConfig } from "../constant/config";

export async function fetchMovies() {
  const res = await fetch(`${siteConfig.SERVER_URL}/movies`);
  return res.json();
}

export async function fetchMovie(id) {
  const res = await fetch(`${siteConfig.SERVER_URL}/${id}`);
  return res.json();
}


export const authApi = axios.create({
    baseURL:`${siteConfig.SERVER_URL}`
})

