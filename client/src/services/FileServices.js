import { $api } from "@/http";

export const fileServices = {
    uploadAvatar: async (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        return $api.post("files/upload-images", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};
