import { useAuth } from "../../store/store";

export const Profile = () => {
    const user = useAuth((state) => state.user);
    const logout = useAuth((state) => state.logout);
    return (
        <div className="flex flex-col gap-5 px-12">
            <p className="text-lg">Email: {user.email}</p>
            <button
                onClick={() => logout()}
                className="bg-indigo-600 w-fit text-white px-4 py-2 rounded-lg font-semibold shadow-md 
             hover:bg-indigo-700 hover:scale-105 transition-all duration-300 ease-in-out 
             active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
                Logout
                <span className="sr-only">Logout</span>
            </button>
        </div>
    );
};
