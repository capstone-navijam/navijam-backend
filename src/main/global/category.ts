import {
    Category as PrismaCategory,
} from "@prisma/client";

export enum Category {
    FREE = "자유",
    PARENTING = "육아",
    CAREER = "진로",
    MARRIAGE = "결혼",
    APPEARANCE = "외모",
    RELATIONSHIPS = "인간관계",
    ADDICTION = "중독",
    BREAKUP = "이별",
    FAMILY = "가족",
    FRIEND = "친구",
    HEALTH = "건강",
    MENTAL_HEALTH = "정신건강",
    LOVE = "사랑"
}

export const categoryMap: { [key: string]: PrismaCategory } = {
    "자유": PrismaCategory.FREE,
    "육아": PrismaCategory.PARENTING,
    "진로": PrismaCategory.CAREER,
    "결혼": PrismaCategory.MARRIAGE,
    "외모": PrismaCategory.APPEARANCE,
    "인간관계": PrismaCategory.RELATIONSHIPS,
    "중독": PrismaCategory.ADDICTION,
    "이별": PrismaCategory.BREAKUP,
    "가족": PrismaCategory.FAMILY,
    "친구": PrismaCategory.FRIEND,
    "건강": PrismaCategory.HEALTH,
    "정신건강": PrismaCategory.MENTAL_HEALTH,
    "사랑": PrismaCategory.LOVE,
};

export const reverseCategoryMap = Object.fromEntries(
    Object.entries(categoryMap).map(([key, value,]) => [value,
key as Category,])
);

export function prismaCategoryToCategory(prismaCategory: PrismaCategory): Category {
    return reverseCategoryMap[prismaCategory];
}