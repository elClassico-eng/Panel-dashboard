import { useState, useRef } from "react";
import { useAuth } from "../../store/userStore";
export const UploadAvatar = () => {
    const fileInputRef = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const uploadAvatar = useAuth((state) => state.uploadAvatar);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const ibjectURL = URL.createObjectURL(file);
            setAvatar(ibjectURL);
        }
    };

    const handleUploadAvatar = async () => {
        try {
            if (!fileInputRef.current.files[0]) return;

            const formData = new FormData();
            formData.append("avatar", fileInputRef.current.files[0]);

            await uploadAvatar(formData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
            />
            {avatar && <img src={avatar} alt="avatar" width={100} />}
            <button onClick={handleUploadAvatar} className="cursor-pointer">
                Add photo
            </button>
        </div>
    );
};
