/*
 * Every frame in the Atlas Figma file (3N0YrlADgeuFyp8I8oh5of) and the route it is built at.
 *
 * Screens are keyed by the Figma frame's short name — the part before " · " — because the
 * design's prototype links use exactly those names in their layer names, for example
 * "Back ⇒ SignIn" or "Fix ⇒ Repair". That lets every link in the design resolve one to one.
 *
 * A screen whose `built` is false is never linked to: callers get null and render an inert
 * element instead of a dead link.
 */

export type ScreenKey =
  | "Index"
  | "StatesKit"
  | "BottomBarKit"
  | "Welcome"
  | "SignIn"
  | "ForgotPassword"
  | "ForgotSent"
  | "QRInvalid"
  | "NoStay"
  | "PermLocation"
  | "PermCamera"
  | "Main"
  | "ToastLocation"
  | "ToastHotel"
  | "List"
  | "Detail"
  | "DetailP1"
  | "DetailP4"
  | "FacilityDetail"
  | "FacilityPool"
  | "AttractionDetail"
  | "NoMatch"
  | "Preferences"
  | "PlanBuild"
  | "PlanBuildDone"
  | "MyPlan"
  | "MyPlanEmpty"
  | "MyPlanReplaced"
  | "MyPlanRemoved"
  | "MyPlanAddedSpa"
  | "MyPlanAddedPool"
  | "MyPlanAddedA1"
  | "MyPlanAddedP4"
  | "Repair"
  | "RepairConfirm"
  | "Route"
  | "RouteP1"
  | "RouteP4"
  | "RouteA1"
  | "Scan"
  | "ScanProblem"
  | "ScanProblemWrong"
  | "ScanProblemDone"
  | "ScanProblemToday"
  | "ScanProblemGone"
  | "ScanProblemCamera"
  | "CheckedIn"
  | "ARUnlock"
  | "Unlocked"
  | "UnlockedA1"
  | "UnlockedP1"
  | "NextPath"
  | "MapNextPath"
  | "Stay"
  | "Achievements"
  | "AchievementDetail"
  | "AchievementDetailP1"
  | "Permissions"
  | "Privacy"
  | "PrivacyPublic"
  | "PrivacyDelete"
  | "NavLiquid";

export type AtlasScreen = {
  key: ScreenKey;
  /** Frame name as it reads in Figma. */
  figmaName: string;
  figmaNodeId: string;
  href: string;
  built: boolean;
};

export const ATLAS_SCREENS: readonly AtlasScreen[] = [
  { key: "Main", figmaName: "Main · Missions › Map (home)", figmaNodeId: "1:205", href: "/", built: true },
  { key: "Index", figmaName: "Index · Start here: prototype guide", figmaNodeId: "1:1639", href: "/guide", built: true },
  { key: "StatesKit", figmaName: "StatesKit · Shared states", figmaNodeId: "1:1491", href: "/states", built: true },
  { key: "BottomBarKit", figmaName: "Bottom bar", figmaNodeId: "7:795", href: "/kit/bottom-bar", built: true },
  { key: "NavLiquid", figmaName: "NavLiquid · Bottom bar motion", figmaNodeId: "1:1463", href: "/kit/bottom-bar-motion", built: true },

  { key: "Welcome", figmaName: "Welcome · Welcome (after hotel QR)", figmaNodeId: "1:690", href: "/welcome", built: true },
  { key: "SignIn", figmaName: "SignIn · Sign in / create account", figmaNodeId: "1:722", href: "/sign-in", built: true },
  { key: "ForgotPassword", figmaName: "ForgotPassword · Reset password", figmaNodeId: "1:1271", href: "/forgot-password", built: true },
  { key: "ForgotSent", figmaName: "ForgotSent · Reset link sent", figmaNodeId: "1:1286", href: "/forgot-password/sent", built: true },
  { key: "QRInvalid", figmaName: "QRInvalid · Hotel code not recognised", figmaNodeId: "1:1254", href: "/qr-invalid", built: true },
  { key: "NoStay", figmaName: "NoStay · No active stay", figmaNodeId: "1:1225", href: "/no-stay", built: true },
  { key: "PermLocation", figmaName: "PermLocation · Location permission", figmaNodeId: "1:810", href: "/permissions/location", built: true },
  { key: "PermCamera", figmaName: "PermCamera · Camera permission", figmaNodeId: "1:841", href: "/permissions/camera", built: true },

  { key: "ToastLocation", figmaName: "Toast · Centred on your location", figmaNodeId: "1:5054", href: "/map/centred-on-you", built: true },
  { key: "ToastHotel", figmaName: "Toast · Centred on Hotel A", figmaNodeId: "1:5059", href: "/map/centred-on-hotel", built: true },
  { key: "MapNextPath", figmaName: "MapNextPath · Choose in the map sheet", figmaNodeId: "1:5494", href: "/map/next-stop", built: true },
  { key: "List", figmaName: "List · Missions › List", figmaNodeId: "1:252", href: "/list", built: true },
  { key: "NoMatch", figmaName: "NoMatch · Missions › No partner fits", figmaNodeId: "1:352", href: "/no-match", built: true },

  { key: "Detail", figmaName: "Detail · Place details (Partner Place 2)", figmaNodeId: "1:280", href: "/place/partner-2", built: true },
  { key: "DetailP1", figmaName: "DetailP1 · Partner Place 1 (visited today)", figmaNodeId: "1:1799", href: "/place/partner-1", built: true },
  { key: "DetailP4", figmaName: "DetailP4 · Partner Place 4 (not in plan)", figmaNodeId: "1:1867", href: "/place/partner-4", built: true },
  { key: "FacilityDetail", figmaName: "FacilityDetail · Hotel facility (Spa)", figmaNodeId: "1:872", href: "/place/spa", built: true },
  { key: "FacilityPool", figmaName: "FacilityPool · Pool (hotel facility)", figmaNodeId: "1:1933", href: "/place/pool", built: true },
  { key: "AttractionDetail", figmaName: "AttractionDetail · Attraction details", figmaNodeId: "1:925", href: "/place/attraction-1", built: true },

  { key: "Preferences", figmaName: "Preferences · Plan my time", figmaNodeId: "1:590", href: "/preferences", built: true },
  { key: "PlanBuild", figmaName: "PlanBuild · Building a plan (loading)", figmaNodeId: "1:1144", href: "/plan/building", built: true },
  { key: "PlanBuildDone", figmaName: "PlanBuildDone · Plan ready", figmaNodeId: "1:1156", href: "/plan/ready", built: true },
  { key: "MyPlan", figmaName: "MyPlan · Missions › My plan", figmaNodeId: "1:489", href: "/plan", built: true },
  { key: "MyPlanEmpty", figmaName: "MyPlanEmpty · Missions › My plan (empty)", figmaNodeId: "1:1195", href: "/plan/empty", built: true },
  { key: "MyPlanReplaced", figmaName: "MyPlanReplaced · My plan after replacing stop 3", figmaNodeId: "1:2180", href: "/plan/replaced", built: true },
  { key: "MyPlanRemoved", figmaName: "MyPlanRemoved · My plan after removing stop 3", figmaNodeId: "1:2285", href: "/plan/removed", built: true },
  { key: "MyPlanAddedSpa", figmaName: "MyPlanAddedSpa · My plan with the spa added", figmaNodeId: "1:2378", href: "/plan/added-spa", built: true },
  { key: "MyPlanAddedPool", figmaName: "MyPlanAddedPool · My plan with the pool added", figmaNodeId: "1:2499", href: "/plan/added-pool", built: true },
  { key: "MyPlanAddedA1", figmaName: "MyPlanAddedA1 · My plan with Attraction 1 added", figmaNodeId: "1:2620", href: "/plan/added-attraction-1", built: true },
  { key: "MyPlanAddedP4", figmaName: "MyPlanAddedP4 · My plan with Partner Place 4 added", figmaNodeId: "1:2741", href: "/plan/added-partner-4", built: true },
  { key: "Repair", figmaName: "Repair · Fix an unavailable stop", figmaNodeId: "1:778", href: "/plan/repair", built: true },
  { key: "RepairConfirm", figmaName: "RepairConfirm · Remove stop confirmation", figmaNodeId: "1:1423", href: "/plan/repair/confirm", built: true },
  { key: "Route", figmaName: "Route · Walking route", figmaNodeId: "1:731", href: "/route", built: true },
  { key: "RouteP1", figmaName: "RouteP1 · Route to Partner Place 1", figmaNodeId: "1:2041", href: "/route/partner-1", built: true },
  { key: "RouteP4", figmaName: "RouteP4 · Route to Partner Place 4", figmaNodeId: "1:2088", href: "/route/partner-4", built: true },
  { key: "RouteA1", figmaName: "RouteA1 · Route to Attraction 1", figmaNodeId: "1:2133", href: "/route/attraction-1", built: true },

  { key: "Scan", figmaName: "Scan · Scan (centre tab)", figmaNodeId: "1:410", href: "/scan", built: true },
  { key: "ScanProblem", figmaName: "ScanProblem · Not close enough", figmaNodeId: "1:1042", href: "/scan/not-close-enough", built: true },
  { key: "ScanProblemWrong", figmaName: "ScanProblemWrong · Wrong code", figmaNodeId: "1:1059", href: "/scan/wrong-code", built: true },
  { key: "ScanProblemDone", figmaName: "ScanProblemDone · Already checked in", figmaNodeId: "1:1076", href: "/scan/already-checked-in", built: true },
  { key: "ScanProblemToday", figmaName: "ScanProblemToday · Not in today’s plan", figmaNodeId: "1:1093", href: "/scan/not-in-plan", built: true },
  { key: "ScanProblemGone", figmaName: "ScanProblemGone · Place unavailable", figmaNodeId: "1:1110", href: "/scan/place-unavailable", built: true },
  { key: "ScanProblemCamera", figmaName: "ScanProblemCamera · Camera off", figmaNodeId: "1:1127", href: "/scan/camera-off", built: true },
  { key: "CheckedIn", figmaName: "CheckedIn · Checked in (no achievement)", figmaNodeId: "1:1024", href: "/checked-in", built: true },
  { key: "ARUnlock", figmaName: "ARUnlock · AR unlock (attraction)", figmaNodeId: "1:436", href: "/ar-unlock", built: true },
  { key: "Unlocked", figmaName: "Unlocked · Achievement unlocked", figmaNodeId: "1:466", href: "/unlocked", built: true },
  { key: "UnlockedA1", figmaName: "UnlockedA1 · Unlocked at Attraction 1", figmaNodeId: "1:2018", href: "/unlocked/attraction-1", built: true },
  { key: "UnlockedP1", figmaName: "UnlockedP1 · Unlocked at Partner Place 1", figmaNodeId: "1:5064", href: "/unlocked/partner-1", built: true },
  { key: "NextPath", figmaName: "NextPath · Choose your next stop", figmaNodeId: "1:5087", href: "/next-stop", built: true },

  { key: "Stay", figmaName: "Stay · Profile", figmaNodeId: "1:1542", href: "/profile", built: true },
  { key: "Achievements", figmaName: "Achievements · Profile › Achievements", figmaNodeId: "1:624", href: "/achievements", built: true },
  { key: "AchievementDetail", figmaName: "AchievementDetail · Achievement details", figmaNodeId: "1:989", href: "/achievements/achievement-2", built: true },
  { key: "AchievementDetailP1", figmaName: "AchievementDetailP1 · Achievement 1 details", figmaNodeId: "1:1983", href: "/achievements/achievement-1", built: true },
  { key: "Permissions", figmaName: "Permissions · Profile › Permissions", figmaNodeId: "1:2862", href: "/profile/permissions", built: true },
  { key: "Privacy", figmaName: "Privacy · Help and privacy", figmaNodeId: "1:1303", href: "/privacy", built: true },
  { key: "PrivacyPublic", figmaName: "PrivacyPublic · Terms and privacy (signed out)", figmaNodeId: "1:2888", href: "/terms", built: true },
  { key: "PrivacyDelete", figmaName: "PrivacyDelete · Delete account confirmation", figmaNodeId: "1:1357", href: "/privacy/delete-account", built: true },
];

const BY_KEY = new Map(ATLAS_SCREENS.map((screen) => [screen.key, screen] as const));

export function atlasScreen(key: ScreenKey): AtlasScreen {
  const screen = BY_KEY.get(key);
  if (!screen) throw new Error(`Unknown Atlas screen: ${key}`);
  return screen;
}

/** The route once the screen exists, otherwise null, so callers never render a dead link. */
export function screenHref(key: ScreenKey): string | null {
  const screen = atlasScreen(key);
  return screen.built ? screen.href : null;
}
