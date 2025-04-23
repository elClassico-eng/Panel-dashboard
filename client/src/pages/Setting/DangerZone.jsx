import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, LogOut, Trash2 } from "lucide-react";

export const DangerZone = ({ logout }) => {
    return (
        <section>
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Опасная зона
            </h2>
            <Card className="p-6 border-red-200 dark:border-red-900/50">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium">Выйти из аккаунта</h3>
                        <p className="text-sm text-muted-foreground">
                            Завершит текущую сессию, но сохранит все данные
                        </p>
                        <Button
                            variant="outline"
                            className="mt-3 gap-2 cursor-pointer"
                            onClick={logout}
                        >
                            <LogOut className="w-4 h-4" />
                            Выйти
                        </Button>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-medium">Удалить аккаунт</h3>
                        <p className="text-sm text-muted-foreground">
                            Это действие нельзя отменить. Все данные будут
                            удалены.
                        </p>
                        <Button
                            variant="destructive"
                            className="mt-3 gap-2 cursor-pointe"
                        >
                            <Trash2 className="w-4 h-4" />
                            Удалить аккаунт
                        </Button>
                    </div>
                </div>
            </Card>
        </section>
    );
};
