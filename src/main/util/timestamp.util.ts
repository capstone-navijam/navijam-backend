export function getTimestamp(createdAt: Date, updatedAt: Date): string {
    const isEdited = updatedAt > createdAt;

    return isEdited ? `${updatedAt.toISOString()} (수정)` : createdAt.toISOString();
}