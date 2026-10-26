"use client";

import { useCallback, useEffect, useState } from "react";
import { AtlasIcon } from "../asset";
import { AtlasBottomBar } from "../bottom-bar";
import { FILTER_PLACES, PLACES, orderedCards, type MapFilter, type PlaceId } from "../fixtures";
import { FilterChips } from "../filter-chips";
import { ContextHeader, PlanSegment } from "../missions-chrome";
import { PlaceCard } from "../place-card";
import { AtlasLink } from "../ui";
import type { MarkerImage } from "./markers";
import { useMapScene, useSceneContext, type ScenePlace } from "./scene";

/*
 * Main · Missions › Map (home) — Figma frame 1:205, with the Map layer component set (1:2926):
 * five filter chips, six places, and the place sheet. Chips filter, markers select a place,
 * cards open its details. The map controls toggle 2D / 3D and centre on the guest or the hotel,
 * showing the two toasts from frames 1:5054 and 1:5059.
 *
 * Geometry is anchored to the screen edges: header, switch, chips and controls to the top;
 * sheet and bottom bar to the bottom. On a 390 x 844 screen everything sits exactly where the
 * design puts it.
 */

const SHEET_TOP_FROM_BOTTOM = 292; // 844 - 552
const TOAST_FROM_BOTTOM = 304; // 844 - (496 + 44)

function markerFor(id: PlaceId, selected: boolean): MarkerImage {
  const kind = PLACES[id].kind;
  if (kind === "attraction") return selected ? "attraction-selected" : "attraction";
  if (kind === "facility") return selected ? "facility-selected" : "facility";
  return selected ? "partner-selected" : "partner";
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[44px] items-center justify-center rounded-[12px] border border-atlas-beige bg-atlas-paper"
    >
      {children}
    </button>
  );
}

export type MapToastKind = "you" | "hotel";

const TOAST_TEXT: Record<MapToastKind, string> = {
  you: "Centred on your location",
  hotel: "Centred on Hotel A",
};

export function MapToast({ kind }: { kind: MapToastKind }) {
  return (
    <div
      role="status"
      className="pointer-events-auto absolute left-[12px] right-[12px] flex h-[44px] items-center gap-[8px] rounded-[14px] bg-atlas-ink px-[14px] drop-shadow-[0px_6px_9px_rgba(28,41,41,0.3)]"
      style={{ bottom: TOAST_FROM_BOTTOM }}
    >
      <AtlasIcon src="/atlas-ui/icon-locate-light-18.svg" size={18} />
      <p className="font-manrope text-[14px] leading-[19px] text-atlas-paper">{TOAST_TEXT[kind]}</p>
    </div>
  );
}

export function MissionsMap({ initialToast }: { initialToast?: MapToastKind }) {
  const [filter, setFilter] = useState<MapFilter>("All");
  const [selected, setSelected] = useState<PlaceId>("partner-2");
  const [toast, setToast] = useState<MapToastKind | null>(initialToast ?? null);
  const { moveCamera, dimension, setDimension } = useSceneContext();

  const visible = FILTER_PLACES[filter].places;
  const places: ScenePlace[] = visible.map((id) => ({ id, marker: markerFor(id, id === selected) }));

  const selectPlace = useCallback(
    (id: PlaceId) => {
      if (FILTER_PLACES[filter].places.includes(id)) setSelected(id);
    },
    [filter]
  );

  useMapScene({ places, hotel: true, you: true, bottomInset: SHEET_TOP_FROM_BOTTOM, allowTilt: true }, selectPlace);

  // A shown toast clears itself, like a system toast.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  // Review routes that open on a toast start centred where that toast says.
  useEffect(() => {
    if (initialToast) moveCamera(initialToast);
  }, [initialToast, moveCamera]);

  const changeFilter = (next: MapFilter) => {
    setFilter(next);
    setSelected(FILTER_PLACES[next].firstSelected);
  };

  const centre = (target: MapToastKind) => {
    moveCamera(target);
    setToast(target);
  };

  const cards = orderedCards(filter, selected);
  const count = cards.length;

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute left-[12px] right-[12px] top-[12px]">
        <ContextHeader />
      </div>
      <div className="pointer-events-auto absolute left-[12px] right-[12px] top-[72px]">
        <PlanSegment active="explore" />
      </div>
      <div className="pointer-events-auto absolute left-0 right-0 top-[128px]">
        <FilterChips filter={filter} onChange={changeFilter} className="px-[12px]" />
      </div>

      <div className="pointer-events-auto absolute right-[12px] top-[180px] flex flex-col items-start gap-[6px]">
        <button
          type="button"
          aria-label={dimension === "3D" ? "Show a flat 2D map" : "Show a tilted 3D map"}
          onClick={() => setDimension(dimension === "3D" ? "2D" : "3D")}
          className="flex size-[44px] items-center justify-center rounded-[12px] border border-atlas-beige bg-atlas-paper font-grotesk text-[13px] font-bold leading-[17px] text-atlas-teal"
        >
          {dimension === "3D" ? "2D" : "3D"}
        </button>
        <ControlButton label="Centre on my location" onClick={() => centre("you")}>
          <AtlasIcon src="/atlas-ui/icon-locate.svg" size={19} />
        </ControlButton>
        <ControlButton label="Show Hotel A" onClick={() => centre("hotel")}>
          <AtlasIcon src="/atlas-ui/icon-home-teal-19.svg" size={19} />
        </ControlButton>
      </div>

      {toast ? <MapToast kind={toast} /> : null}

      <section
        aria-label="Places"
        className="pointer-events-auto absolute bottom-[96px] left-0 right-0 flex h-[196px] flex-col items-center gap-[8px] overflow-hidden rounded-t-[22px] bg-atlas-paper pt-[8px] shadow-[0px_-4px_18px_0px_rgba(28,41,41,0.1)]"
      >
        <div aria-hidden className="h-[4px] w-[36px] shrink-0 rounded-[2px] bg-atlas-beige" />
        <div className="flex w-full items-center justify-between pl-[16px] pr-[12px]">
          <h2 className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">
            {count} {count === 1 ? "place" : "places"} for you
          </h2>
          <AtlasLink
            to="List"
            className="flex h-[44px] items-center gap-[6px] rounded-[22px] border border-atlas-beige px-[12px] font-manrope text-[13px] font-semibold leading-[18px] text-atlas-ink"
          >
            <AtlasIcon src="/atlas-ui/icon-list-ink.svg" size={16} />
            List
          </AtlasLink>
        </div>
        <div
          key={`${filter}-${selected}`}
          className="flex w-full snap-x items-start gap-[10px] overflow-x-auto scroll-px-[16px] px-[16px] pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {cards.map((id) => (
            <PlaceCard key={id} place={PLACES[id]} selected={id === selected} />
          ))}
        </div>
      </section>

      <div className="pointer-events-auto absolute bottom-0 left-0 right-0">
        <AtlasBottomBar active="missions" />
      </div>
    </div>
  );
}
