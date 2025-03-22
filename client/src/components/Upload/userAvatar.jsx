import { useAuth } from "@/store/userStore";
import { useFile } from "@/store/fileStore";
import { useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

import { PulseLoader } from "react-spinners";
import { User } from "lucide-react";

export const UserAvatar = () => {
    const { user, updateProfile, isLoading, error } = useAuth();
    const { uploadAvatar } = useFile();
    const fileInputRef = useRef(null);

    const theme = useTheme();

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

    if (isLoading)
        return (
            <PulseLoader
                color={`${theme === "light" ? "#000" : "#fff"}`}
                size={9}
            />
        );
    if (error)
        return (
            <div className="w-10 h-10 flex justify-center items-center rounded-full border border-neutral-600">
                <User size={18} />
            </div>
        );

    return (
        <div
            className={`relative flex items-center justify-center cursor-pointer ${
                !user?.profilePhoto &&
                " rounded-full p-3 border border-violet-300 hover:border-violet-500 transition-all"
            }`}
        >
            {user?.profilePhoto ? (
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
            ) : (
                <User size={20} />
            )}
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
