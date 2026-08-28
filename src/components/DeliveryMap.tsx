import type { DeliveryJob } from "@/lib/driver";

/**
 * Lightweight prototype map: a stylized street grid with pickup/drop-off pins
 * and a route line between them. No external map SDK needed.
 */
export function DeliveryMap({
  jobs,
  activeId,
  className = "",
}: {
  jobs: DeliveryJob[];
  activeId?: string;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl border border-border bg-muted/50 ${className}`}
      style={{ aspectRatio: "4 / 3" }}
      role="img"
      aria-label="Map of available delivery pickups and drop-offs"
    >
      <svg viewBox="0 0 100 75" className="absolute inset-0 h-full w-full">
        <rect width="100" height="75" fill="hsl(var(--muted))" opacity="0.5" />
        {[12, 26, 40, 54, 68].map((y) => (
          <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.6" className="text-border" />
        ))}
        {[14, 32, 50, 68, 86].map((x) => (
          <line key={`v${x}`} x1={x} y1="0" x2={x} y2="75" stroke="currentColor" strokeWidth="0.6" className="text-border" />
        ))}
        <path d="M0 60 Q 30 46 55 58 T 100 44" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary/15" />

        {jobs.map((j) => {
          const dim = activeId && activeId !== j.id;
          const px = (j.pickup.x / 100) * 100;
          const py = (j.pickup.y / 100) * 75;
          const dx = (j.dropoff.x / 100) * 100;
          const dy = (j.dropoff.y / 100) * 75;
          return (
            <g key={j.id} opacity={dim ? 0.25 : 1}>
              <line
                x1={px}
                y1={py}
                x2={dx}
                y2={dy}
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="3 2"
                className="text-primary"
              />
              <circle cx={px} cy={py} r="2.6" className="fill-primary" />
              <circle cx={dx} cy={dy} r="2.6" className="fill-foreground" />
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 left-2 flex gap-3 rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-medium backdrop-blur">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-primary" /> Pickup
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-foreground" /> Drop-off
        </span>
      </div>
    </div>
  );
}
