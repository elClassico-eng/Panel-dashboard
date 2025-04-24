// Утилита для определения сроков дедлайна
export function getDeadlineStatus(dueDate) {
    if (!dueDate)
        return {
            border: "border-gray-300",
            text: "Нет дедлайна",
            badge: "bg-gray-100",
            textClass: "text-gray-500",
        };

    const today = new Date();
    const deadline = new Date(dueDate);
    const diffDays = Math.ceil(deadline - today) / (1000 * 60 * 60 * 24);

    if (diffDays < 0)
        return {
            border: "border-red-200",
            text: "Просрочено",
            badge: "bg-red-100 bg-red-100",
            textClass: "text-red-500 font-medium",
        };
    if (diffDays <= 2)
        return {
            border: "border-orange-200",
            text: "Срочно",
            badge: "bg-orange-100 bg-orange-100",
            textClass: "text-orange-600",
        };
    if (diffDays <= 7)
        return {
            border: "border-yellow-200",
            text: "Скоро",
            badge: "bg-yellow-100 bg-yellow-100",
            textClass: "text-yellow-600",
        };

    return {
        border: "border-green-200",
        text: "По плану",
        badge: "bg-green-100 bg-green-100",
        textClass: "text-green-600",
    };
}
