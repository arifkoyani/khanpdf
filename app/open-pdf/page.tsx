import type { Metadata } from "next";
import { Suspense } from "react";
import OpenPdfViewer from "../components/OpenPdfViewer/OpenPdfViewer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Open PDF | KhanPDF",
    description: "View your converted PDF on KhanPDF.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function OpenPdfPage() {
    return (
        <Suspense fallback={<div style={{ padding: "2rem" }}>Loading PDF...</div>}>
            <OpenPdfViewer />
        </Suspense>
    );
}