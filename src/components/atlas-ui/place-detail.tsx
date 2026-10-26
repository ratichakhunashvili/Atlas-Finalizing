import type { ReactNode } from "react";
import { AtlasAsset, AtlasIcon } from "./asset";
import { ReadMore } from "./read-more";
import type { ScreenKey } from "./screens";
import { AtlasBackButton, AtlasButton, AtlasLink } from "./ui";

/*
 * Building blocks of the place detail screens: Detail (1:280), DetailP1 (1:1799), DetailP4
 * (1:1867), FacilityDetail (1:872), FacilityPool (1:1933) and AttractionDetail (1:925).
 *
 * Every detail screen is a 176px photo, a body of sections and an actions bar pinned to the
 * bottom. In Figma the body is clipped at the actions bar; here it scrolls under it instead,
 * so nothing below the fold is lost.
 */

export function DetailScreen({ children, actions }: { children: ReactNode; actions: ReactNode }) {
  return (
    <main className="relative flex min-h-[100dvh] w-full flex-col bg-atlas-paper">
      <div className="flex-1">{children}</div>
      <div className="sticky bottom-0 z-10">{actions}</div>
    </main>
  );
}

export function DetailHero({
  photo,
  back = "Main",
  counter,
}: {
  photo: { src: string; width: number; height: number };
  back?: ScreenKey;
  counter?: string;
}) {
  return (
    <div className="relative h-[176px] w-full overflow-hidden bg-atlas-beige">
      <AtlasAsset src={photo.src} width={photo.width} height={photo.height} className="absolute inset-0 size-full object-cover" />
      <AtlasBackButton to={back} className="absolute left-[12px] top-[12px]" />
      {counter ? (
        <p className="absolute bottom-[10px] right-[12px] flex items-center justify-center rounded-[10px] bg-atlas-paper px-[9px] py-[3px] font-manrope text-[12px] leading-[16px] text-atlas-ink">
          {counter}
        </p>
      ) : null}
    </div>
  );
}

/** Partners use a 14 / 20 body padding and a 4px title gap; hotel places and attractions 20 / 24 and 6. */
export function DetailBody({ variant, children }: { variant: "partner" | "place"; children: ReactNode }) {
  return (
    <div
      className={`flex w-full flex-col items-start gap-[14px] px-[16px] ${variant === "partner" ? "pb-[20px] pt-[14px]" : "pb-[24px] pt-[20px]"}`}
    >
      {children}
    </div>
  );
}

export function DetailTitle({
  eyebrow,
  name,
  gap,
  children,
}: {
  eyebrow: string;
  name: string;
  gap: 4 | 6;
  children?: ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-start" style={{ gap }}>
      <p className="font-grotesk text-[11px] font-medium uppercase leading-[14px] tracking-[0.88px] text-atlas-slate">{eyebrow}</p>
      <h1 className="w-full font-grotesk text-[24px] font-bold leading-[28px] text-atlas-teal">{name}</h1>
      {children}
    </div>
  );
}

/** "Approved by Hotel A" plus the plan chip on partner places. */
export function ApprovalRow({ chip }: { chip: ReactNode }) {
  return (
    <div className="flex w-full flex-wrap items-center gap-[8px]">
      <span className="flex items-center gap-[4px]">
        <AtlasIcon src="/atlas-ui/icon-check-slate-14.svg" size={14} />
        <span className="font-manrope text-[13px] leading-[18px] text-atlas-slate">Approved by Hotel A</span>
      </span>
      {chip}
    </div>
  );
}

export function PlanChip({ tone, to, children }: { tone: "teal" | "sand"; to?: ScreenKey; children: string }) {
  const className = `flex items-center rounded-[12px] px-[10px] py-[3px] font-manrope text-[12px] font-semibold leading-[16px] ${
    tone === "teal" ? "bg-atlas-teal text-atlas-paper" : "bg-atlas-sand text-atlas-teal"
  }`;
  if (!to) return <span className={`${className} !text-atlas-ink`}>{children}</span>;
  return (
    <AtlasLink to={to} className={className}>
      {children}
    </AtlasLink>
  );
}

/** "Part of Hotel A" / "Recommended by Hotel A" under facility and attraction titles. */
export function SourceRow({ icon, children }: { icon: string; children: string }) {
  return (
    <div className="flex items-center gap-[6px]">
      <AtlasIcon src={icon} size={16} />
      <span className="font-manrope text-[14px] leading-[19px] text-atlas-slate">{children}</span>
    </div>
  );
}

type Fact = { label: string; value: string; note?: string };

/** Partner facts: one bordered strip split by dividers. */
export function FactStrip({ facts }: { facts: Fact[] }) {
  return (
    <dl className="flex w-full items-start rounded-[12px] border border-atlas-beige">
      {facts.map((fact, index) => (
        <div key={fact.label} className="flex min-w-0 flex-1 items-start">
          {index > 0 ? <span aria-hidden className="h-[46px] w-px shrink-0 bg-atlas-beige" /> : null}
          <div className="flex min-w-0 flex-1 flex-col items-start gap-px whitespace-nowrap px-[10px] py-[8px]">
            <dt className="font-manrope text-[12px] leading-[16px] text-atlas-slate">{fact.label}</dt>
            <dd className="font-manrope text-[15px] font-semibold leading-[20px] text-atlas-ink">{fact.value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

/** Facility and attraction facts: separate 114px cards. */
export function FactCards({ facts }: { facts: Fact[] }) {
  return (
    <dl className="flex w-full items-start gap-[8px] whitespace-nowrap">
      {facts.map((fact) => (
        <div key={fact.label} className="flex w-[114px] shrink-0 flex-col items-start gap-px rounded-[12px] border border-atlas-beige p-[10px]">
          <dt className="font-manrope text-[12px] leading-[16px] text-atlas-slate">{fact.label}</dt>
          <dd className="font-manrope text-[15px] font-semibold leading-[20px] text-atlas-ink">{fact.value}</dd>
          {fact.note ? <dd className="font-manrope text-[12px] leading-[16px] text-atlas-slate">{fact.note}</dd> : null}
        </div>
      ))}
    </dl>
  );
}

/**
 * "Why this" note. Partner Place 2 sets only the label in semibold; Partner Places 1 and 4 set
 * the whole sentence in semibold — kept as the design has it.
 */
export function WhyThis({ reason, allBold = false }: { reason: string; allBold?: boolean }) {
  return (
    <div className="flex w-full items-start gap-[8px] rounded-[12px] bg-atlas-sand px-[12px] py-[10px]">
      <AtlasIcon src="/atlas-ui/icon-star.svg" size={16} className="shrink-0" />
      <p className={`min-w-0 flex-1 font-manrope text-[14px] leading-[1.45] text-atlas-ink ${allBold ? "font-semibold" : ""}`}>
        <span className="font-semibold">Why this:</span> {reason}
      </p>
    </div>
  );
}

export const PARTNER_ABOUT =
  "[What the guest will do and where it happens, from the partner's verified description. A few sentences that set expectations: what you'll see, how long people usually stay, and anything worth knowing before you go.]";

export function PartnerAbout() {
  return <ReadMore text={PARTNER_ABOUT} />;
}

/** Static About block on facility and attraction screens. */
export function AboutBlock({ text }: { text: string }) {
  return (
    <section className="flex w-full flex-col items-start gap-[6px]">
      <h2 className="font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal">About</h2>
      <p className="w-full font-manrope text-[15px] leading-[23px] text-atlas-ink">{text}</p>
    </section>
  );
}

export function InfoRows({ rows }: { rows: { icon: string; label: string; value: string }[] }) {
  return (
    <div className="flex w-full flex-col items-start">
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={`flex h-[48px] w-full items-center gap-[10px] py-[6px] ${index < rows.length - 1 ? "border-b border-atlas-beige" : ""}`}
        >
          <AtlasIcon src={row.icon} size={18} className="shrink-0" />
          <div className="flex min-w-0 flex-1 flex-col items-start gap-px whitespace-nowrap">
            <p className="font-manrope text-[14px] font-semibold leading-[19px] text-atlas-ink">{row.label}</p>
            <p className="font-manrope text-[13px] leading-[18px] text-atlas-slate">{row.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Achievement card on partner screens: 40px badge, title and line, an action, an optional link. */
export function PartnerAchievement({
  title,
  line,
  action,
  footer,
}: {
  title: string;
  line: string;
  action: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className={`flex w-full flex-col items-start rounded-[14px] border border-atlas-teal p-[12px] ${footer ? "gap-[8px]" : ""}`}>
      <div className="flex w-full items-center gap-[10px]">
        <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px] bg-atlas-teal">
          <AtlasIcon src="/atlas-ui/icon-ach-light-18.svg" size={18} />
        </span>
        <span className="flex min-w-0 flex-1 flex-col items-start gap-px">
          <span className="whitespace-nowrap font-grotesk text-[15px] font-bold leading-[19px] text-atlas-teal">{title}</span>
          <span className="w-full font-manrope text-[13px] leading-[18px] text-atlas-slate">{line}</span>
        </span>
        {action}
      </div>
      {footer}
    </section>
  );
}

const SMALL_ACTION = "flex h-[44px] shrink-0 items-center gap-[6px] rounded-[12px] px-[12px] font-manrope text-[13px] font-semibold leading-[18px]";

export function ScanAction({ enabled }: { enabled: boolean }) {
  if (!enabled) {
    return (
      <span aria-disabled="true" className={`${SMALL_ACTION} bg-atlas-mist text-atlas-ink`}>
        <AtlasIcon src="/atlas-ui/icon-qr-ink-16.svg" size={16} />
        Scan
      </span>
    );
  }
  return (
    <AtlasLink to="PermCamera" className={`${SMALL_ACTION} bg-atlas-teal text-atlas-paper`}>
      <AtlasIcon src="/atlas-ui/icon-qr-light-16.svg" size={16} />
      Scan
    </AtlasLink>
  );
}

export function ViewAction({ to }: { to: ScreenKey }) {
  return (
    <AtlasLink to={to} className={`${SMALL_ACTION} border border-atlas-teal text-atlas-teal`}>
      View
    </AtlasLink>
  );
}

/** Bottom actions bar: a square secondary action beside the primary button. */
export function DetailActions({
  secondary,
  primary,
  tall = false,
}: {
  secondary: { to: ScreenKey; icon: string; iconSize: number; label: string };
  primary: { to: ScreenKey; label: string; icon?: string };
  /** Facility and attraction bars are 88 tall with a 56 x 60 secondary; partner bars 80 with 52 x 52. */
  tall?: boolean;
}) {
  return (
    <div className={`flex w-full items-start gap-[10px] border-t border-atlas-beige bg-atlas-paper px-[16px] pb-[18px] pt-[10px] ${tall ? "h-[88px]" : "h-[80px]"}`}>
      <AtlasLink
        to={secondary.to}
        label={secondary.label}
        className={`flex shrink-0 items-center justify-center rounded-[14px] border border-atlas-teal ${tall ? "h-[60px] w-[56px]" : "size-[52px]"}`}
      >
        <AtlasIcon src={secondary.icon} size={secondary.iconSize} />
      </AtlasLink>
      <AtlasButton to={primary.to} icon={primary.icon} className="min-w-0 flex-1">
        {primary.label}
      </AtlasButton>
    </div>
  );
}
