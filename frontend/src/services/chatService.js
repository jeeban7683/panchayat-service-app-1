import api from './api';

export const getChatHistory = async (senderId, receiverId) => {
  const response = await api.get('/chat/history', {
    params: { senderId, receiverId }
  });
  return response.data;
};

export const getConversations = async (userId) => {
  const response = await api.get('/chat/conversations', {
    params: { userId }
  });
  return response.data;
};

export const getAdmins = async () => {
  const response = await api.get('/chat/admins');
  return response.data;
};

export const getAllContacts = async (excludeRole) => {
  const response = await api.get('/chat/contacts', {
    params: { excludeRole }
  });
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};
