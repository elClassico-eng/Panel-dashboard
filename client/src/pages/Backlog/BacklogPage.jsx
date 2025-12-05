import { useState } from "react";
import { BacklogView } from "@/components/Backlog/BacklogView";
import { SprintPlanning } from "@/components/Sprint/SprintPlanning";
import { useAuth } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Plus, ListTodo } from "lucide-react";

export const BacklogPage = () => {
    const { user } = useAuth();
    const [showSprintPlanning, setShowSprintPlanning] = useState(false);

    const isPM = user?.role === "Руководитель проекта";

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <ListTodo size={24} />
                        <h1 className="text-2xl font-bold">Product Backlog</h1>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Управление задачами и планирование спринтов
                    </p>
                </div>

                {isPM && (
                    <Button
                        onClick={() => setShowSprintPlanning(true)}
                        size="lg"
                    >
                        <Plus size={18} className="mr-2" />
                        Планирование спринта
                    </Button>
                )}
            </div>

            <div className="flex-1 overflow-hidden">
                <BacklogView
                    onOpenSprintPlanning={
                        isPM ? () => setShowSprintPlanning(true) : null
                    }
                />
            </div>

            {isPM && (
                <SprintPlanning
                    open={showSprintPlanning}
                    onOpenChange={setShowSprintPlanning}
                />
            )}
        </div>
    );
};
