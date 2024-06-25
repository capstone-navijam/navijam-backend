import {
    Member,
} from "@prisma/client";

export interface AuthenticatedRequest extends Request {
    member: Member;
}
