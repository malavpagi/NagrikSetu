import api from "./axios.js";

export const getOfficialComplaintsApi = async (category) => {
  const res = await api.get(`/official/complaints?category=${category}`);
  return res.data;
};

export const updateComplaintStatusApi = async (id, data) => {
  const res = await api.patch(`/official/complaints/${id}/status`, data);
  return res.data;
};