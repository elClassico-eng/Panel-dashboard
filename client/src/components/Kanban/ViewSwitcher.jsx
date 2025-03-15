export const ViewSwitcher = ({ Icon, switchTitle, onClick }) => {
    return (
        <button className="flex gap-2 items-center justify-center p-2 cursor-pointer hover:bg-violet-300 hover:rounded">
            <Icon size={16} />
            <span>{switchTitle}</span>
        </button>
    );
};
