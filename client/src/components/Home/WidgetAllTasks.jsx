import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const WidgetAllTasks = ({
    title,
    task,
    Icon,
    description,
    additionalInfoTask,
}) => {
    return (
        <Card className="border bg-neutral-900 text-neutral-900transition-all duration-300 backdrop-blur-sm bg-opacity-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-neutral-900" />
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold">{task}</div>
                <p className="text-xs text-neutral-600 mt-1">
                    {additionalInfoTask ? additionalInfoTask : ""} {description}
                </p>
            </CardContent>
        </Card>
    );
};
