import api from './api';

export const createBooking = (data) => api.post('/bookings', data);

export const getUserBookings = (userId) =>
    api.get(`/bookings/user/${userId}`);

export const getProviderBookings = (providerId) =>
    api.get(`/bookings/provider/${providerId}`);

export const acceptBooking = (id) =>
    api.put(`/bookings/${id}/accept`);

export const rejectBooking = (id) =>
    api.put(`/bookings/${id}/reject`);

export const completeBooking = (id) =>
    api.put(`/bookings/${id}/complete`);

export const getBookingById = (id) =>
    api.get(`/bookings/${id}`);