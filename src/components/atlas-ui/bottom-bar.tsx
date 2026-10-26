import Link from "next/link";
import type { ReactNode } from "react";
import { AtlasAsset, AtlasIcon } from "./asset";
import { screenHref, type ScreenKey } from "./screens";

/*
 * Atlas bottom bar — Figma component "Bottom bar" (node 1:21, variants at 7:795).
 *
 * Three tabs: Missions (map and plan), Scan, Profile. The active tab lifts into a raised
 * teal button sitting in a notch cut out of the bar. The notch is part of the exported bar
 * artwork, so each active tab has its own bar file.
 *
 * The frame is 390 x 96 and tab boxes are 122 wide at x = 12, 134 and 256, so the geometry
 * below is absolute rather than a flex row: it mirrors the design one to one.
 */

export type AtlasTab = "missions" | "scan" | "profile";

type TabSpec = {
  tab: AtlasTab;
  label: string;
  left: number;
  screen: ScreenKey;
  activeIcon: string;
  idleIcon: string;
};

const TABS: readonly TabSpec[] = [
  {
    tab: "missions",
    label: "Missions",
    left: 12,
    screen: "Main",
    activeIcon: "/atlas-ui/icon-compass-active.svg",
    idleIcon: "/atlas-ui/icon-compass.svg",
  },
  {
    tab: "scan",
    label: "Scan",
    left: 134,
    screen: "Scan",
    activeIcon: "/atlas-ui/icon-qr-active.svg",
    idleIcon: "/atlas-ui/icon-qr.svg",
  },
  {
    tab: "profile",
    label: "Profile",
    left: 256,
    screen: "Stay",
    activeIcon: "/atlas-ui/icon-profile-active.svg",
    idleIcon: "/atlas-ui/icon-profile.svg",
  },
];

const BAR_ARTWORK: Record<AtlasTab, string> = {
  missions: "/atlas-ui/nav-bar-missions.svg",
  scan: "/atlas-ui/nav-bar-scan.svg",
  profile: "/atlas-ui/nav-bar-profile.svg",
};

/**
 * A tab becomes a link only when its screen exists, so the bar never offers a dead route.
 * The active tab is never a link to itself.
 */
function Tab({
  screen,
  isActive,
  onSelect,
  style,
  className,
  children,
}: {
  screen: ScreenKey;
  isActive: boolean;
  onSelect?: () => void;
  style: React.CSSProperties;
  className: string;
  children: ReactNode;
}) {
  if (onSelect && !isActive) {
    return (
      <button type="button" onClick={onSelect} style={style} className={className}>
        {children}
      </button>
    );
  }

  const href = isActive ? null : screenHref(screen);

  if (!href) {
    return (
      <span style={style} className={className} aria-current={isActive ? "page" : undefined}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} style={style} className={className}>
      {children}
    </Link>
  );
}

/**
 * `onSelect` turns the tabs into buttons that report the tap instead of navigating — used by
 * the NavLiquid motion reference, where tapping only moves the raised button.
 */
export function AtlasBottomBar({
  active,
  onSelect,
  className = "",
}: {
  active: AtlasTab;
  onSelect?: (tab: AtlasTab) => void;
  className?: string;
}) {
  return (
    <nav aria-label="Atlas sections" className={`relative h-[96px] w-full bg-atlas-paper ${className}`}>
      <AtlasAsset src={BAR_ARTWORK[active]} width={386} height={76} className="absolute left-[2px] top-[22px]" />

      {TABS.map((spec) =>
        spec.tab === active ? (
          <Tab
            key={spec.tab}
            screen={spec.screen}
            isActive
            style={{ left: spec.left }}
            className="absolute top-0 block h-[84px] w-[122px]"
          >
            <span className="absolute left-[35px] top-[2px] flex size-[52px] items-center justify-center rounded-[26px] bg-atlas-teal shadow-[0px_4px_12px_0px_rgba(28,41,41,0.22)]">
              <AtlasIcon src={spec.activeIcon} size={24} />
            </span>
            <span className="absolute left-0 top-[64px] w-full text-center font-manrope text-[11px] font-semibold text-atlas-paper">
              {spec.label}
            </span>
          </Tab>
        ) : (
          <Tab
            key={spec.tab}
            screen={spec.screen}
            isActive={false}
            onSelect={onSelect ? () => onSelect(spec.tab) : undefined}
            style={{ left: spec.left }}
            className="absolute top-[28px] flex h-[56px] w-[122px] flex-col items-center justify-center gap-[3px]"
          >
            <AtlasIcon src={spec.idleIcon} size={22} />
            <span className="font-manrope text-[11px] font-medium text-atlas-beige">{spec.label}</span>
          </Tab>
        )
      )}
    </nav>
  );
}
