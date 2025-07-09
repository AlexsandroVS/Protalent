"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas, extend } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/data/globe.json";

declare module "@react-three/fiber" {
  interface ThreeElements {
    threeGlobe: ThreeElements["mesh"] & {
      new (): ThreeGlobe;
    };
  }
}
 
extend({ ThreeGlobe: ThreeGlobe });
 
const RING_PROPAGATION_SPEED = 3;
const aspect = 1.2;
const cameraZ = 300;
 
type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};
 
// Configuración mejorada de colores y efectos
const JAPANESE_PALETTE = {
  DEEP_NAVY: "#1a1a2e",
  SAKURA_PINK: "#ff6b6b",
  GOLD_ACCENT: "#ffd93d",
  PURPLE_ACCENT: "#9c27b0"
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: {
    lat: number;
    lng: number;
  };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  arcStroke?: number;
  arcDashLength?: number;
  arcDashGap?: number;
  ringsColor?: string;
  ringMaxRadius?: number;
  ringPropagationSpeed?: number;
  ringRepeatPeriod?: number;
  pointAltitude?: number;
  pointRadius?: number;
};
 
interface WorldProps {
  globeConfig: GlobeConfig;
  data: Position[];
}
 
let numbersOfRings = [0];
 
export function Globe({ globeConfig, data }: WorldProps) {
  const globeRef = useRef<ThreeGlobe | null>(null);
  const groupRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);
 
  // Initialize globe only once
  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      (groupRef.current as any).add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);
 
  // Build material when globe is initialized or when relevant props change
  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;
 
    const globeMaterial = globeRef.current.globeMaterial() as unknown as {
      color: Color;
      emissive: Color;
      emissiveIntensity: number;
      shininess: number;
    };
    globeMaterial.color = new Color(globeConfig.globeColor || "#062056");
    globeMaterial.emissive = new Color(globeConfig.emissive || "#062056");
    globeMaterial.emissiveIntensity = globeConfig.emissiveIntensity || 0.1;
    globeMaterial.shininess = globeConfig.shininess || 0.9;
  }, [
    isInitialized,
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);
 
  // Build data when globe is initialized or when data changes
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
 
    const arcs = data;
    let points = [];
    for (let i = 0; i < arcs.length; i++) {
      const arc = arcs[i];
      // const rgb = hexToRgb(arc.color) as { r: number; g: number; b: number }; // No longer needed
      points.push({
        size: globeConfig.pointSize || 4,
        order: arc.order,
        color: arc.color,
        lat: arc.startLat,
        lng: arc.startLng,
      });
      points.push({
        size: globeConfig.pointSize || 4,
        order: arc.order,
        color: arc.color,
        lat: arc.endLat,
        lng: arc.endLng,
      });
    }
 
    // remove duplicates for same lat and lng
    const filteredPoints = points.filter(
      (v, i, a) =>
        a.findIndex(
          (v2) =>
            ["lat", "lng"].every(
              (k) => v2[k as "lat" | "lng"] === v[k as "lat" | "lng"],
            ),
        ) === i,
    );
 
    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(globeConfig.showAtmosphere ?? true)
      .atmosphereColor(globeConfig.atmosphereColor || "#FFFFFF")
      .atmosphereAltitude(globeConfig.atmosphereAltitude || 0.1)
      .hexPolygonColor(() => globeConfig.polygonColor || "rgba(255,255,255,0.7)");
 
    globeRef.current
      .arcsData(data)
      .arcStartLat((d) => (d as { startLat: number }).startLat * 1)
      .arcStartLng((d) => (d as { startLng: number }).startLng * 1)
      .arcEndLat((d) => (d as { endLat: number }).endLat * 1)
      .arcEndLng((d) => (d as { endLng: number }).endLng * 1)
      .arcColor((e: any) => (e as { color: string }).color)
      .arcAltitude((e) => (e as { arcAlt: number }).arcAlt * 1)
      .arcStroke(globeConfig.arcStroke || 0.5)
      .arcDashLength(globeConfig.arcDashLength || 0.5)
      .arcDashInitialGap((e) => (e as { order: number }).order * 1)
      .arcDashGap(globeConfig.arcDashGap || 0.1)
      .arcDashAnimateTime(globeConfig.arcTime || 1000);
 
    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((e) => (e as { color: string }).color)
      .pointsMerge(true)
      .pointAltitude(globeConfig.pointAltitude || 0.01)
      .pointRadius(globeConfig.pointRadius || 0.2);
 
    globeRef.current
      .ringsData([])
      .ringColor(globeConfig.ringsColor || "rgba(255,255,255,0.7)")
      .ringMaxRadius(globeConfig.ringMaxRadius || 1)
      .ringPropagationSpeed(globeConfig.ringPropagationSpeed || 3)
      .ringRepeatPeriod(globeConfig.ringRepeatPeriod || 1000);
  }, [
    isInitialized,
    data,
    globeConfig.pointSize,
    globeConfig.showAtmosphere,
    globeConfig.atmosphereColor,
    globeConfig.atmosphereAltitude,
    globeConfig.polygonColor,
    globeConfig.arcDashLength,
    globeConfig.arcTime,
    globeConfig.arcStroke,
    globeConfig.arcDashGap,
    globeConfig.pointAltitude,
    globeConfig.pointRadius,
    globeConfig.ringsColor,
    globeConfig.ringMaxRadius,
    globeConfig.ringPropagationSpeed,
    globeConfig.ringRepeatPeriod,
  ]);
 
  // Handle rings animation with cleanup
  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;
 
    const interval = setInterval(() => {
      if (!globeRef.current) return;
 
      const newNumbersOfRings = genRandomNumbers(
        0,
        data.length,
        Math.floor((data.length * (globeConfig.rings || 1)) / 5),
      );
 
      const ringsData = data
        .filter((d, i) => newNumbersOfRings.includes(i))
        .map((d) => ({
          lat: d.startLat,
          lng: d.startLng,
          color: d.color,
        }));
 
      globeRef.current.ringsData(ringsData);
    }, globeConfig.ringRepeatPeriod || 2000);
 
    return () => {
      clearInterval(interval);
    };
  }, [isInitialized, data, globeConfig.rings, globeConfig.ringRepeatPeriod]);
 
  return <group ref={groupRef} />;
}
 
export function WebGLRendererConfig() {
  const { gl, size } = useThree();
 
  useEffect(() => {
    // Verificación de window antes de acceder a sus propiedades
    if (typeof window !== 'undefined') {
      gl.setPixelRatio(window.devicePixelRatio);
      gl.setSize(size.width, size.height);
      gl.setClearColor(0xffaaff, 0);
    }
  }, [gl, size]);
 
  return null;
}
 
export function World(props: WorldProps) {
  const { globeConfig } = props;
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  
  // Renderizado condicional para evitar errores del servidor
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Canvas scene={scene} camera={new PerspectiveCamera(50, aspect, 180, 1800)}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate={true}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}
 
export function hexToRgb(hex: string) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });
 
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
 
export function genRandomNumbers(min: number, max: number, count: number) {
  const arr = [];
  while (arr.length < count) {
    const r = Math.floor(Math.random() * (max - min)) + min;
    if (arr.indexOf(r) === -1) arr.push(r);
  }
 
  return arr;
} 