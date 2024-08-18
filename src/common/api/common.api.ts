import axios from "axios";

export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  withCredentials: true,
  headers: {
    "API-KEY": "a9e7edde-9af1-46f9-bd6b-bdceb88a71cb",
  },
});
