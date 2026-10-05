import { useState, useId, FormEvent, ChangeEvent } from "react";
import { ContactFormData, FormErrors, FormStatus } from "@/app/types/contact";
import { sendContactInquiry } from "@/app/services/contactService";
import { useReCaptchaToken } from "./useReCaptchaToken";

const INITIAL_FORM: ContactFormData = {
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "general",
    message: "",
};

function validateForm(data: ContactFormData): FormErrors {
    const errors: FormErrors = {};

    if (!data.fullName.trim()) {
        errors.fullName = "Full name is required.";
    } else if (data.fullName.trim().length < 2) {
        errors.fullName = "Name must be at least 2 characters.";
    }

    if (!data.email.trim()) {
        errors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (data.phone && !/^[\d\s()+-]{7,20}$/.test(data.phone)) {
        errors.phone = "Please enter a valid phone number.";
    }

    if (!data.message.trim()) {
        errors.message = "Message is required.";
    } else if (data.message.trim().length < 10) {
        errors.message = "Message must be at least 10 characters.";
    }

    return errors;
}

export function useContactForm() {
    const formId = useId();
    const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [status, setStatus] = useState<FormStatus>("idle");
    const [serverMessage, setServerMessage] = useState<string>("");

    const { getRecaptchaToken } = useReCaptchaToken();

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const fieldErrors = validateForm(formData);
        setErrors((prev) => ({
            ...prev,
            [name]: fieldErrors[name as keyof FormErrors],
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setStatus("idle");
        setServerMessage("");

        const validationErrors = validateForm(formData);
        const allTouched: Record<string, boolean> = {};
        Object.keys(formData).forEach((key) => {
            allTouched[key] = true;
        });
        setTouched(allTouched);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setStatus("error");
            return;
        }

        setStatus("submitting");

        try {
            const recaptchaToken = await getRecaptchaToken("contact_form_submit");

            const response = await sendContactInquiry({
                ...formData,
                recaptchaToken: recaptchaToken || "TEST_RECAPTCHA_TOKEN",
            });

            setStatus("success");
            setServerMessage(response.message || "Thank you! Your inquiry has been sent.");
            setFormData(INITIAL_FORM);
            setTouched({});
            setErrors({});
        } catch (err: unknown) {
            setStatus("error");
            if (err instanceof Error) {
                setServerMessage(err.message);
            } else {
                setServerMessage("An unexpected error occurred. Please try again.");
            }
        }
    };

    return {
        formId,
        formData,
        errors,
        touched,
        status,
        serverMessage,
        handleChange,
        handleBlur,
        handleSubmit,
    };
}