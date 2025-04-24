import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const WidgetAllTasks = ({
    title,
    task,
    Icon,
    description,
    additionalInfoTask,
}) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{task}</div>
                <p className="text-xs text-muted-foreground">
                    {additionalInfoTask ? additionalInfoTask : ""} {description}
                </p>
            </CardContent>
        </Card>
    );
};
