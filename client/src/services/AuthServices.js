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

        return $api.post(`/upload-avatar`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};
