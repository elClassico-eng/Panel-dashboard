import { useAuth } from "@/store/store";
import { useEffect } from "react";

export const Team = () => {
    const { user, users, fetchUsers, isLoading, error } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    if (isLoading) return <p>Loading ...</p>;
    if (error)
        return <p className="text-red text-xl">Error: {error.message}</p>;
    if (!users || users.length === 0) return <p>Users not found</p>;

    console.log(user);
    console.log(users);
    return (
        <div className="flex flex-col justify-center items-center gap-5 w-full h-full  backdrop-blur-xl">
            <div class="mx-auto grid max-w-7xl gap-20 px-6 lg:px-12 xl:grid-cols-3">
                <div class="max-w-xl">
                    <h2 class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl">
                        Meet our leadership
                    </h2>
                    <p class="mt-6 text-md/8 text-gray-600">
                        We’re a dynamic group of individuals who are passionate
                        about what we do and dedicated to delivering the best
                        results for our clients.
                    </p>
                </div>
                <ul
                    role="list"
                    class="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2"
                >
                    {users.map((team) => (
                        <li key={team.id}>
                            <div className="flex items-center gap-x-6 border p-3 rounded-lg cursor-pointer hover:border-gray-600 transition-all">
                                {/* Здесь будет потом img */}
                                <div className="bg-gray-400 flex items-center justify-center text-xs text-white rounded-full size-16">
                                    Avatar
                                </div>
                                <div>
                                    <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
                                        {team.firstName} {team.lastName}
                                    </h3>
                                    <p className="text-sm/6 font-semibold text-indigo-600">
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
