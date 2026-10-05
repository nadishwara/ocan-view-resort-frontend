"use client";

import React from "react";
import { useInquiries } from "@/app/hooks/useInquiries";
import InquiryDetailModal from "@/app/admin/components/inquiries/InquiryDetailModal";
import { InquiryStatus } from "@/app/types/inquiry";
import { MessageSquare, RefreshCw, Eye } from "lucide-react";

export default function InquiriesPage() {
    const {
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
        refresh,
    } = useInquiries();

    // Light mode soft pastel badges
    const getBadgeStyle = (status: InquiryStatus) => {
        switch (status) {
            case "UNREAD":
                return "bg-rose-50 text-rose-700 border-rose-200/80";
            case "READ":
                return "bg-sky-50 text-sky-700 border-sky-200/80";
            case "RESOLVED":
                return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
            case "ARCHIVED":
                return "bg-stone-100 text-stone-600 border-stone-200";
        }
    };

    return (
        <div className="space-y-6 p-6 md:p-8 bg-background text-foreground min-h-screen">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-display text-primary flex items-center gap-2 tracking-tight">
                        <MessageSquare className="h-6 w-6 text-gold shrink-0" />
                        Guest Inquiries
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage and respond to messages submitted by resort visitors.
                    </p>
                </div>

                <button
                    onClick={refresh}
                    className="inline-flex items-center gap-2 rounded-xl bg-card border border-border px-4 py-2 text-xs font-semibold text-foreground shadow-xs hover:bg-secondary transition-all w-fit cursor-pointer"
                >
                    <RefreshCw className={`h-3.5 w-3.5 text-primary ${loading ? "animate-spin" : ""}`} /> Refresh
                </button>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-border/80 pb-3 overflow-x-auto">
                {(["ALL", "UNREAD", "READ", "RESOLVED", "ARCHIVED"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => {
                            setStatusFilter(tab);
                            setPage(0);
                        }}
                        className={`rounded-xl px-4 py-1.5 text-xs font-medium transition-all cursor-pointer ${statusFilter === tab
                                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                                : "bg-card text-muted-foreground border border-border/60 hover:bg-secondary hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Error Banner */}
            {error && (
                <div className="rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Inquiries Table Card - Clean Light Mode */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/60 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b border-border">
                            <tr>
                                <th className="px-6 py-3.5">Sender</th>
                                <th className="px-6 py-3.5">Inquiry Type</th>
                                <th className="px-6 py-3.5">Date</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                        Loading guest inquiries...
                                    </td>
                                </tr>
                            ) : inquiries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-muted-foreground">
                                        No inquiries found under this filter.
                                    </td>
                                </tr>
                            ) : (
                                inquiries.map((inquiry) => (
                                    <tr key={inquiry.id} className="hover:bg-secondary/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-foreground">{inquiry.fullName}</p>
                                            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground capitalize">
                                            {inquiry.inquiryType}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            {new Date(inquiry.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold rounded-full border ${getBadgeStyle(inquiry.status)}`}>
                                                {inquiry.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => {
                                                    setSelectedInquiry(inquiry);
                                                    if (inquiry.status === "UNREAD") {
                                                        handleStatusUpdate(inquiry.id, "READ");
                                                    }
                                                }}
                                                className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer border border-border/50"
                                            >
                                                <Eye className="h-3.5 w-3.5" /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                    <p>Showing {inquiries.length} of {totalElements} entries</p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            className="rounded-lg border border-border bg-card px-3 py-1.5 text-foreground hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card cursor-pointer"
                        >
                            Previous
                        </button>
                        <span className="font-medium text-foreground">Page {page + 1} of {totalPages}</span>
                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="rounded-lg border border-border bg-card px-3 py-1.5 text-foreground hover:bg-secondary disabled:opacity-40 disabled:hover:bg-card cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <InquiryDetailModal
                inquiry={selectedInquiry}
                onClose={() => setSelectedInquiry(null)}
                onUpdateStatus={handleStatusUpdate}
            />
        </div>
    );
}