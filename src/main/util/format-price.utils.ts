export function formatPriceToKRW(price: number): string {
    return price.toLocaleString("ko-KR", {
        style: "currency",
        currency: "KRW",
    });
}