import api from "./axios";

export const registerUserFunct = async (userData)=>{
    const response = await api.post("/auth/register", userData);
    return response.data;
}

export const loginUserFunct = async (userData)=>{
    const response = await api.post("/auth/login", userData);
    return response.data;
}
