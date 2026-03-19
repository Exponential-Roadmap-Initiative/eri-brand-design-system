import { useState } from "react";
import { toast } from "sonner";

interface DataSourceLogo {
  name: string;
  url: string;
  category: string;
  description?: string;
}

interface DataSourceLogoGridProps {
  logos: Record<string, DataSourceLogo>;
  categories: string[];
}

export function DataSourceLogoGrid({ logos, categories }: DataSourceLogoGridProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const allCategories = ["All", ...categories];
  const entries = Object.entries(logos);
  const filtered = activeCategory === "All"
    ? entries
    : entries.filter(([, v]) => v.category === activeCategory);

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("CDN URL copied to clipboard");
    });
  }

  return (
    <div>
      {/* Category filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {allCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeCategory === cat
                ? "bg-[#232323] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            {cat}
            {cat === "All" && (
              <span className="ml-1.5 text-[10px] opacity-60">({entries.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Logo grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {filtered.map(([key, { name, url, category, description }]) => (
          <div
            key={key}
            className="group relative bg-white border border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:shadow-md transition-shadow min-h-[100px]"
          >
            <img
              src={url}
              alt={`${name} logo`}
              className="max-h-12 max-w-full w-auto object-contain"
            />
            <span className="text-[11px] text-gray-500 text-center leading-tight">{name}</span>
            <span className="text-[10px] text-gray-400 text-center leading-tight">{category}</span>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-white/95 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
              <span className="text-[10px] font-mono text-[#3ba559] text-center leading-tight">{key}</span>
              {description && (
                <span className="text-[10px] text-gray-500 text-center leading-tight">{description}</span>
              )}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => copyUrl(url)}
                  className="text-[11px] text-[#3ba559] font-medium hover:underline"
                >
                  Copy URL
                </button>
                <span className="text-gray-300">·</span>
                <a
                  href={url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#3ba559] font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Download
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
