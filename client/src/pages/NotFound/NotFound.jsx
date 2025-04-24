import { Link } from "react-router-dom";
import notFound from "@/assets/images/not_found.svg"; // Путь к вашему изображению

export const NotFound = () => {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-6xl font-bold text-gray-800">404</h1>
            <img
                src={notFound}
                alt="Страница не найдена"
                className="max-w-md"
            />
            <Link
                to="/dashboard"
                className="mt-6 px-6 py-3 bg-neutral-600 text-white rounded-lg text-lg transition hover:bg-violet-700"
            >
                Вернуться на главную
            </Link>
        </div>
    );
};
