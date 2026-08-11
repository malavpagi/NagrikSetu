import api from "./axios.js";

export const getOfficialsApi = async (isActive) => {
  const res = await api.get(`/admin/officials?active=${isActive}`);
  return res.data;
};

export const updateOfficialApi = async (id, data) => {
  const res = await api.put(`/admin/officials/${id}`, data);
  return res.data;
};

export const deleteOfficialApi = async (id) => {
  const res = await api.delete(`/admin/officials/${id}`);
  return res.data;
};

export const getDepartmentsApi = async () => {
  const res = await api.get("/admin/departments");
  return res.data;
};

export const createOfficialApi = async (officialData) => {
  const res = await api.post("/admin/officials", officialData);
  return res.data;
};