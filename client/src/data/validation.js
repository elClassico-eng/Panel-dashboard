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
