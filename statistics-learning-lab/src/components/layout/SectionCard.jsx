import { useState } from 'react'

/**
 * SectionCard
 * Props:
 *   title              — section heading text
 *   icon               — optional emoji or character
 *   children           — section content
 *   id                 — anchor id for TOC links
 *   defaultOpen        — whether content is visible on mount (default: true)
 *   collapsibleOnMobile — show chevron and allow toggling on small screens
 */
export default function SectionCard({
  title,
  icon,
  children,
  id,
  defaultOpen = true,
  collapsibleOnMobile = false,
}) {
  const [open, setOpen] = useState(defaultOpen)

  const canCollapse = collapsibleOnMobile

  function toggle() {
    if (canCollapse) setOpen((o) => !o)
  }

  return (
    <div
      id={id}
      className="bg-white rounded-xl border border-border shadow-sm p-6 mb-4 border-l-4 border-l-teal scroll-mt-4"
    >
      {/* Section header */}
      <div
        className={`flex items-center justify-between mb-3 ${canCollapse ? 'cursor-pointer select-none' : ''}`}
        onClick={toggle}
        role={canCollapse ? 'button' : undefined}
        aria-expanded={canCollapse ? open : undefined}
        aria-controls={canCollapse && id ? `${id}-content` : undefined}
      >
        <h2 className="text-teal font-semibold text-base flex items-center gap-2">
          {icon && <span aria-hidden="true">{icon}</span>}
          {title}
        </h2>

        {/* Chevron — only visible on mobile when collapsible */}
        {canCollapse && (
          <span className="md:hidden text-textMuted transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        )}
      </div>

      {/* Content */}
      <div
        id={canCollapse && id ? `${id}-content` : undefined}
        className={canCollapse && !open ? 'hidden md:block' : undefined}
      >
        {children}
      </div>
    </div>
  )
}
