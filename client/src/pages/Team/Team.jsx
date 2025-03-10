import { useAuth } from "@/store/userStore";
import { useEffect } from "react";
import { Loader } from "@/components/Loader/Loader";

export const Team = () => {
    const { user, users, fetchUsers, isLoading, error } = useAuth();

    console.log(user);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); // если ESLint требует зависимость

    if (isLoading) return <Loader />;
    if (error)
        return <p className="text-red text-xl">Error: {error.message}</p>;
    if (!users || users.length === 0) return <p>Users not found</p>;

    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full h-full backdrop-blur-xl">
            <div className="mx-auto grid max-w-7xl gap-20 px-6 lg:px-12 xl:grid-cols-3">
                <div className="max-w-xl">
                    <h2 className="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                        Meet our leadership
                    </h2>
                    <p className="mt-6 text-md/8 text-gray-600">
                        We’re a dynamic group of individuals who are passionate
                        about what we do and dedicated to delivering the best
                        results for our clients.
                    </p>
                </div>
                <ul
                    role="list"
                    className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
                >
                    {users.map((team, index) => (
                        <li key={team.id || index}>
                            <div
                                className={`flex items-center gap-x-6 border p-3 rounded-lg cursor-pointer hover:border-gray-600 transition-all ${
                                    user.firstName === team.firstName &&
                                    user.lastName === team.lastName
                                        ? "bg-indigo-300"
                                        : "bg-gray-100"
                                }`}
                            >
                                <div className="bg-white flex items-center justify-center text-xs text-black rounded-full size-16">
                                    Avatar
                                </div>
                                <div>
                                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
                                        {team.firstName} {team.lastName}{" "}
                                        {user.firstName === team.firstName &&
                                        user.lastName === team.lastName ? (
                                            <span>(you)</span>
                                        ) : null}
                                    </h3>
                                    <p className="text-sm/5 font-semibold text-neutral-700">
                                        {team.role}
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
