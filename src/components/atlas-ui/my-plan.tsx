import type { ReactNode } from "react";
import { AtlasAsset, AtlasIcon } from "./asset";
import { AtlasBottomBar } from "./bottom-bar";
import { ContextHeader, PlanSegment } from "./missions-chrome";
import type { ScreenKey } from "./screens";
import { AtlasLink } from "./ui";

/*
 * MyPlan · Missions › My plan — Figma frame 1:489 — and the six states it moves through:
 * MyPlanReplaced (2180), MyPlanRemoved (2285), MyPlanAddedSpa (2378), MyPlanAddedPool (2499),
 * MyPlanAddedA1 (2620) and MyPlanAddedP4 (2741).
 *
 * The plan is a timeline: start at the hotel, a done stop, the next stop, an unavailable or
 * replaced third stop, an optional added stop, and the way back. One component renders every
 * state from a description of it, so the real plan can drive it later.
 */

type ThirdStop =
  | { kind: "unavailable" }
  | { kind: "replaced"; name: string; meta: string; to: ScreenKey; action: { label: string; to: ScreenKey } }
  | { kind: "none" };

type AddedStop = { name: string; meta: string; to: ScreenKey; action: { label: string; to: ScreenKey } };

export type PlanState = {
  progress: { stops: string; back: string; right: string; steps: number; overTime?: boolean };
  third: ThirdStop;
  added?: AddedStop;
  toast?: { message: string; undoTo: ScreenKey };
};

const DOT = "flex size-[28px] shrink-0 items-center justify-center rounded-[14px]";
const SMALL_BUTTON = "flex h-[44px] shrink-0 items-center justify-center rounded-[12px] border border-atlas-teal px-[12px] font-manrope text-[13px] font-semibold leading-[18px] text-atlas-teal";

function Row({ dot, line, children, padded = true }: { dot: ReactNode; line?: "teal" | "beige"; children: ReactNode; padded?: boolean }) {
  return (
    <li className={`flex w-full items-start gap-[10px] ${padded ? "pb-[12px]" : ""}`}>
      <div aria-hidden className="flex w-[28px] shrink-0 flex-col items-center self-stretch">
        {dot}
        {line ? <div className={`min-h-px w-[2px] flex-1 ${line === "teal" ? "bg-atlas-teal" : "bg-atlas-beige"}`} /> : null}
      </div>
      {children}
    </li>
  );
}

function NumberDot({ n, tone = "teal" }: { n: number; tone?: "teal" | "dashed" }) {
  return (
    <div
      className={`${DOT} border-2 font-manrope text-[13px] font-semibold leading-[18px] ${
        tone === "teal" ? "border-atlas-teal bg-atlas-paper text-atlas-teal" : "border-dashed border-atlas-slate text-atlas-slate"
      }`}
    >
      {n}
    </div>
  );
}

function StopCard({ stop, n }: { stop: AddedStop; n: number }) {
  return (
    <Row dot={<NumberDot n={n} />} line="beige">
      <div className="flex min-w-0 flex-1 items-center gap-[10px] rounded-[14px] border border-atlas-beige p-[10px]">
        <AtlasLink to={stop.to} className="flex min-w-0 flex-1 flex-col items-start gap-px whitespace-nowrap text-left">
          <span className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">{stop.name}</span>
          <span className="font-manrope text-[12px] leading-[16px] text-atlas-slate">{stop.meta}</span>
        </AtlasLink>
        <AtlasLink to={stop.action.to} className={SMALL_BUTTON}>
          {stop.action.label}
        </AtlasLink>
      </div>
    </Row>
  );
}

function Progress({ progress }: { progress: PlanState["progress"] }) {
  return (
    <div className="flex w-full flex-col items-start gap-[6px]">
      <div className={`flex w-full items-start justify-between whitespace-nowrap font-manrope text-[13px] leading-[18px] ${progress.overTime ? "font-semibold" : ""}`}>
        <p className="text-atlas-ink">
          <span className="font-semibold">{progress.stops}</span> · {progress.back}
        </p>
        <p className="font-semibold text-atlas-teal">{progress.right}</p>
      </div>
      <div className="flex w-full items-start gap-[4px]">
        {Array.from({ length: progress.steps }, (_, index) => (
          <div key={index} className={`h-[5px] min-w-px flex-1 rounded-[3px] ${index === 0 ? "bg-atlas-teal" : "bg-atlas-beige"}`} />
        ))}
      </div>
      {progress.overTime ? (
        <div className="flex w-full items-center gap-[8px] rounded-[10px] bg-atlas-sand px-[10px] py-[8px]">
          <AtlasIcon src="/atlas-ui/icon-clock-16.svg" size={16} className="shrink-0" />
          <p className="min-w-0 flex-1 font-manrope text-[13px] leading-[18px] text-atlas-ink">
            This plan now runs past your 2 h free. Remove a stop or re-plan.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function MissionsShell({
  children,
  gap = 12,
  paddingBottom = 20,
  toast,
}: {
  children: ReactNode;
  gap?: number;
  paddingBottom?: number;
  toast?: ReactNode;
}) {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex w-full flex-1 flex-col items-start px-[12px] pt-[12px]" style={{ gap, paddingBottom }}>
        <ContextHeader />
        <PlanSegment active="plan" />
        {children}
      </div>
      <div className="sticky bottom-0 z-10">
        {toast ? <div className="absolute bottom-[108px] left-[12px] right-[12px]">{toast}</div> : null}
        <AtlasBottomBar active="missions" />
      </div>
    </main>
  );
}

export function MyPlan({ state }: { state: PlanState }) {
  const toast = state.toast ? (
    <div
      role="status"
      className="flex h-[52px] w-full items-center justify-between rounded-[14px] bg-atlas-ink pl-[16px] pr-[8px] drop-shadow-[0px_6px_9px_rgba(28,41,41,0.3)]"
    >
      <p className="font-manrope text-[14px] leading-[19px] text-atlas-paper">{state.toast.message}</p>
      <AtlasLink to={state.toast.undoTo} className="flex h-[44px] items-center px-[12px] font-manrope text-[14px] font-semibold leading-[19px] text-atlas-beige">
        Undo
      </AtlasLink>
    </div>
  ) : undefined;

  return (
    <MissionsShell toast={toast}>
      <div className="flex w-full items-center justify-between">
        <h1 className="font-grotesk text-[20px] font-bold leading-[26px] text-atlas-teal">Today</h1>
        <AtlasLink
          to="Preferences"
          className="flex h-[44px] items-center gap-[6px] rounded-[22px] border border-atlas-beige px-[12px] font-manrope text-[13px] font-semibold leading-[18px] text-atlas-ink"
        >
          <AtlasIcon src="/atlas-ui/icon-edit-15.svg" size={15} />
          Re-plan
        </AtlasLink>
      </div>

      <Progress progress={state.progress} />

      <AtlasLink to="Route" label="Open the walking route" className="relative block h-[92px] w-[358px] shrink-0 overflow-hidden rounded-[14px] bg-atlas-dune">
        <AtlasAsset src="/atlas-ui/route-preview-art.svg" width={358} height={92} className="absolute left-0 top-0" />
        <span className="absolute left-[274px] top-[62px] flex items-center justify-center rounded-[10px] bg-atlas-paper px-[9px] py-[3px] font-manrope text-[12px] font-semibold leading-[16px] text-atlas-teal">
          Open map
        </span>
      </AtlasLink>

      <ol className="flex w-full flex-col items-start">
        <Row
          padded={false}
          line="teal"
          dot={
            <div className={`${DOT} bg-atlas-teal`}>
              <AtlasIcon src="/atlas-ui/icon-home-light-14.svg" size={14} />
            </div>
          }
        >
          <p className="min-w-0 flex-1 pb-[12px] pt-[4px] font-manrope text-[14px] leading-[19px] text-atlas-ink">
            <span className="font-semibold">Start at Hotel A</span> · 16:00
          </p>
        </Row>

        <Row
          padded={false}
          line="beige"
          dot={
            <div className={`${DOT} bg-atlas-teal`}>
              <AtlasIcon src="/atlas-ui/icon-check-light-14.svg" size={14} />
            </div>
          }
        >
          <AtlasLink to="DetailP1" className="flex min-w-0 flex-1 flex-col items-start gap-px pb-[12px] text-left">
            <span className="whitespace-nowrap font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">Partner Place 1</span>
            <span className="w-full font-manrope text-[12px] leading-[16px] text-atlas-slate">Checked in 16:12 · achievement unlocked</span>
          </AtlasLink>
        </Row>

        <Row dot={<NumberDot n={2} />} line="beige">
          <div className="flex min-w-0 flex-1 flex-col items-start gap-[8px] rounded-[14px] border-2 border-atlas-teal p-[10px]">
            <AtlasLink to="Detail" className="flex w-full items-center justify-between whitespace-nowrap text-atlas-teal">
              <span className="font-grotesk text-[16px] font-bold leading-[20px]">Partner Place 2</span>
              <span className="font-manrope text-[12px] font-semibold leading-[16px]">Next</span>
            </AtlasLink>
            <p className="whitespace-nowrap font-manrope text-[12px] leading-[16px] text-atlas-slate">11 min walk · 60 min visit</p>
            <div className="flex w-full items-start gap-[8px]">
              <AtlasLink
                to="Scan"
                className="flex h-[44px] min-w-0 flex-1 items-center justify-center gap-[6px] rounded-[12px] bg-atlas-teal font-manrope text-[14px] font-semibold leading-[19px] text-atlas-paper"
              >
                <AtlasIcon src="/atlas-ui/icon-qr-light-17.svg" size={17} />
                Check in
              </AtlasLink>
              <AtlasLink
                to="Route"
                className="flex h-[44px] min-w-0 flex-1 items-center justify-center rounded-[12px] border border-atlas-teal font-manrope text-[14px] font-semibold leading-[19px] text-atlas-teal"
              >
                Directions
              </AtlasLink>
            </div>
          </div>
        </Row>

        {state.third.kind === "unavailable" ? (
          <Row dot={<NumberDot n={3} tone="dashed" />} line="beige">
            <div className="flex min-w-0 flex-1 items-center gap-[10px] rounded-[14px] bg-atlas-sand p-[10px]">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-px whitespace-nowrap">
                <p className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-slate line-through">Partner Place 3</p>
                <p className="font-manrope text-[12px] font-semibold leading-[16px] text-atlas-ink">Not available anymore</p>
              </div>
              <AtlasLink to="Repair" className={`${SMALL_BUTTON} bg-atlas-paper`}>
                Fix
              </AtlasLink>
            </div>
          </Row>
        ) : null}
        {state.third.kind === "replaced" ? <StopCard n={3} stop={state.third} /> : null}
        {state.added ? <StopCard n={4} stop={state.added} /> : null}

        <Row
          padded={false}
          dot={
            <div className={`${DOT} border-2 border-atlas-teal bg-atlas-paper`}>
              <AtlasIcon src="/atlas-ui/icon-home-teal-14.svg" size={14} />
            </div>
          }
        >
          <p className="min-w-0 flex-1 pt-[4px] font-manrope text-[14px] leading-[19px] text-atlas-ink">
            <span className="font-semibold">Back to Hotel A</span> · around 18:10
          </p>
        </Row>
      </ol>
    </MissionsShell>
  );
}

const OVER = { right: "Runs over", steps: 4, overTime: true } as const;

/** Every state of My plan the design draws. */
export const PLAN_STATES = {
  base: {
    progress: { stops: "1 of 3 stops", back: "back by 18:10", right: "1 h 25 min left", steps: 3 },
    third: { kind: "unavailable" },
  },
  replaced: {
    progress: { stops: "1 of 3 stops", back: "back by 18:15", right: "1 h 25 min left", steps: 3 },
    third: {
      kind: "replaced",
      name: "Partner Place 4",
      meta: "9 min from stop 2 · 60 min",
      to: "DetailP4",
      action: { label: "Check in", to: "Scan" },
    },
    toast: { message: "Stop 3 replaced with Partner Place 4", undoTo: "MyPlan" },
  },
  removed: {
    progress: { stops: "1 of 2 stops", back: "back by 17:40", right: "1 h 25 min left", steps: 2 },
    third: { kind: "none" },
    toast: { message: "Stop 3 removed from your plan", undoTo: "MyPlan" },
  },
  addedSpa: {
    progress: { stops: "1 of 4 stops", back: "back by 19:40", ...OVER },
    third: { kind: "unavailable" },
    added: { name: "Spa", meta: "In Hotel A · 90 min", to: "FacilityDetail", action: { label: "Check in", to: "Scan" } },
    toast: { message: "Added the spa to your plan", undoTo: "FacilityDetail" },
  },
  addedPool: {
    progress: { stops: "1 of 4 stops", back: "back by 19:10", ...OVER },
    third: { kind: "unavailable" },
    added: { name: "Pool", meta: "In Hotel A · 60 min", to: "FacilityPool", action: { label: "Check in", to: "CheckedIn" } },
    toast: { message: "Added the pool to your plan", undoTo: "FacilityPool" },
  },
  addedA1: {
    progress: { stops: "1 of 4 stops", back: "back by 19:05", ...OVER },
    third: { kind: "unavailable" },
    added: { name: "Attraction 1", meta: "20 min walk · 45 min", to: "AttractionDetail", action: { label: "Unlock", to: "ARUnlock" } },
    toast: { message: "Added Attraction 1 to your plan", undoTo: "AttractionDetail" },
  },
  addedP4: {
    progress: { stops: "1 of 4 stops", back: "back by 19:15", ...OVER },
    third: { kind: "unavailable" },
    added: { name: "Partner Place 4", meta: "14 min walk · 60 min", to: "DetailP4", action: { label: "Check in", to: "Scan" } },
    toast: { message: "Added Partner Place 4 to your plan", undoTo: "DetailP4" },
  },
} satisfies Record<string, PlanState>;
