import { PulseLoader } from "react-spinners";
export const Loader = () => {
    return (
        <div className="w-full h-full flex justify-center items-center bg-white px-4 py-24">
            <PulseLoader color="#000" size={13} />
        </div>
    );
};
