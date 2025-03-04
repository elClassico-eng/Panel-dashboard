import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useAuth } from "@/store/store";
import { useNavigate } from "react-router-dom";

import { Loader } from "../Loader/Loader";

import { Link } from "react-router-dom";
export const AuthFormLogIn = () => {
    const { login, isLoading, error, isAuthenticated } = useAuth();
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
        } catch (error) {
            console.log(error);
        } finally {
            reset();
        }
    };

    if (isLoading) return <Loader />;

    return (
        <section className="relative pt-[70px] grid md:grid-cols-2 grid-cols-1  w-full h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center items-center"
            >
                <h2 className="xl:text-4xl text-2xl font-medium mb-2">
                    Welcome back!
                </h2>
                <p className="text-sm text-neutral-400">
                    Welcome back! Please enter your details.
                </p>

                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="self-center w-full md:w-96 p-4 flex flex-col gap-5"
                >
                    <div>
                        <label htmlFor="email" className="text-sm">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email",
                                },
                            })}
                            placeholder="Enter email"
                            className={`w-full px-4 mt-1 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                                errors.email
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message:
                                        "Password must be at least 6 characters",
                                },
                            })}
                            placeholder="Enter password"
                            className={`w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
                                errors.password
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full bg-violet-500 text-white py-2 rounded-xl shadow-md hover:bg-violet-600 transition-all"
                    >
                        {isLoading ? "Logging in ..." : "Log in"}
                    </motion.button>
                </form>

                <p className="text-sm text-neutral-400">
                    Don`t have an account?{" "}
                    <span>
                        <Link className="text-violet-500" to="/registration">
                            Sign in
                        </Link>
                    </span>
                </p>
                <Link to="/">
                    <p className="text-sm text-violet-500 mt-20 self-start">
                        Back home
                    </p>
                </Link>
            </motion.div>
            <div className="flex relative items-center justify-center h-screen bg-inherit overflow-hidden">
                <motion.div
                    className="w-96 h-96 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.05, 1],
                        boxShadow: [
                            "0 0 20px rgba(139, 92, 246, 0.5)",
                            "0 0 40px rgba(139, 92, 246, 0.8)",
                            "0 0 20px rgba(139, 92, 246, 0.5)",
                        ],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                    }}
                />

                <div className="absolute top-1/2 w-full h-[250px] backdrop-blur-lg bg-white/20 rounded-lg border border-white/30  grainy-effect"></div>

                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-violet-600 rounded-full opacity-50"
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -50, 50, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut",
                            delay: Math.random() * 2,
                        }}
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                    />
                ))}
            </div>
        </section>
    );
};
