export const DrawOutlineButton = ({ children, ...rest }) => {
    return (
        <button
            {...rest}
            className="group relative px-4 py-2 font-medium text-slate-100 rounded-2xl transition-colors duration-[400ms] hover:text-indigo-300"
        >
            <span className="text-black font-bold">{children}</span>

            {/* TOP */}
            <span className="absolute rounded-2xl left-0 top-0 h-[2px] w-0 bg-black transition-all duration-100 group-hover:w-full" />

            {/* RIGHT */}
            <span className="absolute rounded-2xl right-0 top-0 h-0 w-[2px] bg-black transition-all delay-100 duration-100 group-hover:h-full" />

            {/* BOTTOM */}
            <span className="absolute rounded-2xl bottom-0 right-0 h-[2px] w-0 bg-black transition-all delay-200 duration-100 group-hover:w-full" />

            {/* LEFT */}
            <span className="absolute rounded-2xl bottom-0 left-0 h-0 w-[2px] bg-black transition-all delay-300 duration-100 group-hover:h-full" />
        </button>
    );
};
