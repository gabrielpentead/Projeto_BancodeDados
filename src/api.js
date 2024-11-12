// src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api/products',
});

export const fetchProducts = async () => {
    const response = await api.get('/');
    return response.data;
};

export const addProduct = async (product) => {
    const response = await api.post('/', product);
    return response.data;
};