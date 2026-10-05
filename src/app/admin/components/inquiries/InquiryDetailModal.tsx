"use client";

import React from "react";
import { Inquiry, InquiryStatus } from "@/app/types/inquiry";
import { X, Mail, Phone, Calendar, User } from "lucide-react";

interface InquiryDetailModalProps {
    inquiry: Inquiry | null;
    onClose: () => void;
    onUpdateStatus: (id: number, status: InquiryStatus) => void;
}

export default function InquiryDetailModal({
    inquiry,
    onClose,
    onUpdateStatus,
}: InquiryDetailModalProps) {
    if (!inquiry) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-2xl text-foreground space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border pb-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gold">
                            Inquiry #{inquiry.id}
                        </span>
                        <h2 className="text-xl font-semibold font-display text-primary capitalize">{inquiry.inquiryType}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Sender Details Card */}
                <div className="grid gap-4 sm:grid-cols-2 bg-secondary/40 p-4 rounded-xl border border-border/80 text-sm">
                    <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Full Name</p>
                            <p className="font-medium text-foreground">{inquiry.fullName}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Email Address</p>
                            <a href={`mailto:${inquiry.email}`} className="font-medium text-primary hover:underline">
                                {inquiry.email}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            {inquiry.phone ? (
                                <a href={`tel:${inquiry.phone}`} className="font-medium text-primary hover:underline">
                                    {inquiry.phone}
                                </a>
                            ) : (
                                <p className="text-muted-foreground">Not provided</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground">Received Date</p>
                            <p className="font-medium text-foreground">
                                {new Date(inquiry.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Message Body */}
                <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message Content</p>
                    <div className="rounded-xl bg-background p-4 text-sm leading-relaxed text-foreground border border-border whitespace-pre-wrap max-h-48 overflow-y-auto shadow-inner">
                        {inquiry.message}
                    </div>
                </div>

                {/* Actions & Status Control */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Status:</span>
                        {(["UNREAD", "READ", "RESOLVED", "ARCHIVED"] as InquiryStatus[]).map((st) => (
                            <button
                                key={st}
                                onClick={() => onUpdateStatus(inquiry.id, st)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${inquiry.status === st
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card text-muted-foreground border-border hover:bg-secondary hover:text-foreground"
                                    }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>

                    <a
                        href={`mailto:${inquiry.email}?subject=Regarding your OceanView Resort Inquiry #${inquiry.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                        <Mail className="h-4 w-4" /> Reply via Email
                    </a>
                </div>
            </div>
        </div>
    );
}