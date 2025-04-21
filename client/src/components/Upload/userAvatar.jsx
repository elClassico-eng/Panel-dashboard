import { useAuth } from "@/store/userStore";
import { useFile } from "@/store/fileStore";
import { useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

import { PulseLoader } from "react-spinners";
import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    );
};
