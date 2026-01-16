// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://202.10.38.120:5000/api",
  withCredentials: true, // ⬅⬅⬅ WAJIB
});

export default api;
