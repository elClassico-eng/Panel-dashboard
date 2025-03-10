import { $api } from "../http";

export const authServices = {
    registration: async (
        email,
        password,
        firstName,
        lastName,
        profilePhoto
    ) => {
        return $api.post("users/registration", {
            email,
            password,
            firstName,
            lastName,
            profilePhoto,
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
};
