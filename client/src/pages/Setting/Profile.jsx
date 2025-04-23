import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Pen, User } from "lucide-react";

export const Profile = ({ user }) => {
    return (
        <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <User className="w-5 h-5 text-blue-500" />
                Личный профиль
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                            >
                                <Pen className="w-4 h-4" />
                            </Button>
                        </div>
                        <div>
                            <h3 className="font-medium">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {user.role === "Admin"
                                    ? "Администратор"
                                    : "Сотрудник"}
                            </p>
                        </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <span>{user.email}</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-medium mb-4">Контактная информация</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">
                                Телефон
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    defaultValue="+7 (900) 123-45-67"
                                    className="flex-1 input"
                                />
                                <Button variant="outline">Сохранить</Button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">
                                Часовой пояс
                            </label>
                            <select className="w-full select">
                                <option>Москва (UTC+3)</option>
                                <option>Калининград (UTC+2)</option>
                                <option>Самара (UTC+4)</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>
        </section>
    );
};
