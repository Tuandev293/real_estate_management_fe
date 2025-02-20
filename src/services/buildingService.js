import axiosClient from "./axiosClient";

const buildingService = {
  getAll: (page, sortOrder, search) =>
    axiosClient.get(
      `/buildings?page=${page}&sort_order=${sortOrder}&key_word=${search}`
    ),
  findById: (id) => axiosClient.get(`/buildings/detail/${id}`),
  create: (data) =>
    axiosClient.post(`buildings/create`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, data) =>
    axiosClient.post(`/buildings/edit/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  delete: (id) => axiosClient.delete(`/buildings/destroy/${id}`),
};

export default buildingService;
