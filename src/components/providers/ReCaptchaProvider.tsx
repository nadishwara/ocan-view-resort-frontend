"use client";

import React from 'react'
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

interface Props {
    children: React.ReactNode;
}
export default function ReCaptchaProvider({ children }: Props) {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    if (!siteKey) {
        console.error("ReCAPTCHA site key is missing in env variables!");
    }
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={siteKey || ""}
            scriptProps={{
                async: true,
                defer: true,
                appendTo: "head",
            }}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}
