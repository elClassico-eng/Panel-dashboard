import { User } from "lucide-react";
import { UnderConstruction } from "../UnderConstruction/UnderConstruction";

export const TeamPerformanceWidget = () => {
    const handleClick = () => {
        return (
            <UnderConstruction message="Виджет находится на стадии разработки" />
        );
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <User className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground" onClick={() => handleClick()}>
                Выберите сотрудника для просмотра статистики
            </p>
        </div>
    );
};

// <Card className="col-span-3">
//     <CardHeader>
//         <div className="flex justify-between items-center">
//             <CardTitle>Продуктивность команды</CardTitle>
//             <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <CustomDropdownTrigger>
//                         {selectedUser ? (
//                             <>
//                                 <Avatar className="h-6 w-6">
//                                     <AvatarImage
//                                         src={selectedUser.profilePhoto}
//                                     />
//                                     <AvatarFallback>
//                                         {selectedUser.firstName?.charAt(
//                                             0
//                                         )}
//                                         {selectedUser.lastName?.charAt(
//                                             0
//                                         )}
//                                     </AvatarFallback>
//                                 </Avatar>
//                                 {selectedUser.firstName}{" "}
//                                 {selectedUser.lastName}
//                             </>
//                         ) : (
//                             "Выберите сотрудника"
//                         )}
//                         <ChevronDown className="h-4 w-4 opacity-50" />
//                     </CustomDropdownTrigger>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className="w-56">
//                     {userStats.map((user, index) => (
//                         <DropdownMenuItem
//                             key={user._id || `user-${index}`} // Уникальный ключ
//                             onClick={() => setSelectedUser(user)}
//                             className="flex items-center gap-2"
//                         >
//                             <Avatar className="h-6 w-6">
//                                 <AvatarImage src={user.profilePhoto} />
//                                 <AvatarFallback>
//                                     {user.firstName?.charAt(0)}
//                                     {user.lastName?.charAt(0)}
//                                 </AvatarFallback>
//                             </Avatar>
//                             {user.firstName} {user.lastName}
//                             <Badge
//                                 variant="outline"
//                                 className="ml-auto"
//                             >
//                                 {user.totalTasks}
//                             </Badge>
//                         </DropdownMenuItem>
//                     ))}
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </div>
//     </CardHeader>

//     <CardContent>
//         {selectedUser ? (
//             <div className="space-y-4">
//                 <div className="flex items-center gap-4">
//                     <Avatar className="h-12 w-12">
//                         <AvatarImage src={selectedUser.profilePhoto} />
//                         <AvatarFallback>
//                             {selectedUser.firstName?.charAt(0)}
//                             {selectedUser.lastName?.charAt(0)}
//                         </AvatarFallback>
//                     </Avatar>
//                     <div>
//                         <h3 className="font-medium">
//                             {selectedUser.firstName}{" "}
//                             {selectedUser.lastName}
//                         </h3>
//                         <p className="text-sm text-muted-foreground">
//                             {selectedUser.role === "Admin"
//                                 ? "Администратор"
//                                 : "Сотрудник"}
//                         </p>
//                     </div>
//                 </div>

//                 <div className="space-y-2">
//                     <div className="flex justify-between text-sm">
//                         <span>Прогресс выполнения</span>
//                         <span>{selectedUser.completionRate}%</span>
//                     </div>
//                     <Progress value={selectedUser.completionRate} />
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 pt-2">
//                     <div className="flex flex-col items-center">
//                         <div className="flex items-center gap-1 text-green-500">
//                             <CheckCircle className="h-4 w-4" />
//                             <span className="font-medium">
//                                 {selectedUser.completed}
//                             </span>
//                         </div>
//                         <span className="text-xs text-muted-foreground">
//                             Завершено
//                         </span>
//                     </div>

//                     <div className="flex flex-col items-center">
//                         <div className="flex items-center gap-1 text-yellow-500">
//                             <Clock className="h-4 w-4" />
//                             <span className="font-medium">
//                                 {selectedUser.inProgress}
//                             </span>
//                         </div>
//                         <span className="text-xs text-muted-foreground">
//                             В работе
//                         </span>
//                     </div>

//                     <div className="flex flex-col items-center">
//                         <div className="flex items-center gap-1 text-red-500">
//                             <AlertCircle className="h-4 w-4" />
//                             <span className="font-medium">
//                                 {selectedUser.overdue}
//                             </span>
//                         </div>
//                         <span className="text-xs text-muted-foreground">
//                             Просрочено
//                         </span>
//                     </div>
//                 </div>

//                 {selectedUser.totalTasks === 0 && (
//                     <div className="text-center py-4 text-muted-foreground text-sm">
//                         Нет назначенных задач
//                     </div>
//                 )}
//             </div>
//         ) : (
