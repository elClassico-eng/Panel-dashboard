import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Palette, Sun } from "lucide-react";

export const Appearance = ({ theme, handleLight, handleDark }) => {
    return (
        <section className="w-fit">
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
                <Palette className="w-5 h-5 text-purple-500" />
                Внешний вид
            </h2>
            <Card className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-medium mb-3">Тема оформления</h3>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                className={`${
                                    theme === "light"
                                        ? "border border-black"
                                        : ""
                                } flex-1 cursor-pointer`}
                                onClick={handleLight}
                            >
                                <Sun className="w-4 h-4 mr-2" />
                                Светлая
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1 cursor-pointer"
                                onClick={handleDark}
                            >
                                <Moon className="w-4 h-4 mr-2" />
                                Темная
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </section>
    );
};
