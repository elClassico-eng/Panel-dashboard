import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";

export const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        setEmail(data.email);
        setPassword(data.password);
        reset();
    };

    return (
        <section className="relative mt-[70px] grid md:grid-cols-2 grid-cols-1  w-full h-screen bg-gray-100">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col justify-center items-center"
            >
                <h2 className="md:text-5xl text-2xl font-medium mb-2">
                    Welcome in Panel-dashboard!
                </h2>
                <p className="text-md text-neutral-400">
                    Register to use the application
                </p>
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
                        Log In
                    </motion.button>
                </form>

                <p className="text-sm text-neutral-400">
                    Have an account?{" "}
                    <span>
                        <Link className="text-violet-500" to="/registration">
                            Sign in
                        </Link>
                    </span>
                </p>
                <Link to="/home">
                    <p className="text-sm text-violet-500 mt-20 self-start">
                        Back home
                    </p>
                </Link>
            </motion.div>
            <div className="flex relative items-center justify-center h-screen">
                <div className="w-96 h-96 bg-violet-600 rounded-full"></div>
                <div className="absolute top-1/2 w-full h-[250px] backdrop-blur-lg bg-white/10 rounded-lg border border-white/30  grainy-effect"></div>
            </div>
        </section>
    );
};
