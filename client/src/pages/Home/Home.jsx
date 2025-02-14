import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";

export const Home = () => {
    const [date, setDate] = useState(new Date(1970, 0, 1)); // Initial date;

    return (
        <div className="flex  w-full h-full">
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow [&_.rdp-day--selected]:bg-blue-500 [&_.rdp-day--selected]:text-white"
            />
        </div>
    );
};
