"use client";

import { useState } from "react";
import { AtlasIcon } from "../asset";
import { PLACES, ROUTES, type RouteId } from "../fixtures";
import { AtlasButton, AtlasLink } from "../ui";
import { useMapScene, useSceneContext } from "./scene";

/*
 * Route · Walking route — Figma frame 1:731, and its RouteP1 (2041), RouteP4 (2088) and RouteA1
 * (2133) variants. The walking line is a real Mapbox walking route from Hotel A, kept as a
 * fixture; the sheet's times, distances and steps are the design's copy.
 */

const SHEET_HEIGHT = 339; // 844 - 505

const STEP_ICONS = {
  up: "/atlas-ui/icon-up.svg",
  turn: "/atlas-ui/icon-turn.svg",
  pin: "/atlas-ui/icon-pin-teal-22.svg",
} as const;

export function RouteScreen({ route }: { route: RouteId }) {
  const fixture = ROUTES[route];
  const destination = PLACES[fixture.destination];
  const [following, setFollowing] = useState(true);
  const { moveCamera } = useSceneContext();

  useMapScene({
    places: [{ id: destination.id, marker: destination.kind === "attraction" ? "attraction-selected" : "route-destination" }],
    hotel: false,
    you: false,
    route,
    bottomInset: SHEET_HEIGHT,
    allowTilt: false,
  });

  const toggleFollow = () => {
    if (!following) moveCamera("you");
    setFollowing(!following);
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute left-[16px] right-[16px] top-[16px] flex items-center gap-[12px] rounded-[16px] bg-atlas-teal px-[14px] py-[12px]">
        <AtlasLink
          to={fixture.endTo}
          label="End route"
          className="flex size-[44px] shrink-0 items-center justify-center rounded-[12px] bg-atlas-paper/15"
        >
          <AtlasIcon src="/atlas-ui/icon-close-light.svg" size={20} />
        </AtlasLink>
        <div className="flex flex-col items-start gap-[2px]">
          <p className="font-manrope text-[12px] leading-[16px] text-atlas-beige">Walking to</p>
          <p className="font-grotesk text-[18px] font-bold leading-[23px] text-atlas-paper">{destination.name}</p>
        </div>
      </div>

      <button
        type="button"
        aria-pressed={following}
        aria-label="Follow my location"
        onClick={toggleFollow}
        className={`pointer-events-auto absolute right-[16px] top-[100px] flex size-[44px] items-center justify-center rounded-[12px] border border-atlas-beige ${
          following ? "bg-atlas-teal" : "bg-atlas-paper"
        }`}
      >
        <AtlasIcon src={following ? "/atlas-ui/icon-locate-light-20.svg" : "/atlas-ui/icon-locate.svg"} size={following ? 20 : 19} />
      </button>

      <section
        aria-label="Walking directions"
        className="pointer-events-auto absolute bottom-0 left-0 right-0 flex flex-col items-center gap-[14px] rounded-t-[24px] bg-atlas-paper px-[16px] pb-[24px] pt-[10px] drop-shadow-[0px_-4px_10px_rgba(28,41,41,0.12)]"
      >
        <div aria-hidden className="h-[4px] w-[36px] shrink-0 rounded-[2px] bg-atlas-beige" />
        <div className="flex w-full items-end gap-[10px]">
          <p className="font-grotesk text-[26px] font-bold leading-[33px] text-atlas-teal">{fixture.minutes}</p>
          <p className="font-manrope text-[14px] leading-[19px] text-atlas-slate">{fixture.summary}</p>
        </div>
        <ol className="flex w-full flex-col items-start">
          {fixture.steps.map((step, index) => (
            <li
              key={step.text}
              className={`flex h-[48px] w-full items-center gap-[12px] ${index < fixture.steps.length - 1 ? "border-b border-atlas-beige" : ""}`}
            >
              <AtlasIcon src={STEP_ICONS[step.icon]} size={22} className="shrink-0" />
              <p
                className={`min-w-0 flex-1 font-manrope text-[15px] leading-[20px] text-atlas-ink ${step.emphasis ? "font-semibold" : ""}`}
              >
                {step.text}
              </p>
              <p className="shrink-0 font-manrope text-[13px] leading-[18px] text-atlas-slate">{step.distance}</p>
            </li>
          ))}
        </ol>
        {fixture.action.kind === "button" ? (
          <AtlasButton to={fixture.action.to} icon={fixture.action.icon}>
            {fixture.action.label}
          </AtlasButton>
        ) : (
          <p className="flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[14px] bg-atlas-sand font-manrope text-[16px] font-semibold leading-[22px] text-atlas-ink">
            <AtlasIcon src={fixture.action.icon} size={19} />
            {fixture.action.label}
          </p>
        )}
        <p className="w-full text-center font-manrope text-[12px] leading-[16px] text-atlas-slate">
          Walking route by Mapbox. Check the street as you go.
        </p>
      </section>
    </div>
  );
}
