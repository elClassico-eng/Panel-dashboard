import { Profile } from "@/components/Profile/Profile";
import { Title } from "@/components/Title/Title";

export const Account = () => {
    return (
        <div className=" w-full h-full">
            <Title title="Аккаунт" />
            <Profile />
        </div>
    );
};
