"use client";

import { useState } from "react";
import { AtlasIcon } from "./asset";
import { AtlasBottomBar } from "./bottom-bar";
import { FilterChips } from "./filter-chips";
import { FILTER_PLACES, LIST_ORDER, PLACES, type ListSort, type MapFilter } from "./fixtures";
import { ContextHeader, PlanSegment } from "./missions-chrome";
import { PlaceRow } from "./place-row";

/*
 * List · Missions › List — Figma frame 1:252, with the List results component set (1:4283):
 * the same places as the map, as rows. Chips filter, Sort switches between "Closest first" and
 * "Shortest visit", rows open the place. The search field is ready for a search handler.
 */

export function PlacesList() {
  const [filter, setFilter] = useState<MapFilter>("All");
  const [sort, setSort] = useState<ListSort>("Closest first");
  const [query, setQuery] = useState("");

  const allowed = FILTER_PLACES[filter].places;
  const rows = LIST_ORDER[sort].filter((id) => allowed.includes(id));
  const count = rows.length;

  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex w-full flex-1 flex-col items-start gap-[10px] p-[12px]">
        <ContextHeader />
        <PlanSegment active="explore" />
        <label className="flex h-[44px] w-full items-center gap-[8px] rounded-[22px] border border-atlas-umber bg-white pl-[12px] pr-[14px]">
          <AtlasIcon src="/atlas-ui/icon-search.svg" size={18} className="shrink-0" />
          <span className="sr-only">Search places</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search places"
            className="min-w-0 flex-1 bg-transparent font-manrope text-[16px] leading-[22px] text-atlas-ink outline-none placeholder:text-atlas-slate/70"
          />
        </label>
        <div className="flex w-full flex-col items-start gap-[10px]">
          <FilterChips filter={filter} onChange={setFilter} />
          <div className="flex w-full items-center justify-between">
            <h1 className="font-grotesk text-[18px] font-bold leading-[23px] text-atlas-teal">
              {count} {count === 1 ? "place" : "places"}
            </h1>
            <button
              type="button"
              onClick={() => setSort(sort === "Closest first" ? "Shortest visit" : "Closest first")}
              className="flex h-[44px] items-center gap-[6px] font-manrope text-[13px] font-semibold leading-[18px] text-atlas-teal"
            >
              <AtlasIcon src="/atlas-ui/icon-sort.svg" size={15} />
              {sort}
            </button>
          </div>
          {rows.map((id) => (
            <PlaceRow key={id} place={PLACES[id]} photo={PLACES[id].listPhoto} />
          ))}
        </div>
      </div>
      <div className="sticky bottom-0 z-10">
        <AtlasBottomBar active="missions" />
      </div>
    </main>
  );
}
