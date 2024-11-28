// 년, 월, 일만 반환
export function getFormattedDate(date: Date): string {
    return date.toLocaleDateString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    })
        .replace(/\.$/, "");
}

// 년, 월, 일, 시, 분, 수정 여부 포함
export function getFormattedTimestamp(date: Date): string {
    return date.toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    })
        .replace(/\.$/, "");
}

// 두 가지 형식의 타임스탬프 생성
export function getTimestamp(
    createdAt: Date,
    updatedAt?: Date,
    format: "date" | "datetime" = "datetime",
    ignoreUpdates = false,
): string {
    if (format === "date") {
        // 년, 월, 일만 반환
        return getFormattedDate(createdAt);
    }

    // 기본: 년, 월, 일, 시, 분, 수정 여부 포함

    const formattedCreatedAt = getFormattedTimestamp(createdAt);

    // 업데이트 여부를 무시하고 항상 createdAt을 반환
    if (ignoreUpdates || !updatedAt || updatedAt <= createdAt) {
        return formattedCreatedAt;
    }

    const formattedUpdatedAt = getFormattedTimestamp(updatedAt);

    return `${formattedUpdatedAt}`;
}
