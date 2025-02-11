import { Profile } from "../../components/Profile/Profile";
import { Title } from "../../components/Title/Title";

export const Account = () => {
    return (
        <div className="bg-blue-50 w-full h-full">
            <Title title="Profile settings" />
            <Profile />
        </div>
    );
};
