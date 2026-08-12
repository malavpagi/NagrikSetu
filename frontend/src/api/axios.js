import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    // baseURL: "http://10.216.19.42/api",
    withCredentials: true,
});


// ===============================
// REQUEST INTERCEPTOR
// ===============================

api.interceptors.request.use(
    (request) => {

        // Get access token from AuthContext
        const token = localStorage.getItem("accessToken");

        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }

        return request;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ===============================
// RESPONSE INTERCEPTOR
// ===============================

api.interceptors.response.use(
    (response) => {
        return response;
    },

    async (error) => {

        const originalRequest = error.config;

        // Access token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {

                // Refresh token is automatically
                // sent through HTTP-only cookie
                const response = await axios.post(
                    "http://localhost:3000/api/auth/refresh",
                    {},
                    { withCredentials: true, }
                );

                const newAccessToken = response.data.accessToken;

                // Save new access token
                localStorage.setItem(
                    "accessToken",
                    newAccessToken
                );

                // Retry original request
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return api(originalRequest);

            } catch (refreshError) {

                // Refresh token expired/invalid
                localStorage.removeItem("accessToken");

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
