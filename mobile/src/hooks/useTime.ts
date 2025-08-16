const formatRelativeTime = (dateValue: string | number) => {
    const publishedDate =
        !isNaN(Number(dateValue)) && String(dateValue).length === 10 ? new Date(parseInt(String(dateValue)) * 1000) : new Date(dateValue);

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - publishedDate.getTime()) / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if (diffInSeconds < minute) return "just now";
    if (diffInSeconds < hour) return `${Math.floor(diffInSeconds / minute)}m ago`;
    if (diffInSeconds < day) return `${Math.floor(diffInSeconds / hour)}h ago`;
    if (diffInSeconds < week) return `${Math.floor(diffInSeconds / day)}d ago`;
    return `${Math.floor(diffInSeconds / week)}w ago`;
};

export default formatRelativeTime;
