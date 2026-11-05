/** Consistent, accessible decorative play icon used beside visible button labels. */
export default function PlayIcon({ size = 16, className = "" }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" style={{display:"inline-block",verticalAlign:"-0.12em",flexShrink:0}}><path d="M8 5.5a1 1 0 0 1 1.52-.85l10 6.5a1 1 0 0 1 0 1.7l-10 6.5A1 1 0 0 1 8 18.5z"/></svg>;
}
