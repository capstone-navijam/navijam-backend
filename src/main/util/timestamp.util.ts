export function getFormattedTimestamp(date: Date): string {
    return date.toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
}

export function getTimestamp(createdAt: Date, updatedAt?: Date): string {
    const formattedCreatedAt = getFormattedTimestamp(createdAt);

    if (updatedAt && updatedAt > createdAt) {
        const formattedUpdatedAt = getFormattedTimestamp(updatedAt);

        return `${formattedUpdatedAt} (수정됨)`;
    }

    return formattedCreatedAt;
}
