import axios from 'axios';

const API_URL = 'https://api.alankaarjewellers.com/api';

// Add a request interceptor to include the auth token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth APIs
export const loginAdmin = async (credentials) => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
    }
    return response.data;
};

export const verifyAdminToken = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/verify`);
        return response.data;
    } catch (error) {
        localStorage.removeItem('adminToken');
        throw error;
    }
};

export const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
};

export const fetchProducts = async (category) => {
    try {
        const params = category && category !== 'All' ? { category } : {};
        const response = await axios.get(`${API_URL}/products`, { params });
        return response.data;
    } catch (error) {
        console.error("API Error: fetchProducts failed", error);
        throw error;
    }
};

export const fetchProductById = async (id) => {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
};

export const createProduct = async (formData) => {
    const response = await axios.post(`${API_URL}/products`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateProduct = async (id, formData) => {
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/products/${id}`);
    return response.data;
};

export const deleteProductImage = async (imageId) => {
    const response = await axios.delete(`${API_URL}/products/images/${imageId}`);
    return response.data;
};

// Categories
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_URL}/categories`);
        return response.data;
    } catch (error) {
        console.error("API Error: fetchCategories failed", error);
        throw error;
    }
};

export const createCategory = async (formData) => {
    const response = await axios.post(`${API_URL}/categories`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const updateCategory = async (id, formData) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.data;
};

// Subcategories
export const fetchSubcategories = async (category_name) => {
    const response = await axios.get(`${API_URL}/categories/${encodeURIComponent(category_name)}/subcategories`);
    return response.data;
};

export const createSubcategory = async (category_name, data) => {
    const response = await axios.post(`${API_URL}/categories/${encodeURIComponent(category_name)}/subcategories`, data);
    return response.data;
};

export const deleteSubcategory = async (id) => {
    const response = await axios.delete(`${API_URL}/subcategories/${id}`);
    return response.data;
};

// Filter Options
export const fetchFilterOptions = async () => {
    const response = await axios.get(`${API_URL}/filters`);
    return response.data;
};

export const createFilterOption = async (filter_type, name) => {
    const response = await axios.post(`${API_URL}/filters`, { filter_type, name });
    return response.data;
};

export const deleteFilterOption = async (id) => {
    const response = await axios.delete(`${API_URL}/filters/${id}`);
    return response.data;
};

// ================= COUPONS API ================= //
export const fetchCoupons = async () => {
    const response = await axios.get(`${API_URL}/coupons`);
    return response.data;
};
export const createCoupon = async (data) => {
    const response = await axios.post(`${API_URL}/coupons`, data);
    return response.data;
};
export const toggleCouponStatus = async (id, is_active) => {
    const response = await axios.put(`${API_URL}/coupons/${id}/status`, { is_active });
    return response.data;
};
export const deleteCoupon = async (id) => {
    const response = await axios.delete(`${API_URL}/coupons/${id}`);
    return response.data;
};
export const validateCoupon = async (code, cartTotal) => {
    const response = await axios.post(`${API_URL}/validate-coupon`, { code, cartTotal });
    return response.data;
};

// Orders API
export const createOrder = async (orderData) => {
    const response = await axios.post(`${API_URL}/orders`, orderData);
    return response.data;
};

export const fetchOrders = async () => {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await axios.put(`${API_URL}/orders/${id}/status`, { status });
    return response.data;
};

// Site Settings (e.g. hero image)
export const fetchSetting = async (key) => {
    try {
        const response = await axios.get(`${API_URL}/settings/${key}`);
        return response.data;
    } catch (error) {
        console.error(`API Error: fetchSetting(${key}) failed`, error);
        throw error;
    }
};

export const uploadSetting = async (key, formData) => {
    const response = await axios.post(`${API_URL}/settings/${key}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
