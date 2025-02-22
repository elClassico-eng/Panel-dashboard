import { useAuth } from "@/store/store";

import { Title } from "@/components/Title/Title";

export const Home = () => {
    const { user, isLoading, error } = useAuth();

    if (isLoading) return <p>Loading ...</p>;
    if (error)
        return <p className="text-red text-xl">Error: {error.message}</p>;

    return <Title title={`Hi, ${user.firstName}!`} />;
};
