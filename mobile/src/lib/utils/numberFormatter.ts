/**
 * Formats numbers for display according to specific rules:
 * - < 1000: display as is (e.g., 888)
 * - >= 1000 && < 1,000,000: display in thousands with 'k' suffix (e.g., 90.9k)
 * - >= 1,000,000: display in millions with 'm' suffix (e.g., 9.5m)
 */
export const formatCount = (count: number): string => {
    if (count < 1000) {
        return count.toString();
    } else if (count < 1000000) {
        const thousands = count / 1000;
        // If it's a whole number of thousands, don't show decimal
        if (thousands % 1 === 0) {
            return `${thousands}k`;
        }
        // Otherwise show one decimal place
        return `${thousands.toFixed(1)}k`;
    } else {
        const millions = count / 1000000;
        // If it's a whole number of millions, don't show decimal
        if (millions % 1 === 0) {
            return `${millions}m`;
        }
        // Otherwise show one decimal place
        return `${millions.toFixed(1)}m`;
    }
};
