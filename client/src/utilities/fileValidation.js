export const validateFile = (file) => {
    const errors = [];
    
    // Check file size (2MB max)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
        errors.push('Файл слишком большой. Максимальный размер: 2MB');
    }
    
    // Check file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
        errors.push('Недопустимый тип файла. Разрешены только PNG и JPEG');
    }
    
    // Check file extension
    const allowedExtensions = ['.png', '.jpg', '.jpeg'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
        errors.push('Недопустимое расширение файла');
    }
    
    // Check for suspicious characters in filename
    if (file.name.includes('\0') || file.name.includes('..')) {
        errors.push('Недопустимое имя файла');
    }
    
    // Check minimum dimensions (if it's an image)
    return new Promise((resolve) => {
        if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
                if (img.width < 50 || img.height < 50) {
                    errors.push('Изображение слишком маленькое (минимум 50x50px)');
                }
                if (img.width > 2000 || img.height > 2000) {
                    errors.push('Изображение слишком большое (максимум 2000x2000px)');
                }
                resolve({ isValid: errors.length === 0, errors });
            };
            img.onerror = () => {
                errors.push('Поврежденный файл изображения');
                resolve({ isValid: false, errors });
            };
            img.src = URL.createObjectURL(file);
        } else {
            resolve({ isValid: errors.length === 0, errors });
        }
    });
};