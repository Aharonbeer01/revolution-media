"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity/studio";

export default function StudioPage() {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <NextStudio config={config} />
    </div>
  );
}
