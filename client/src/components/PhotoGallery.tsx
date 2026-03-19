/**
 * PhotoGallery — ERI Brand Design System
 * ========================================
 * Design philosophy: Faithful Documentation Mirror
 * - Clean card grid with pillar filter tabs
 * - Each card shows: image, reference ID (copy button), subject, pillar badge,
 *   composition type, keywords, and a direct Unsplash download link
 * - Reference IDs (e.g. ERI-OPS-001) can be used in Manus AI task prompts
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, ExternalLink } from "lucide-react";
import { photoLibrary, pillarGalleryColors, allPillars, type EriPhoto } from "@/lib/photoLibrary";

const compositionLabels: Record<string, string> = {
  aerial: "Aerial / Overhead",
  wide: "Wide Establishing",
  "human-scale": "Human-Scale Detail",
};

const compositionColours: Record<string, string> = {
  aerial: "bg-blue-100 text-blue-800",
  wide: "bg-purple-100 text-purple-800",
  "human-scale": "bg-amber-100 text-amber-800",
};

function PhotoCard({ photo }: { photo: EriPhoto }) {
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard.writeText(photo.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pillarColour = pillarGalleryColors[photo.pillar] ?? "#3ba559";

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/2]">
        <img
          src={photo.thumb}
          alt={photo.alt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Composition badge overlay */}
        <div className="absolute top-2 left-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${compositionColours[photo.composition]}`}>
            {compositionLabels[photo.composition]}
          </span>
        </div>
        {/* Download overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <a
            href={`${photo.url}&dl=${photo.id.toLowerCase()}.jpg`}
            download={`${photo.id.toLowerCase()}.jpg`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#232323] text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Download className="w-3 h-3" />
            Download
          </a>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3">
        {/* Reference ID row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <code className="text-xs font-mono font-bold text-[#232323] bg-gray-100 px-2 py-0.5 rounded">
              {photo.id}
            </code>
            <button
              onClick={copyId}
              className="text-gray-400 hover:text-[#3ba559] transition-colors"
              title="Copy reference ID"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-[#3ba559]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
          {/* Pillar dot */}
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: pillarColour }}
            title={photo.pillar}
          />
        </div>

        {/* Subject */}
        <p className="text-xs font-semibold text-[#232323] mb-1 leading-snug">{photo.subject}</p>

        {/* Credit */}
        <p className="text-[11px] text-gray-400 mb-2">Photo: {photo.credit} / Unsplash</p>

        {/* Keywords */}
        <div className="flex flex-wrap gap-1 mb-2">
          {photo.keywords.slice(0, 3).map((kw) => (
            <span key={kw} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
              {kw}
            </span>
          ))}
        </div>

        {/* Unsplash link */}
        <a
          href={`https://unsplash.com/photos/${photo.unsplashId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-[#3ba559] hover:underline flex items-center gap-1"
        >
          <ExternalLink className="w-3 h-3" />
          View on Unsplash
        </a>
      </div>
    </div>
  );
}

export function PhotoGallery() {
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", ...allPillars];

  const filtered =
    activeFilter === "All"
      ? photoLibrary
      : photoLibrary.filter((p) => p.pillar === activeFilter);

  return (
    <div>
      {/* AI usage callout */}
      <div className="bg-[#f0faf4] border border-[#3ba559]/30 rounded-lg p-4 mb-6">
        <p className="text-sm text-[#232323] font-semibold mb-1">Using photos in Manus AI tasks</p>
        <p className="text-xs text-gray-600 leading-relaxed">
          Reference any photo by its ID in a task prompt, e.g.:{" "}
          <code className="bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[11px] font-mono">
            "Use photo ERI-OPS-001 from the ERI Brand Design System photography library."
          </code>{" "}
          The AI will use the correct Unsplash URL for that image. All images follow ERI photography
          principles: documentary, systemic, full colour, no filters.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => {
          const isActive = activeFilter === f;
          const colour = f === "All" ? "#3ba559" : (pillarGalleryColors[f] ?? "#3ba559");
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                isActive
                  ? "text-white border-transparent"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
              style={isActive ? { backgroundColor: colour, borderColor: colour } : {}}
            >
              {f === "All" ? `All (${photoLibrary.length})` : f.replace("Pillar ", "P")}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((photo) => (
          <PhotoCard key={photo.id} photo={photo} />
        ))}
      </div>

      {/* Count */}
      <p className="text-xs text-gray-400 mt-4 text-right">
        {filtered.length} image{filtered.length !== 1 ? "s" : ""} shown
        {activeFilter !== "All" && ` for ${activeFilter}`}
      </p>
    </div>
  );
}
