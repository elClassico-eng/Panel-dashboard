import { useEffect, useState } from "react";

import { useAuth } from "../../store/store";
import { UploadAvatar } from "./UploadAvatar";

import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";

export const Profile = () => {
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        city: "",
        teamStatus: "",
        phoneNumber: "",
        avatar: null,
    });

    const user = useAuth((state) => state.user);
    const fetchProfile = useAuth((state) => state.fetchProfile);
    const updateProfile = useAuth((state) => state.updateProfile);
    const uploadAvatar = useAuth((state) => state.uploadAvatar);

    console.log(user);

    // Fetch user profile data when component mounts or when fetchProfile is called again
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Update profile data state when user data changes
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                city: user.city || "",
                teamStatus: user.teamStatus || "",
                phoneNumber: user.phoneNumber || "",
                avatar: user.avatar || "",
            });
        }
    }, [user]);

    //Save profile data
    const handleSaveProfile = async () => {
        try {
            await updateProfile(profileData);
        } catch (error) {
            console.log("Error updating profile: ", error);
        }
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    // Upload avatar
    const handleSetAvatar = async (e) => {
        try {
            const file = e.target.files[0];
            if (file) {
                await uploadAvatar(file);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <article className="w-full h-auto  flex flex-col  gap-10 ml-12 mr-12 py-5">
            <div className="flex flex-col gap-5 bg-black text-white rounded-2xl px-6 py-8 w-1/2">
                <h2 className="text-md font-bold">My Profile</h2>

                <section className="flex gap-4 w-full ">
                    <div className="flex gap-5 items-center justify-center">
                        <label htmlFor="avatar-upload">
                            {user.profilePhoto ? (
                                <img
                                    className="w-full h-full rounded-full"
                                    src={user.profilePhoto}
                                    alt="Profile Avatar"
                                />
                            ) : (
                                <div className="flex justify-center items-center w-20 h-20 rounded-full bg-neutral-300 text-black cursor-pointer border border-black">
                                    <PersonOutlineOutlinedIcon
                                        style={{ fontSize: 26 }}
                                    />
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="avatar-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleSetAvatar}
                        />
                        <div className="flex flex-col w-full gap-1">
                            <h3 className="text-md font-medium">
                                {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm font-medium text-white/80">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="flex flex-col gap-5 border px-6 py-8 rounded-2xl border-neutral-300 w-1/2">
                <div className="flex gap-2 items-center">
                    <h2 className="text-md font-bold">Personal Information</h2>
                    <EditOutlinedIcon
                        className="cursor-pointer"
                        style={{ fontSize: 20 }}
                    />
                </div>

                <section className="grid grid-cols-2 gap-4 w-full">
                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm text-neutral-400">
                            First Name
                        </span>
                        <p className="text-base text-black">{user.firstName}</p>
                    </div>

                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm text-neutral-400">
                            Last Name
                        </span>
                        <p className="text-base text-black">{user.lastName}</p>
                    </div>

                    <div className="w-full flex flex-col gap-1">
                        <span className="text-sm text-neutral-400">
                            Email address
                        </span>
                        <p className="text-base text-black">{user.email}</p>
                    </div>
                </section>
            </div>
        </article>
    );
};
