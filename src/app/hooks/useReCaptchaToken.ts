"use client";

import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export function useReCaptchaToken() {
    const { executeRecaptcha } = useGoogleReCaptcha();

    const getRecaptchaToken = useCallback(
        async (actionName: string): Promise<string | null> => {
            if (!executeRecaptcha) {
                console.warn("reCAPTCHA has not loaded yet.");
                return null;
            }
            try {
                const token = await executeRecaptcha(actionName);
                return token;
            } catch (error) {
                console.error("Failed to execute reCAPTCHA:", error);
                return null;
            }
        },
        [executeRecaptcha]
    )
    return { getRecaptchaToken };
}
