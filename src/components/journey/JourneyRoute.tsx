import { LogoMark } from "@/components/ui/LogoMark";
import { Spark } from "@/components/ui/Spark";
import { cn } from "@/lib/utils/cn";
import type { JourneyEntry } from "@/types";
import { JourneyCheckpoint } from "./JourneyCheckpoint";

/*
 * Layout (all lengths in rem): entries climb in rows of three, snaking
 * left→right then right→left (boustrophedon), each row higher than the last and
 * each card a little higher than its neighbour — so the trail always rises and
 * any number of entries fits without overlapping.
 */
const COLS = 3;
const ROW_H = 19;
const STAGGER = 2.75;
const POST = 2.5;
const BASE = 1.5;
const CARD_ALLOWANCE = 11.5;
const PX = 16;

interface Node {
  entry: JourneyEntry;
  col: number;
  xPct: number;
  /** Distance of the trail node from the container bottom, in rem. */
  bottom: number;
}

function layout(entries: JourneyEntry[]): { nodes: Node[]; height: number } {
  const nodes = entries.map((entry, i) => {
    const row = Math.floor(i / COLS);
    const k = i % COLS;
    const col = row % 2 === 0 ? k : COLS - 1 - k;
    return { entry, col, xPct: ((col + 0.5) / COLS) * 100, bottom: BASE + row * ROW_H + k * STAGGER };
  });
  const top = Math.max(...nodes.map((n) => n.bottom), 0);
  return { nodes, height: top + POST + CARD_ALLOWANCE };
}

function trailPath(nodes: Node[], height: number): string {
  const pt = (n: Node) => ({ x: n.xPct * 3, y: (height - n.bottom) * PX });
  const first = nodes[0];
  if (!first) return "";
  const p0 = pt(first);
  let d = `M${p0.x - 70} ${height * PX} C${p0.x - 40} ${height * PX} ${p0.x - 30} ${p0.y} ${p0.x} ${p0.y}`;
  for (let i = 1; i < nodes.length; i++) {
    const a = pt(nodes[i - 1]!);
    const b = pt(nodes[i]!);
    if (a.x === b.x) {
      // Row change on the same column: bow outward like a switchback.
      const bow = nodes[i]!.col === COLS - 1 ? 45 : -45;
      d += ` C${a.x + bow} ${a.y} ${b.x + bow} ${b.y} ${b.x} ${b.y}`;
    } else {
      const mid = (b.x - a.x) / 2;
      d += ` C${a.x + mid} ${a.y} ${b.x - mid} ${b.y} ${b.x} ${b.y}`;
    }
  }
  return d;
}

/** Desktop mountain route (lg+). Mobile uses JourneyTimeline. */
export function JourneyRoute({ entries, className }: { entries: JourneyEntry[]; className?: string }) {
  const { nodes, height } = layout(entries);
  const d = trailPath(nodes, height);

  return (
    <div data-journey-trail className={cn("relative", className)} style={{ height: `${height}rem` }}>
      <svg
        aria-hidden
        className="absolute inset-0 size-full overflow-visible"
        viewBox={`0 0 300 ${height * PX}`}
        preserveAspectRatio="none"
      >
        <path d={d} className="stroke-sunset-500" strokeWidth="14" strokeOpacity="0.25" fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        <path
          d={d}
          className="stroke-sunset-500 animate-trail-march motion-reduce:animate-none"
          strokeWidth="5"
          strokeDasharray="0 13"
          fill="none"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <ol className="contents">
        {nodes.map((n, i) => {
          const isLast = i === nodes.length - 1;
          return (
            <li key={n.entry.id} className="contents">
              {/* Post, pennant and trail node */}
              <span aria-hidden className="absolute -translate-x-1/2" style={{ left: `${n.xPct}%`, bottom: `${n.bottom}rem`, height: `${POST}rem` }}>
                <span className="absolute bottom-0 left-1/2 h-full w-1 -translate-x-1/2 rounded-pill bg-wood-700" />
                <Pennant className={cn("absolute left-[calc(50%+2px)] top-0.5", isLast ? "text-flag-red" : "text-blue-500")} />
                {isLast && <Spark className="absolute left-12 -top-1 size-4 text-sunset-500" />}
                <span className="absolute bottom-0 left-1/2 size-3 -translate-x-1/2 translate-y-1/2 rounded-pill bg-sunset-500 shadow-[0_0_12px_var(--color-sunset-500)]" />
              </span>
              <div
                className="absolute w-[min(15.5rem,30%)] -translate-x-1/2"
                style={{ left: `${n.xPct}%`, bottom: `${n.bottom + POST}rem` }}
              >
                <JourneyCheckpoint entry={n.entry} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Pennant({ className }: { className?: string }) {
  return (
    <span className={cn("flex h-5 w-8 items-center bg-current pl-1 [clip-path:polygon(0_0,100%_50%,0_100%)]", className)}>
      <LogoMark className="h-2 text-paper" />
    </span>
  );
}
