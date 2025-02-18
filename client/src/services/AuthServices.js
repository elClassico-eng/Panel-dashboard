import { $api } from "../http";

export const authServices = {
    registration: async (
        email,
        password,
        firstName,
        lastName,
        city,
        teamStatus,
        phoneNumber
    ) => {
        return $api.post("/registration", {
            email,
            password,
            firstName,
            lastName,
            city,
            teamStatus,
            phoneNumber,
        });
    },

    login: async (email, password) => {
        return $api.post("/login", { email, password });
    },

    logout: async () => {
        return $api.post("/logout");
    },

    fetchUsers: async () => {
        return $api.get("/users");
    },
    refreshToken: async () => {
        return $api.get("/refresh");
    },

    fetchProfile: async (profileData) => {
        return $api.get(`/profile}`, profileData);
    },

    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await $api.post(`/upload-avatar`, formData);
            return response.data;
        } catch (error) {
            console.error("Error adding photo", error);
            throw error;
        }
    },
};
