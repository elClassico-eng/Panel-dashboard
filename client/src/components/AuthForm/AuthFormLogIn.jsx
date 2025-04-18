import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "@/store/userStore";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Loader/Loader";

import { Link } from "react-router-dom";

import { AuthError } from "../Error/AuthError";
import { emailValidation, passwordValidation } from "../../data/validation";
import { AuthVisual } from "../ui/authVisual";

export const AuthFormLogIn = () => {
    const [success, setSuccess] = useState(false);

    const { login, isLoading, error: loginError, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const onSubmit = async (data) => {
        try {
            await login(data.email, data.password);
            setSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            reset();
        }
    };

    if (isLoading) return <Loader />;

    return (
        <section className="relative py-20 flex items-center justify-center  w-full h-full bg-inherit">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center items-center"
            >
                <div className="w-15 h-15 bg-black rounded-full pb-20 mb-10 shadow-2xl shadow-violet-500"></div>
                <h2 className="xl:text-5xl text-2xl font-medium mb-2">
                    С возвращением!
                </h2>
                {!loginError && !success && (
                    <p className="text-sm text-neutral-500">
                        Введите свои данные для входа
                    </p>
                )}

                {loginError && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-start">
                        <span className="text-red-700 text-md">
                            Неверный логин или пароль!
                        </span>
                    </div>
                )}
                {!loginError && success && (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-start">
                        <span className="text-green-700 text-sm">
                            Вход выполнен успешно! Перенаправляем...
                        </span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="self-center w-full md:w-96 p-4 flex flex-col gap-5"
                >
                    <div>
                        <label htmlFor="email" className="text-sm">
                            Email
                        </label>
                        <input
                            aria-label="Email"
                            aria-invalid={errors.email ? "true" : "false"}
                            aria-describedby="email-error"
                            type="email"
                            {...register("email", emailValidation)}
                            placeholder="Введите email"
                            className={`w-full px-4 mt-1 py-2 border rounded-xl focus:outline-none placeholder:text-sm focus:ring-2 focus:ring-neutral-500 transition-all ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <AuthError message={errors.email.message} />
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm">
                            Пароль
                        </label>
                        <input
                            type="password"
                            {...register("password", passwordValidation)}
                            placeholder="Введите пароль"
                            className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none placeholder:text-sm focus:ring-2 focus:ring-neutral-500 transition-all ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.password && (
                            <AuthError message={errors.password.message} />
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-neutral-800 text-white py-2 rounded-xl shadow-md hover:bg-neutral-900 transition-all"
                    >
                        {isLoading ? "Входим..." : "Войти"}
                    </motion.button>
                </form>

                <p className="text-sm text-neutral-500">
                    Нет аккаунта?{" "}
                    <span>
                        <Link
                            className="text-neutral-900 hover:decoration-solid"
                            to="/registration"
                        >
                            Регистрация
                        </Link>
                    </span>
                </p>
                <Link to="/">
                    <p className="text-sm text-neutral-900 mt-20 self-start">
                        Вернуться
                    </p>
                </Link>
            </motion.div>
            <AuthVisual />
        </section>
    );
};
