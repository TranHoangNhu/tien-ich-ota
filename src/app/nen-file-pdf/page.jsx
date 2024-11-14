"use client";

import dynamic from "next/dynamic";

// Import component CompressPDF với SSR bị tắt
const CompressPDF = dynamic(() => import("@/app/Components/Content/CompressPDF"), {
  ssr: false,
});

export default function Page() {
  return (
    <div>
      <CompressPDF />
    </div>
  );
}
