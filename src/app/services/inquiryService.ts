import { InquiryPageResponse, InquiryStatus } from "@/app/types/inquiry";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchInquiries = async (
    token: string,
    status?: InquiryStatus | "ALL",
    page: number = 0,
    size: number = 10
): Promise<InquiryPageResponse> => {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
    });

    if (status && status !== "ALL") {
        queryParams.append("status", status);
    }

    const response = await fetch(`${API_BASE_URL}/v1/admin/inquiries?${queryParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch inquiries");
    }

    return response.json();
};

export const updateInquiryStatus = async (
    token: string,
    id: number,
    status: InquiryStatus
): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/v1/admin/inquiries/${id}/status`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Failed to update inquiry status");
    }
};