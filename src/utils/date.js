const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export const parseDateInput = (value) => {
    if (!value) return null;

    if (value instanceof Date) {
        const cloned = new Date(value);
        return Number.isNaN(cloned.getTime()) ? null : cloned;
    }

    if (typeof value === 'string' && DATE_ONLY_PATTERN.test(value)) {
        const [year, month, day] = value.split('-').map(Number);
        return new Date(year, month - 1, day);
    }

    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getDeadlineEndOfDay = (value) => {
    const parsed = parseDateInput(value);
    if (!parsed) return null;

    parsed.setHours(23, 59, 59, 999);
    return parsed;
};

export const isDeadlineActive = (value, reference = new Date()) => {
    const deadline = getDeadlineEndOfDay(value);
    return !deadline || deadline >= reference;
};

export const isDeadlineExpired = (value, reference = new Date()) => {
    const deadline = getDeadlineEndOfDay(value);
    return !!deadline && deadline < reference;
};

export const formatDeadlineDate = (value, locale) => {
    const parsed = parseDateInput(value);
    return parsed ? parsed.toLocaleDateString(locale) : '';
};
