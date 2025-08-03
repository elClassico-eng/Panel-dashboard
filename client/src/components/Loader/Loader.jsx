import { PulseLoader } from "react-spinners";

// import { useTheme } from "@/hooks/use-theme";
export const Loader = () => {
    // const theme = useTheme();
    return (
        <div className="w-full h-full flex justify-center items-center bg-white dark:bg-neutral-950 px-4 py-24">
            <PulseLoader
                // color={`${theme === "light" ? "#000" : "#fff"}`}
                color="#fff"
                size={13}
            />
        </div>
    );
};
