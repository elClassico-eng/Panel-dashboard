import { useAuth } from "@/store/userStore";
import { useFile } from "@/store/fileStore";
import { useRef } from "react";

import { Loader } from "../Loader/Loader";
import { ErrorMessage } from "../Error/ErrorMessage";

import { User } from "lucide-react";

export const UserAvatar = () => {
    const { user, updateProfile, isLoading, error } = useAuth();
    const { uploadAvatar } = useFile();
    const fileInputRef = useRef(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);

        try {
            const response = await uploadAvatar(formData);
            if (response.data?.file) {
                await updateProfile({ profilePhoto: response.data.file }); // Update user profile
            }
        } catch (error) {
            console.error("Error upload file: ", error);
        }
    };

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage />;

    return (
        <div className="relative flex items-center justify-center cursor-pointer">
            <img
                src={user?.profilePhoto || null}
                alt="User Avatar"
                className={`w-10 h-10 rounded-full object-cover border-2 border-gray-300 
                    ${
                        isLoading
                            ? "opacity-50 cursor-wait"
                            : "hover:opacity-80"
                    }`}
                onClick={handleAvatarClick}
            />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />
        </div>
    );
};
