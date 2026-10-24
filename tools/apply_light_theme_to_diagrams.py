#!/usr/bin/env python3
"""
tools/apply_light_theme_to_diagrams.py
Updates all technical illustrations and interactive canvas animations to support
a crisp, elegant light theme matching the textbook's clean reading typography,
while fully preserving dark mode support.
"""

import re, glob
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VISUALS_DIR = ROOT / "components" / "visuals"
BOOK_FIGURE = ROOT / "components" / "BookFigure.tsx"

def update_visual_file(fpath: Path):
    content = fpath.read_text(encoding="utf-8")
    
    # 1. Update wrapper div
    content = content.replace(
        '<div className="p-4 sm:p-6 bg-zinc-950 flex justify-center items-center">',
        '<div className="p-4 sm:p-6 bg-slate-50/70 dark:bg-zinc-950 flex justify-center items-center border-y border-zinc-200/80 dark:border-zinc-800">'
    )
    
    # 2. Update canvas element classes
    content = re.sub(
        r'<canvas ref=\{canvasRef\} className="([^"]*?)shadow-inner bg-zinc-950"',
        r'<canvas ref={canvasRef} className="\1shadow-sm border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950"',
        content
    )
    
    # 3. Add canvas background fill and theme awareness
    if "const isDark =" not in content:
        # For width, height files
        if "ctx.clearRect(0, 0, width, height);" in content:
            replacement = (
                "const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');\n"
                "      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';\n"
                "      ctx.fillRect(0, 0, width, height);\n"
                "      ctx.clearRect(0, 0, width, height);\n"
                "      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';\n"
                "      ctx.fillRect(0, 0, width, height);"
            )
            content = content.replace("ctx.clearRect(0, 0, width, height);", replacement, 1)
        # For displayWidth, displayHeight files
        elif "ctx.clearRect(0, 0, displayWidth, displayHeight);" in content:
            replacement = (
                "const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');\n"
                "      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';\n"
                "      ctx.fillRect(0, 0, displayWidth, displayHeight);\n"
                "      ctx.clearRect(0, 0, displayWidth, displayHeight);\n"
                "      ctx.fillStyle = isDark ? '#09090b' : '#ffffff';\n"
                "      ctx.fillRect(0, 0, displayWidth, displayHeight);"
            )
            content = content.replace("ctx.clearRect(0, 0, displayWidth, displayHeight);", replacement, 1)

    # 4. Update grid line stroke style
    content = content.replace(
        "ctx.strokeStyle = 'rgba(150, 150, 180, 0.12)';",
        "ctx.strokeStyle = isDark ? 'rgba(150, 150, 180, 0.12)' : 'rgba(226, 232, 240, 0.85)';"
    )
    content = content.replace(
        "ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';",
        "ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.08)' : 'rgba(226, 232, 240, 0.85)';"
    )
    content = content.replace(
        "ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';",
        "ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(226, 232, 240, 0.85)';"
    )
    
    # 5. Update axis stroke style
    content = content.replace(
        "ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';",
        "ctx.strokeStyle = isDark ? 'rgba(100, 116, 139, 0.4)' : '#94a3b8';"
    )
    content = content.replace(
        "ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';",
        "ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.35)' : '#94a3b8';"
    )
    content = content.replace(
        "ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';",
        "ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.4)' : '#94a3b8';"
    )
    content = content.replace(
        "ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)';",
        "ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.5)' : '#94a3b8';"
    )

    fpath.write_text(content, encoding="utf-8")
    print(f"Updated {fpath.name}")

def update_book_figure():
    content = BOOK_FIGURE.read_text(encoding="utf-8")
    
    # 1. Update container
    content = content.replace(
        '<div className="p-6 sm:p-8 bg-zinc-950 flex flex-col items-center justify-center min-h-[300px]">',
        '<div className="p-6 sm:p-8 bg-slate-50/70 dark:bg-zinc-950 flex flex-col items-center justify-center min-h-[300px] border-y border-zinc-200/60 dark:border-zinc-800">'
    )
    
    # 2. Update all SVG background rects
    content = re.sub(
        r'<rect width="(\d+)" height="(\d+)" fill="#09090b" />',
        r'<rect width="\1" height="\2" rx="16" fill="var(--diagram-bg)" stroke="var(--diagram-border)" strokeWidth="1" />',
        content
    )
    
    # 3. Update grid strokes in patterns
    content = content.replace('stroke="#27272a"', 'stroke="var(--diagram-grid)"')
    content = content.replace('stroke="#3f3f46"', 'stroke="var(--diagram-grid)"')
    
    # 4. Update axis lines
    content = content.replace('stroke="#52525b"', 'stroke="var(--diagram-axis)"')
    content = content.replace('stroke="#71717a"', 'stroke="var(--diagram-axis)"')
    
    # 5. Update text fills
    content = content.replace('fill="#ffffff"', 'fill="var(--diagram-text)"')
    content = content.replace('fill="#f4f4f5"', 'fill="var(--diagram-text)"')
    content = content.replace('fill="#f1f5f9"', 'fill="var(--diagram-text)"')
    content = content.replace('fill="#a1a1aa"', 'fill="var(--diagram-text-muted)"')
    content = content.replace('fill="#71717a"', 'fill="var(--diagram-text-muted)"')
    
    # 6. Update GenericSchematic fallback
    content = content.replace(
        '<div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-4">',
        '<div className="w-full max-w-md p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center space-y-4 shadow-sm">'
    )
    content = content.replace(
        '<h4 className="text-base font-bold text-zinc-100">',
        '<h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">'
    )
    content = content.replace(
        '<p className="text-xs text-zinc-400 mt-1">',
        '<p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">'
    )
    
    BOOK_FIGURE.write_text(content, encoding="utf-8")
    print("Updated BookFigure.tsx")

def main():
    for f in sorted(VISUALS_DIR.glob("Chapter*Illustration.tsx")):
        update_visual_file(f)
    update_book_figure()
    print("All diagrams successfully upgraded for light theme and dark theme!")

if __name__ == "__main__":
    main()
