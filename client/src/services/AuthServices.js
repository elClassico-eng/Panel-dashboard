import { $api } from "../http";

export const authServices = {
    registration: async (email, password) => {
        return $api.post("/registration", { email, password });
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
};
