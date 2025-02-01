export const DropID = ({ beforeID, column }) => {
    return (
        <div
            data-before={beforeID || -1}
            data-column={column}
            className="my-0.5 h-0.5 w-full bg-violet-400 opacity-0"
        ></div>
    );
};
