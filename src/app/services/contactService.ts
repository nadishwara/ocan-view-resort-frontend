import { ContactApiRequest, ApiResponse } from "@/app/types/contact";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendContactInquiry = async (data: ContactApiRequest): Promise<ApiResponse> => {
    console.log("🚀 SENDING DATA TO BACKEND:", `${API_BASE_URL}/v1/public/contact`, data);

    try {
        const response = await fetch(`${API_BASE_URL}/v1/public/contact`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        console.log("📥 SERVER RESPONSE STATUS:", response.status);

        const result = await response.json();
        console.log("📥 SERVER RESPONSE DATA:", result);

        if (!response.ok) {
            throw new Error(result.message || "Failed to submit inquiry. Please try again.");
        }

        return result;
    } catch (error) {
        console.error("❌ FETCH ERROR IN CONTACT SERVICE:", error);
        throw error;
    }
};