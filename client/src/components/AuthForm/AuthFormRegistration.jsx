import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "@/store/userStore";
import { Loader } from "../Loader/Loader";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { AuthError } from "../Error/AuthError";
import {
    emailValidation,
    passwordValidation,
    firstNameValidation,
    lastNameValidation,
} from "../../data/validation";
import { AuthVisual } from "../ui/authVisual";

export const AuthFormRegistration = () => {
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const {
        registration,
        isLoading,
        isAuthenticated,
        error: registrationError,
    } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    useEffect(() => {
        if (isAuthenticated && success) {
            navigate("/about");
        }
    }, [isAuthenticated, navigate, success]);

    const onSubmit = async (data) => {
        try {
            await registration(
                data.email,
                data.password,
                data.firstName,
                data.lastName
            );
            setSuccess(true);
        } catch (registrationError) {
            console.error(
                "Ошибка при регистрации пользователя",
                registrationError
            );
            setSuccess(false);
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
                className="flex flex-col justify-center items-center "
            >
                <div className="w-15 h-15 bg-black rounded-full pb-20 mb-10 shadow-2xl shadow-violet-500"></div>
                <h2 className="xl:text-4xl text-2xl font-medium mb-2">
                    Добро пожаловать!
                </h2>
                <p className="text-sm text-neutral-500">
                    Зарегистрируйтесь, чтобы воспользоваться приложением
                </p>

                {!registrationError && !success && (
                    <p className="text-sm text-neutral-500">
                        Введите свои данные для регистрации
                    </p>
                )}

                {registrationError && (
                    <div className="mb-4 p-3 rounded-lg flex items-start">
                        <span className="text-red-700 text-md">
                            Пользователь с таким email уже существует
                        </span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="self-center w-full md:w-96 p-4 flex flex-col gap-5"
                >
                    <div>
                        <label htmlFor="firstName" className="text-sm">
                            Имя
                        </label>
                        <input
                            aria-label="firstName"
                            aria-invalid={errors.firstName ? "true" : "false"}
                            aria-describedby="firstName-error"
                            type="text"
                            {...register("firstName", firstNameValidation)}
                            placeholder="Введите имя"
                            className={`w-full px-4 mt-1 py-2 border rounded-xl focus:outline-none placeholder:text-sm focus:ring-2 focus:ring-neutral-500 transition-all ${
                                errors.firstName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.firstName && (
                            <AuthError message={errors.firstName.message} />
                        )}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="text-sm">
                            Фамилия
                        </label>
                        <input
                            aria-label="lastName"
                            aria-invalid={errors.lastName ? "true" : "false"}
                            aria-describedby="lastName-error"
                            type="text"
                            {...register("lastName", lastNameValidation)}
                            placeholder="Введите фамилию"
                            className={`w-full px-4 mt-1 py-2 border rounded-xl focus:outline-none placeholder:text-sm focus:ring-2 focus:ring-neutral-500 transition-all ${
                                errors.lastName
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.lastName && (
                            <AuthError message={errors.lastName.message} />
                        )}
                    </div>

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
                            Придумайте пароль
                        </label>
                        <input
                            type="password"
                            {...register("password", passwordValidation)}
                            placeholder="Придумайте пароль"
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
                        className="w-full bg-neutral-800 text-white py-2 rounded-xl shadow-md hover:bg-neutral-900 transition-colors"
                    >
                        {isLoading ? "Регистрация ... " : "Регистрация"}
                    </motion.button>
                </form>

                <p className="text-sm text-neutral-400">
                    Есть аккаунт?{" "}
                    <Link className="text-neutral-900" to="/login">
                        <span>Войти</span>
                    </Link>
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
