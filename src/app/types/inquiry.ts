export type InquiryStatus = "UNREAD" | "READ" | "RESOLVED" | "ARCHIVED";

export interface Inquiry {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    inquiryType: string;
    message: string;
    ipAddress: string;
    status: InquiryStatus;
    createdAt: string;
}

export interface InquiryPageResponse {
    content: Inquiry[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}