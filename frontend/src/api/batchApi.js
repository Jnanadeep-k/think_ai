import api from "./axios";

export const getBatches = (search = "") =>
  api.get(`/batches?search=${search}`);

export const getBatchById = (id) =>
  api.get(`/batches/${id}`);

export const createBatch = (data) =>
  api.post("/batches", data);

export const updateBatch = (id, data) =>
  api.put(`/batches/${id}`, data);

export const deleteBatch = (id) =>
  api.delete(`/batches/${id}`);