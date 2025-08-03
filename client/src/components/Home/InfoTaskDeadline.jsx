import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Calendar } from "lucide-react";

export const InfoTaskDeadline = ({ tasks, title }) => {
    return (
        <Card className="col-span-3 border bg-neutral-900 text-neutral-900 transition-all duration-300 backdrop-blur-sm bg-opacity-50 ">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {tasks.length > 0 ? (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div
                                key={task._id}
                                className="flex items-center space-x-4"
                            >
                                <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                                    <Calendar className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {task.title}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(
                                            task.dueDate
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="inline-flex items-center text-xs text-muted-foreground">
                                    {task.priority}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-8">
                        Сведения отсутствуют
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
