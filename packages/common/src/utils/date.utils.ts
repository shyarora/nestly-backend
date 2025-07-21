export const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0]!;
};

export const formatDateTime = (date: Date): string => {
    return date.toISOString();
};

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
    return date >= start && date <= end;
};

export const getDaysBetween = (start: Date, end: Date): number => {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
