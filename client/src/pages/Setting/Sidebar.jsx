import { Button } from "@/components/ui/button";
import { settingsColumnData } from "@/data/data";
import { Badge } from "@/components/ui/badge";

export const Sidebar = ({ activeSection, setActiveSection, isPM = false }) => {
    return (
        <aside className="lg:col-span-3">
            <nav className="space-y-1">
                {settingsColumnData
                    .filter((item) => {
                        if (item.id === "wiplimits" && !isPM) {
                            return false;
                        }
                        return true;
                    })
                    .map((item) => (
                        <Button
                            key={item.id}
                            variant={
                                activeSection === item.id ? "secondary" : "ghost"
                            }
                            className="w-full justify-start gap-3 px-4 py-6"
                            onClick={() => setActiveSection(item.id)}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="flex-1 text-left">
                                {item.label}
                            </span>
                            {item.badge && (
                                <Badge
                                    variant={
                                        item.badge === "new"
                                            ? "default"
                                            : "outline"
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
