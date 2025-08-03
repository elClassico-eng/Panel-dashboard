import { useAuth } from "@/store/userStore";
import { useRef } from "react";
import { useTheme } from "@/hooks/use-theme";

import { PulseLoader } from "react-spinners";
import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserAvatar = () => {
    const { user, uploadAvatar, isLoading, error } = useAuth();
    const fileInputRef = useRef(null);

    const { theme } = useTheme();

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            await uploadAvatar(file);
        } catch (error) {
            console.error("Error upload file: ", error);
        }
    };

    const getAvatarUrl = () => {
        if (user?.profilePhoto) {
            // If profilePhoto starts with http, use it as is
            if (user.profilePhoto.startsWith('http')) {
                return user.profilePhoto;
            }
            // Otherwise, construct URL with server base
            return `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${user.profilePhoto}`;
        }
        return null;
    };

    const getInitials = () => {
        if (user?.firstName && user?.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
        }
        return "U";
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
        <div>
            <Avatar className="cursor-pointer" onClick={handleAvatarClick}>
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};
