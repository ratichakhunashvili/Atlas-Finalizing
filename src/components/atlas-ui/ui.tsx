import Link from "next/link";
import type { ReactNode } from "react";
import { AtlasIcon } from "./asset";
import { screenHref, type ScreenKey } from "./screens";

/*
 * Primitives shared by every screen: links that follow the design's prototype connections,
 * buttons, the back button, form fields, badges and type styles.
 *
 * Line heights are the Figma text-node heights. Figma's "normal" line height for Manrope is
 * 1.366 of the font size and for Space Grotesk 1.276, so 14px Manrope sits in a 19px line and
 * 16px Space Grotesk in a 20px one. Setting them explicitly keeps long screens from drifting.
 */

export const type = {
  eyebrow: "font-grotesk text-[11px] font-medium uppercase leading-[14px] tracking-[0.88px] text-atlas-slate",
  title: "font-grotesk text-[24px] font-bold leading-[28px] text-atlas-teal",
  body: "font-manrope text-[15px] leading-[23px]",
  point: "font-manrope text-[15px] leading-[23px] text-atlas-ink",
  label: "font-manrope text-[14px] font-semibold leading-[19px] text-atlas-ink",
  caption: "font-manrope text-[12px] leading-[16px] text-atlas-slate",
  heading16: "font-grotesk text-[16px] font-bold leading-[20px] text-atlas-teal",
} as const;

/**
 * A link to another screen in the design. Renders an inert element while the target screen
 * does not exist yet, so nothing ever points at a missing route.
 */
export function AtlasLink({
  to,
  className,
  children,
  label,
}: {
  to: ScreenKey;
  className?: string;
  children: ReactNode;
  /** Accessible name, for links whose content is only an icon. */
  label?: string;
}) {
  const href = screenHref(to);
  if (!href) {
    return (
      <span className={className} aria-label={label} aria-disabled="true">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} className={className} aria-label={label}>
      {children}
    </Link>
  );
}

const BUTTON = "flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[14px] font-manrope text-[16px] font-semibold leading-[22px]";

export type ButtonTone = "primary" | "outline" | "light";

const TONES: Record<ButtonTone, string> = {
  primary: "bg-atlas-teal text-atlas-paper",
  outline: "border border-atlas-teal text-atlas-teal",
  light: "bg-atlas-paper text-atlas-teal",
};

/** Full-width 52px action. Navigates to `to` when given, otherwise renders a button. */
export function AtlasButton({
  to,
  tone = "primary",
  icon,
  iconSize = 19,
  children,
  className = "",
  type: buttonType = "button",
}: {
  to?: ScreenKey;
  tone?: ButtonTone;
  icon?: string;
  iconSize?: number;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  const classes = `${BUTTON} ${TONES[tone]} ${className}`;
  const content = (
    <>
      {icon ? <AtlasIcon src={icon} size={iconSize} className="shrink-0" /> : null}
      <span>{children}</span>
    </>
  );
  if (to) {
    return (
      <AtlasLink to={to} className={classes}>
        {content}
      </AtlasLink>
    );
  }
  return (
    <button type={buttonType} className={classes}>
      {content}
    </button>
  );
}

/** Centred 44px text action under a primary button ("Not now", "Use a different email"). */
export function AtlasTextLink({
  to,
  children,
  className = "",
}: {
  to?: ScreenKey;
  children: ReactNode;
  className?: string;
}) {
  const classes = `flex h-[44px] w-full items-center justify-center font-manrope text-[15px] font-semibold leading-[20px] text-atlas-teal ${className}`;
  if (to) {
    return (
      <AtlasLink to={to} className={classes}>
        {children}
      </AtlasLink>
    );
  }
  return (
    <button type="button" className={classes}>
      {children}
    </button>
  );
}

/** 44px square back button with a beige outline (icon/back). */
export function AtlasBackButton({ to, className = "" }: { to: ScreenKey; className?: string }) {
  return (
    <AtlasLink
      to={to}
      label="Back"
      className={`flex size-[44px] shrink-0 items-center justify-center rounded-[12px] border border-atlas-beige bg-atlas-paper ${className}`}
    >
      <AtlasIcon src="/atlas-ui/icon-back.svg" size={20} />
    </AtlasLink>
  );
}

/** Round icon badge at the top of message screens. */
export function AtlasBadge({
  icon,
  iconSize,
  size = 64,
  tone = "teal",
}: {
  icon: string;
  iconSize: number;
  size?: 64 | 72;
  tone?: "teal" | "sand";
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full ${tone === "teal" ? "bg-atlas-teal" : "bg-atlas-sand"}`}
      style={{ width: size, height: size }}
    >
      <AtlasIcon src={icon} size={iconSize} />
    </div>
  );
}

/** Labelled text field (Field · Email, Field · Password...). */
export function AtlasField({
  id,
  label,
  type: inputType = "text",
  placeholder,
  hint,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="flex w-full flex-col items-start gap-[6px]">
      <label htmlFor={id} className={type.label}>
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={inputType}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-describedby={hintId}
        className="h-[52px] w-full rounded-[12px] border border-atlas-umber bg-white px-[14px] font-manrope text-[16px] leading-[22px] text-atlas-ink placeholder:text-atlas-slate/70 focus:border-atlas-teal focus:outline-2 focus:outline-offset-0 focus:outline-atlas-teal"
      />
      {hint ? (
        <p id={hintId} className="font-manrope text-[13px] leading-[18px] text-atlas-slate">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Icon-led bullet points ("Only while Atlas is open.", "Ask the front desk..."). */
export function AtlasPoints({ items, gap = 12 }: { items: { icon: string; text: string }[]; gap?: number }) {
  return (
    <ul className="flex w-full flex-col items-start" style={{ gap }}>
      {items.map((item) => (
        <li key={item.text} className="flex w-full items-start gap-[12px]">
          <AtlasIcon src={item.icon} size={20} className="shrink-0" />
          <p className={`min-w-0 flex-1 ${type.point}`}>{item.text}</p>
        </li>
      ))}
    </ul>
  );
}

/**
 * Full-height flow screen (sign in, permissions, messages): 20px gutters, 16px top, 28px
 * bottom, with a spacer that pushes the actions to the bottom edge.
 */
export function FlowScreen({
  children,
  gap = 16,
  className = "",
}: {
  children: ReactNode;
  gap?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative flex min-h-[100dvh] w-full flex-col items-start bg-atlas-paper px-[20px] pb-[28px] pt-[16px] ${className}`}
      style={{ gap }}
    >
      {children}
    </div>
  );
}

/** Flexible gap that pushes what follows to the bottom of a FlowScreen. */
export function Spacer() {
  return <div aria-hidden className="min-h-px flex-1" />;
}
