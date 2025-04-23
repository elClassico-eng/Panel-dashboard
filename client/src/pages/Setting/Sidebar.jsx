import { Button } from "@/components/ui/button";
import { settingsColumnData } from "@/data/data";
import { Badge } from "@/components/ui/badge";

export const Sidebar = () => {
    return (
        <aside className="lg:col-span-3">
            <nav className="space-y-1">
                {settingsColumnData.map((item) => (
                    <Button
                        key={item.id}
                        variant="ghost"
                        className="w-full justify-start gap-3 px-4 py-6"
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                            <Badge
                                variant={
                                    item.badge === "new" ? "default" : "outline"
                                }
                            >
                                {item.badge}
                            </Badge>
                        )}
                    </Button>
                ))}
            </nav>
        </aside>
    );
};
