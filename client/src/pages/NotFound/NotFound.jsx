import { Link } from "react-router-dom";

export const NotFound = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <p className="text-lg text-gray-600 mt-4">Page not found :(</p>
            <Link
                to="/"
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg text-lg transition hover:bg-blue-700"
            >
                Вернуться на главную
            </Link>
        </div>
    );
};
