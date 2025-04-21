// Форма регистрации/авторизации
export const emailValidation = {
    required: "Email обязателен для входа",
    pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Введите корректный email (например: user@example.com)",
    },
};

export const passwordValidation = {
    required: "Пароль обязателен",
    minLength: {
        value: 6,
        message: "Пароль должен содержать минимум 6 символов",
    },
    maxLength: {
        value: 20,
        message: "Пароль не должен превышать 20 символов",
    },
};

export const firstNameValidation = {
    required: "Поле 'Имя' не заполнено",
    minLength: {
        value: 2,
        message: "Минимум 2 символа",
    },
    pattern: {
        value: /^[а-яА-ЯёЁa-zA-Z-]+$/,
        message: "Только буквы и дефисы",
    },
};

export const lastNameValidation = {
    required: "Поле 'Фамилия' не заполнено",
    minLength: {
        value: 2,
        message: "Минимум 2 символа",
    },
    pattern: {
        value: /^[а-яА-ЯёЁa-zA-Z-]+$/,
        message: "Только буквы и дефисы",
    },
};

// Форма заполнения / изменения задач
export const titleValidation = {
    required: "Название задачи обязательно",
    minLength: {
        value: 3,
        message: "Минимум 3 символа",
    },
    maxLength: {
        value: 100,
        message: "Максимум 100 символов",
    },
    validate: (value) => {
        const trimmed = value.trim();
        if (trimmed.length < 3) return "Название слишком короткое";
        if (/^\d+$/.test(trimmed))
            return "Название не может состоять только из цифр";
        return true;
    },
};

export const descriptionValidation = {
    maxLength: {
        value: 500,
        message: "Максимум 500 символов",
    },
    validate: (value) => {
        if (!value) return true;
        const trimmed = value.trim();
        if (trimmed.length > 0 && trimmed.length < 10) {
            return "Описание слишком короткое (минимум 10 символов)";
        }
        return true;
    },
};

export const priorityValidation = {
    required: "Выберите приоритет",
    validate: (value) =>
        ["Низкий", "Средний", "Высокий"].includes(value) ||
        "Неверный приоритет",
};

export const statusValidation = {
    required: "Укажите статус задачи",
    validate: (value) =>
        [
            "Ожидает",
            "В процессе",
            "На рассмотрении",
            "Переделать",
            "Завершено",
        ].includes(value) || "Неверный статус",
};

export const assignedToValidation = {
    required: "Выберите исполнителя",
    validate: (value) => {
        if (!value) return "Исполнитель не выбран";
        return true;
    },
};

export const dueDateValidation = {
    required: "Укажите срок выполнения",
    validate: (value) => {
        if (!value) return false;
        const date = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) return "Дата не может быть в прошлом";
        if (
            date >
            new Date(today.getFullYear() + 2, today.getMonth(), today.getDate())
        ) {
            return "Максимальный срок - 2 года";
        }
        return true;
    },
};
