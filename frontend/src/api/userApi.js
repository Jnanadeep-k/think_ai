import api from "./axios";

export const getUsers = (search = "") =>
  api.get(`/admin/users?search=${search}`);

export const getUserById = (id) =>
  api.get(`/admin/users/${id}`);

export const createUser = (data) =>
  api.post(`/admin/users`, data);

export const updateUser = (id, data) =>
  api.put(`/admin/users/${id}`, data);

export const deleteUser = (id) =>
  api.delete(`/admin/users/${id}`);