import { useAuth } from "@/store/userStore";
import { useEffect } from "react";

import { Title } from "@/components/Title/Title";
import { Loader } from "@/components/Loader/Loader";
import { ErrorMessage } from "@/components/Error/ErrorMessage";

import testAvatar from "@/assets/images/testAvatar.png";

export const Team = () => {
    const { user, users, fetchUsers, isLoading, error } = useAuth();

    console.log(user);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    if (isLoading) return <Loader />;
    if (error) return <ErrorMessage message={error} />;
    if (!users || users.length === 0) return <p>Users not found</p>;

    return (
        <>
            <Title title="Team" />
            <div className="flex flex-col justify-center items-center gap-5 w-full h-full backdrop-blur-xl">
                <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-12 xl:grid-cols-2">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-3xl">
                            Meet our leadership
                        </h2>
                        <p className="mt-6 text-md/8 text-gray-600">
                            We’re a dynamic group of individuals who are
                            passionate about what we do and dedicated to
                            delivering the best results for our clients.
                        </p>
                    </div>
                    <ul
                        role="list"
                        className="grid gap-x-8 gap-y-12 sm:grid-cols-3 sm:gap-y-16 xl:col-span-2"
                    >
                        {users.map((team, index) => (
                            <li key={team.id || index}>
                                <div
                                    className={`flex flex-col gap-6 border p-3  rounded-lg cursor-pointer transition-all `}
                                >
                                    <div className="w-full h-42  bg-cover bg-no-repeat bg-center mb-10">
                                        <img
                                            src={
                                                user?.profilePhoto
                                                    ? user?.profilePhoto
                                                    : testAvatar
                                            }
                                            alt="User avatar"
                                            className="rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-lg/7 font-semibold tracking-tight text-black">
                                            {team.firstName} {team.lastName}{" "}
                                            {user.firstName ===
                                                team.firstName &&
                                            user.lastName === team.lastName ? (
                                                <span>(you)</span>
                                            ) : null}
                                        </h3>
                                        <p className="text-sm/8 font-semibold text-neutral-700">
                                            {team.role}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
