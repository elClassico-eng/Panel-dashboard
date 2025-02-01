import { useState } from "react";

import WhatshotOutlinedIcon from "@material-ui/icons/WhatshotOutlined";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";

export const BurnBarrel = ({ setCards }) => {
    const [active, setActive] = useState(false);

    return (
        <div
            className={`grid place-content-center rounded border text-3xl mt-10 h-56 w-56 ${
                active
                    ? "border-red-800 bg-red-800/20 text-red-500"
                    : "border-neutral-500 bg-neutral-500/20 text-neutral-500"
            }`}
        >
            {active ? (
                <WhatshotOutlinedIcon className="animate-bounce" />
            ) : (
                <DeleteOutlineOutlinedIcon />
            )}
        </div>
    );
};
