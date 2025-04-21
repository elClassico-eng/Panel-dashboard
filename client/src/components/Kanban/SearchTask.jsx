import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTaskStore } from "@/store/taskStore";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

export const SearchTask = () => {
    const { tasks, setFilteredTasks } = useTaskStore();
    const { register, watch, reset, setFocus } = useForm();
    const [open, setOpen] = useState(false);
    const watchTask = watch("task");

    // Фильтрация задач
    useEffect(() => {
        if (!watchTask) {
            setFilteredTasks(tasks);
        } else {
            const filteredTasks = tasks.filter((task) =>
                task.title.toLowerCase().includes(watchTask.toLowerCase())
            );
            setFilteredTasks(filteredTasks);
        }
    }, [watchTask, tasks, setFilteredTasks]);

    const clearInput = () => {
        reset();
        setFilteredTasks(tasks);
    };

    const handleSelectTask = (taskTitle) => {
        reset({ task: taskTitle });
        setOpen(false);
    };

    return (
        <div className="relative flex items-center gap-3">
            {/* Кнопка для открытия CommandDialog */}
            <Button
                variant="outline"
                className="relative w-full justify-start text-sm text-muted-foreground md:w-40 lg:w-64"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                <span>Поиск задач</span>
            </Button>

            {/* Command Dialog */}
            <CommandDialog open={open} onOpenChange={setOpen}>
                <div className="relative">
                    <CommandInput
                        placeholder="Поиск по задачам..."
                        {...register("task")}
                        autoFocus
                    />
                    {watchTask && (
                        <X
                            className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer opacity-70 hover:opacity-100"
                            onClick={clearInput}
                        />
                    )}
                </div>

                <CommandList>
                    <CommandEmpty>Задачи не найдены</CommandEmpty>

                    <CommandGroup heading="Все задачи">
                        {tasks.map((task) => (
                            <CommandItem
                                key={task._id}
                                value={task.title}
                                onSelect={() => handleSelectTask(task.title)}
                                className="cursor-pointer"
                            >
                                {task.title}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </CommandDialog>

            {/* Отображение текущего поиска */}
            {watchTask && (
                <div className="hidden md:flex items-center text-sm text-muted-foreground">
                    Найдено:{" "}
                    {
                        tasks.filter((t) =>
                            t.title
                                .toLowerCase()
                                .includes(watchTask.toLowerCase())
                        ).length
                    }
                </div>
            )}
        </div>
    );
};
