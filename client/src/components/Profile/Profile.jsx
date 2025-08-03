import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/store/userStore";
import { User, UserPen, Mail, Phone, MapPin, Users, Save } from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export const Profile = () => {
    const { user, fetchProfile, updateProfile, uploadAvatar } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            city: "",
            teamStatus: "",
            phoneNumber: "",
        },
    });

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                city: user.city || "",
                teamStatus: user.teamStatus || "",
                phoneNumber: user.phoneNumber || "",
            });
            // Use profilePhoto field and construct proper URL
            const avatarUrl = user.profilePhoto ? 
                (user.profilePhoto.startsWith('http') ? 
                    user.profilePhoto : 
                    `${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}${user.profilePhoto}`) 
                : "";
            setAvatarPreview(avatarUrl);
        }
    }, [user, reset]);

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setAvatarPreview(reader.result);
                };
                reader.readAsDataURL(file);

                await uploadAvatar(file);
                toast.success("Аватар обновлен", {
                    description: "Ваше фото профиля успешно изменено",
                });
            } catch (error) {
                toast.error("Ошибка", {
                    description: "Не удалось загрузить аватар",
                });
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            await updateProfile(data);
            setIsEditing(false);
            toast.success("Профиль обновлен", {
                description: "Ваши данные успешно сохранены",
            });
        } catch (error) {
            toast.error("Ошибка", {
                description: "Не удалось обновить профиль",
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Мой профиль
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <Avatar className="w-24 h-24">
                                <AvatarImage src={avatarPreview} />
                                <AvatarFallback>
                                    {user?.firstName?.charAt(0)}
                                    {user?.lastName?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="avatar-upload"
                                className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                            >
                                <UserPen className="text-white w-6 h-6" />
                                <input
                                    type="file"
                                    id="avatar-upload"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div>

                        <div className="text-center">
                            <h3 className="text-lg font-semibold">
                                {user?.firstName} {user?.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                                <Mail className="w-4 h-4" />
                                {user?.email}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Personal Info Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2">
                                <UserPen className="w-5 h-5" />
                                Личная информация
                            </CardTitle>
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Редактировать
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setIsEditing(false);
                                            reset();
                                        }}
                                    >
                                        Отмена
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSubmit(onSubmit)}
                                        disabled={!isDirty}
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        Сохранить
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">Имя</Label>
                                {isEditing ? (
                                    <Input
                                        id="firstName"
                                        {...register("firstName", {
                                            required: "Обязательное поле",
                                        })}
                                    />
                                ) : (
                                    <p className="text-sm leading-7">
                                        {user?.firstName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lastName">Фамилия</Label>
                                {isEditing ? (
                                    <Input
                                        id="lastName"
                                        {...register("lastName", {
                                            required: "Обязательное поле",
                                        })}
                                    />
                                ) : (
                                    <p className="text-sm leading-7">
                                        {user?.lastName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                <p className="text-sm leading-7">
                                    {user?.email}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    className="flex items-center gap-1"
                                    htmlFor="phoneNumber"
                                >
                                    <Phone className="w-4 h-4" />
                                    Телефон
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="phoneNumber"
                                        {...register("phoneNumber")}
                                        placeholder="+7 (XXX) XXX-XX-XX"
                                    />
                                ) : (
                                    <p className="text-sm leading-7">
                                        {user?.phoneNumber || "Не указан"}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    className="flex items-center gap-1"
                                    htmlFor="city"
                                >
                                    <MapPin className="w-4 h-4" />
                                    Город
                                </Label>
                                {isEditing ? (
                                    <Input id="city" {...register("city")} />
                                ) : (
                                    <p className="text-sm leading-7">
                                        {user?.city || "Не указан"}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    className="flex items-center gap-1"
                                    htmlFor="teamStatus"
                                >
                                    <Users className="w-4 h-4" />
                                    Команда/Отдел
                                </Label>
                                {isEditing ? (
                                    <Input
                                        id="teamStatus"
                                        {...register("teamStatus")}
                                    />
                                ) : (
                                    <p className="text-sm leading-7">
                                        {user?.teamStatus || "Не указан"}
                                    </p>
                                )}
                            </div>
                        </form>
                    </CardContent>
                    <Separator />
                    <CardFooter className="flex justify-between pt-6">
                        <div className="text-sm text-muted-foreground">
                            Последнее обновление:{" "}
                            {user?.updatedAt
                                ? new Date(user.updatedAt).toLocaleDateString()
                                : "Неизвестно"}
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};
