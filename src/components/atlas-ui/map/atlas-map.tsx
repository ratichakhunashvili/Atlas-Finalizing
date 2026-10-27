"use client";

import { useEffect, useRef, useState } from "react";
import type { GeoJSONSource, Map as MapboxMap } from "mapbox-gl/esm";
import "mapbox-gl/dist/mapbox-gl.css";
import { HOTEL_LNGLAT, MAP_CENTER, DESIGN_ZOOM, PLACE_LNGLAT, YOU_LNGLAT, type LngLat } from "./geo";
import { markerImageId, rasterizeMarkers, registerMarkers } from "./markers";
import { addBuildingExtrusions, applyAtlasPalette, MAP_STYLE_URL } from "./style";
import { useSceneContext, type MapScene } from "./scene";
import { sidePanelWidth, useReducedMotion, useWideLayout } from "../use-layout";
import routes from "./routes.json";

/*
 * The one Mapbox map instance behind every map screen. It is created once, when the first map
 * screen mounts, and stays alive while the guest moves between map screens; screens change what
 * it shows through the scene context. Places are a single GeoJSON source drawn by one symbol
 * layer with the marker images registered in markers.ts.
 */

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
const TILT = 45;

// Walking routes from Hotel A, fetched once from Mapbox Directions and kept as a fixture.
const ROUTE_LINES = routes as unknown as Record<string, LngLat[]>;

type Feature = GeoJSON.Feature<GeoJSON.Point, { marker: string; placeId?: string }>;

function point(coordinates: LngLat, marker: string, placeId?: string): Feature {
  return { type: "Feature", geometry: { type: "Point", coordinates }, properties: { marker: markerImageId(marker), placeId } };
}

/** A point a quarter of the way along the route, where the design puts the walker. */
function alongRoute(line: LngLat[]): LngLat {
  return line[Math.max(1, Math.floor(line.length / 4))] ?? line[0];
}

function markerFeatures(scene: MapScene): GeoJSON.FeatureCollection {
  const features: Feature[] = [];
  const line = scene.route ? ROUTE_LINES[scene.route] : undefined;

  if (scene.route && line) {
    // Route screens: start, destination and walker, as the route map art draws them.
    features.push(point(line[0], "route-start"));
    const destination = scene.places[0];
    features.push(point(line[line.length - 1], destination?.marker ?? "route-destination", destination?.id));
    features.push(point(alongRoute(line), "route-you"));
    return { type: "FeatureCollection", features };
  }

  // Draw order follows the design: places, then the hotel, then the guest on top.
  const ordered = [...scene.places].sort((a, b) => Number(a.marker.endsWith("selected")) - Number(b.marker.endsWith("selected")));
  for (const place of ordered) features.push(point(PLACE_LNGLAT[place.id], place.marker, place.id));
  if (scene.hotel) features.push(point(HOTEL_LNGLAT, "hotel"));
  if (scene.you) features.push(point(YOU_LNGLAT, "you"));
  return { type: "FeatureCollection", features };
}

function routeFeature(scene: MapScene): GeoJSON.FeatureCollection {
  const line = scene.route ? ROUTE_LINES[scene.route] : undefined;
  if (!line) return { type: "FeatureCollection", features: [] };
  return {
    type: "FeatureCollection",
    features: [{ type: "Feature", geometry: { type: "LineString", coordinates: line }, properties: {} }],
  };
}

export function AtlasMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const framedRouteRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState<string | null>(TOKEN ? null : "missing-token");
  const { scene, placeClickRef, camera, dimension } = useSceneContext();
  const wide = useWideLayout();
  const reducedMotion = useReducedMotion();

  // Create the map once.
  useEffect(() => {
    if (!TOKEN || !containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const [mapboxgl, bitmaps] = await Promise.all([import("mapbox-gl/esm"), rasterizeMarkers()]);
      if (cancelled || !containerRef.current) return;
      mapboxgl.setAccessToken(TOKEN);

      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: MAP_STYLE_URL,
        center: MAP_CENTER,
        zoom: DESIGN_ZOOM,
        pitch: 0,
        attributionControl: false,
        logoPosition: "bottom-left",
        dragRotate: false,
        pitchWithRotate: false,
      });
      map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");
      map.touchZoomRotate.disableRotation();
      mapRef.current = map;
      // Development only: lets browser tooling inspect the map.
      if (process.env.NODE_ENV !== "production") (window as unknown as { __atlasMap?: MapboxMap }).__atlasMap = map;

      map.on("error", (event) => {
        if (String(event.error?.message ?? "").includes("401")) setFailed("unauthorized");
      });

      map.on("style.load", () => {
        applyAtlasPalette(map);
        addBuildingExtrusions(map);
      });

      // Atlas sources, layers and marker images go in after the first `load`. Adding images any
      // earlier, while the first tiles are still being parsed, leaves those tiles stuck loading
      // (mapbox-gl 3.33), which shows as a blank map.
      map.once("load", () => {
        registerMarkers(map, bitmaps);

        if (!map.getSource("atlas-route")) {
          map.addSource("atlas-route", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "atlas-route-line",
            type: "line",
            source: "atlas-route",
            layout: { "line-cap": "round", "line-join": "round" },
            paint: { "line-color": "#0a4a4f", "line-width": 5 },
          });
        }
        if (!map.getSource("atlas-places")) {
          map.addSource("atlas-places", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
          map.addLayer({
            id: "atlas-markers",
            type: "symbol",
            source: "atlas-places",
            layout: {
              "icon-image": ["get", "marker"],
              "icon-allow-overlap": true,
              "icon-ignore-placement": true,
              "symbol-z-order": "source",
            },
          });
        }
        if (!cancelled) setReady(true);
      });

      map.on("click", "atlas-markers", (event) => {
        const placeId = event.features?.[0]?.properties?.placeId as string | undefined;
        if (placeId && placeClickRef.current) placeClickRef.current(placeId as never);
      });
      map.on("mouseenter", "atlas-markers", (event) => {
        if (event.features?.[0]?.properties?.placeId) map.getCanvas().style.cursor = "pointer";
      });
      map.on("mouseleave", "atlas-markers", () => {
        map.getCanvas().style.cursor = "";
      });
    })().catch(() => setFailed("load"));

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [placeClickRef]);

  // Apply the scene.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !scene) return;
    (map.getSource("atlas-places") as GeoJSONSource | undefined)?.setData(markerFeatures(scene));
    (map.getSource("atlas-route") as GeoJSONSource | undefined)?.setData(routeFeature(scene));
    // Beside a side panel (wide layout) the camera centre and Mapbox's logo move right of the
    // panel; under a phone sheet the attribution sits above the sheet.
    const panelEdge = wide && scene.panel ? sidePanelWidth() + 32 : 0;
    map.setPadding({ left: panelEdge, top: 0, right: 0, bottom: 0 });
    containerRef.current?.style.setProperty(
      "--atlas-map-inset",
      wide ? "0px" : `calc(${scene.bottomInset}px + env(safe-area-inset-bottom))`
    );
    containerRef.current?.style.setProperty("--atlas-map-left-inset", `${panelEdge}px`);

    const line = scene.route ? ROUTE_LINES[scene.route] : undefined;
    if (!line && framedRouteRef.current) {
      // Leaving a route screen: return to the design view.
      map.jumpTo({ center: MAP_CENTER, zoom: DESIGN_ZOOM });
    }
    framedRouteRef.current = Boolean(line);
    if (line) {
      const lngs = line.map((c) => c[0]);
      const lats = line.map((c) => c[1]);
      map.fitBounds(
        [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ],
        {
          padding: wide
            ? { top: 48, bottom: 48, left: panelEdge + 48, right: 72 }
            : { top: 140, bottom: scene.bottomInset + 48, left: 48, right: 72 },
          pitch: 0,
          duration: 0,
          maxZoom: 16.5,
        }
      );
    }
  }, [scene, ready, wide]);

  // 2D / 3D.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || !scene) return;
    const tilted = scene.allowTilt && dimension === "3D";
    map.easeTo({ pitch: tilted ? TILT : 0, duration: reducedMotion ? 0 : 600 });
    if (map.getLayer("atlas-buildings-3d")) map.setLayoutProperty("atlas-buildings-3d", "visibility", tilted ? "visible" : "none");
  }, [dimension, ready, scene, reducedMotion]);

  // Camera requests from the map controls.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !ready || camera.seq === 0) return;
    const center = camera.target === "you" ? YOU_LNGLAT : camera.target === "hotel" ? HOTEL_LNGLAT : MAP_CENTER;
    const options = { center, zoom: camera.target === "design" ? DESIGN_ZOOM : 15.2 };
    if (reducedMotion) map.jumpTo(options);
    else map.flyTo({ ...options, duration: 800 });
  }, [camera, ready, reducedMotion]);

  return (
    <div className="atlas-map absolute inset-0 bg-atlas-dune">
      {/* mapbox-gl.css makes the container position: relative, so size it explicitly. */}
      <div ref={containerRef} className="h-full w-full" />
      {!ready && !failed ? (
        <p role="status" className="absolute left-1/2 top-[38%] w-[240px] -translate-x-1/2 text-center font-manrope text-[13px] leading-[18px] text-atlas-slate">
          Loading the map…
        </p>
      ) : null}
      {failed ? (
        <p role="alert" className="absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 text-center font-manrope text-[13px] leading-[18px] text-atlas-slate">
          {failed === "missing-token"
            ? "The map needs a Mapbox token. Configure NEXT_PUBLIC_MAPBOX_TOKEN in your environment."
            : "The map could not load. Check the Mapbox token and your connection."}
        </p>
      ) : null}
    </div>
  );
}
