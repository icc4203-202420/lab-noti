import axios from "axios";
import { BACKEND_URL } from '@env';

export const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});