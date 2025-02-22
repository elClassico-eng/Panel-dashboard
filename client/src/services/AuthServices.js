import { $api } from "../http";

export const authServices = {
    registration: async (email, password, firstName, lastName) => {
        return $api.post("users/registration", {
            email,
            password,
            firstName,
            lastName,
        });
    },

    login: async (email, password) => {
        return $api.post("users/login", { email, password });
    },

    logout: async () => {
        return $api.post("users/logout");
    },

    fetchUsers: async () => {
        return $api.get("users/team");
    },

    refreshToken: async () => {
        return $api.get("users/refresh");
    },

    fetchProfile: async () => {
        return $api.get("users/profile");
    },

    // uploadAvatar: async (file) => {
    //     const formData = new FormData();
    //     formData.append("avatar", file);

    //     try {
    //         const response = await $api.post(`/upload-avatar`, formData);
    //         return response.data;
    //     } catch (error) {
    //         console.error("Error adding photo", error);
    //         throw error;
    //     }
    // },
};
