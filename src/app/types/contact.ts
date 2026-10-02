export type InquiryType = "general" | "reservation" | "events" | "feedback";

export interface ContactFormData {
    fullName: string;
    email: string;
    phone: string;
    inquiryType: InquiryType;
    message: string;
}

export interface ContactApiRequest extends ContactFormData {
    recaptchaToken: string;
}

export interface ApiResponse {
    status: string;
    message: string;
}

export type FormStatus = "idle" | "submitting" | "success" | "error";

export interface FormErrors {
    fullName?: string;
    email?: string;
    phone?: string;
    message?: string;
    server?: string;
}