import { useAuth } from "@/store/userStore";
import { Loader } from "@/components/Loader/Loader";

import { Title } from "@/components/Title/Title";

export const Home = () => {
    const { user, isLoading, error } = useAuth();

    if (isLoading) return <Loader />;
    if (error)
        return <p className="text-red text-xl">Error: {error.message}</p>;

    return <Title title={`Hi, ${user.firstName}!`} />;
};
