"use client";

import { useState, useEffect, useCallback } from "react";
import { Inquiry, InquiryStatus } from "@/app/types/inquiry";
import { fetchInquiries, updateInquiryStatus } from "@/app/services/inquiryService";

export function useInquiries() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [statusFilter, setStatusFilter] = useState<InquiryStatus | "ALL">("ALL");
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

    const getAuthToken = (): string | null => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("token") || sessionStorage.getItem("token");
        }
        return null;
    };

    const loadInquiries = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("Authentication token not found");
            }
            const data = await fetchInquiries(token, statusFilter, page, 10);
            setInquiries(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load inquiries");
        } finally {
            setLoading(false);
        }
    }, [statusFilter, page]);

    // 🌟 Clean Effect Execution with Subscription Guard
    useEffect(() => {
        let isSubscribed = true;

        const fetchData = async () => {
            if (!isSubscribed) return;
            await loadInquiries();
        };

        fetchData();

        return () => {
            isSubscribed = false;
        };
    }, [loadInquiries]);

    const handleStatusUpdate = async (id: number, newStatus: InquiryStatus) => {
        try {
            const token = getAuthToken();
            if (!token) return;
            await updateInquiryStatus(token, id, newStatus);

            // Update selected inquiry modal state if open
            if (selectedInquiry && selectedInquiry.id === id) {
                setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
            }

            await loadInquiries(); // Refresh table
        } catch (err: unknown) {
            alert(err instanceof Error ? err.message : "Failed to update status");
        }
    };

    return {
        inquiries,
        statusFilter,
        setStatusFilter,
        page,
        setPage,
        totalPages,
        totalElements,
        loading,
        error,
        selectedInquiry,
        setSelectedInquiry,
        handleStatusUpdate,
        refresh: loadInquiries,
    };
}