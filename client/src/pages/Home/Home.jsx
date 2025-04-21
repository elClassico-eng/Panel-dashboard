import { useAuth } from "@/store/userStore";
import { Loader } from "@/components/Loader/Loader";

import { ErrorMessage } from "@/components/Error/ErrorMessage";

import { Title } from "@/components/Title/Title";
import { UnderConstruction } from "@/components/UnderConstruction/UnderConstruction";

export const Home = () => {
    const { user, isLoading, error } = useAuth();

    if (isLoading) return <Loader />;
    if (error)
        return (
            <ErrorMessage
                message={
                    "Ошибка при загрузке данных, попробуйте перезагрузить приложение"
                }
            />
        );

    return (
        <div className="">
            <Title title={`Добро пожаловать, ${user.firstName}!`} />
            <UnderConstruction message="Страница находится на стадии разработки..." />
        </div>
    );
};
