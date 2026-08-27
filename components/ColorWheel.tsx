import React, { useMemo, useRef, useState, useEffect } from "react";
import { View, StyleSheet, PanResponder, Text, TextInput } from "react-native";
import Svg, { Polygon, Rect, Defs, LinearGradient, Stop, Circle } from "react-native-svg";
import { colors, fonts, radius, spacing } from "@/constants/theme";

// ---------- Conversioni colore ----------
function hsvToRgb(h: number, s: number, v: number) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return null;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  if ([r, g, b].some((v) => Number.isNaN(v))) return null;
  return { r, g, b };
}

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = 60 * (((gn - bn) / d) % 6);
    else if (max === gn) h = 60 * ((bn - rn) / d + 2);
    else h = 60 * ((rn - gn) / d + 4);
  }
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s, v };
}

// ---------- Ruota delle tonalità (hue wheel) ----------
const WHEEL_SIZE = 220;
const WHEEL_RADIUS = WHEEL_SIZE / 2;
const SEGMENTS = 60;

function HueWheel({ hue, onChange }: { hue: number; onChange: (h: number) => void }) {
  const cx = WHEEL_RADIUS;
  const cy = WHEEL_RADIUS;

  const wedges = useMemo(() => {
    const items = [];
    for (let i = 0; i < SEGMENTS; i++) {
      const a0 = (i / SEGMENTS) * 360;
      const a1 = ((i + 1) / SEGMENTS) * 360;
      const rad0 = (a0 * Math.PI) / 180;
      const rad1 = (a1 * Math.PI) / 180;
      const x0 = cx + WHEEL_RADIUS * Math.cos(rad0);
      const y0 = cy + WHEEL_RADIUS * Math.sin(rad0);
      const x1 = cx + WHEEL_RADIUS * Math.cos(rad1);
      const y1 = cy + WHEEL_RADIUS * Math.sin(rad1);
      const midHue = (a0 + a1) / 2;
      const { r, g, b } = hsvToRgb(midHue, 1, 1);
      items.push(
        <Polygon
          key={i}
          points={`${cx},${cy} ${x0},${y0} ${x1},${y1}`}
          fill={rgbToHex(r, g, b)}
        />
      );
    }
    return items;
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_evt, gestureState) => {
        handleTouch(gestureState.dx, gestureState.dy, gestureState.x0, gestureState.y0, gestureState.moveX, gestureState.moveY);
      },
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        computeFromLocal(locationX, locationY);
      },
    })
  ).current;

  function computeFromLocal(x: number, y: number) {
    const dx = x - cx;
    const dy = y - cy;
    let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    onChange(angle);
  }

  function handleTouch(dx: number, dy: number, x0: number, y0: number, moveX: number, moveY: number) {
    // ricalcola tramite coordinate assolute non disponibile qui in modo affidabile su RN puro,
    // quindi ci affidiamo a onPanResponderGrant + successivi move tramite locationX/Y del touch corrente
  }

  return (
    <View
      style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
      {...panResponder.panHandlers}
      onStartShouldSetResponder={() => true}
      onResponderMove={(evt) => computeFromLocal(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}
      onResponderGrant={(evt) => computeFromLocal(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}
    >
      <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
        {wedges}
        <Circle cx={cx} cy={cy} r={WHEEL_RADIUS - 2} fill="none" stroke={colors.border} strokeWidth={1} />
      </Svg>
      {/* indicatore posizione hue selezionata */}
      <View
        pointerEvents="none"
        style={[
          styles.hueIndicator,
          {
            left: cx + (WHEEL_RADIUS - 14) * Math.cos((hue * Math.PI) / 180) - 8,
            top: cy + (WHEEL_RADIUS - 14) * Math.sin((hue * Math.PI) / 180) - 8,
          },
        ]}
      />
    </View>
  );
}

// ---------- Quadrato Saturazione / Luminosità ----------
const SV_SIZE = 220;

function SVSquare({
  hue,
  sat,
  val,
  onChange,
}: {
  hue: number;
  sat: number;
  val: number;
  onChange: (s: number, v: number) => void;
}) {
  const { r, g, b } = hsvToRgb(hue, 1, 1);
  const hueHex = rgbToHex(r, g, b);

  function computeFromLocal(x: number, y: number) {
    const s = Math.max(0, Math.min(1, x / SV_SIZE));
    const v = Math.max(0, Math.min(1, 1 - y / SV_SIZE));
    onChange(s, v);
  }

  return (
    <View
      style={{ width: SV_SIZE, height: SV_SIZE, borderRadius: radius.sm, overflow: "hidden" }}
      onStartShouldSetResponder={() => true}
      onResponderMove={(evt) => computeFromLocal(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}
      onResponderGrant={(evt) => computeFromLocal(evt.nativeEvent.locationX, evt.nativeEvent.locationY)}
    >
      <Svg width={SV_SIZE} height={SV_SIZE}>
        <Defs>
          <LinearGradient id="satGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
            <Stop offset="1" stopColor={hueHex} stopOpacity={1} />
          </LinearGradient>
          <LinearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000000" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={SV_SIZE} height={SV_SIZE} fill="url(#satGrad)" />
        <Rect x={0} y={0} width={SV_SIZE} height={SV_SIZE} fill="url(#valGrad)" />
      </Svg>
      <View
        pointerEvents="none"
        style={[
          styles.svIndicator,
          {
            left: sat * SV_SIZE - 8,
            top: (1 - val) * SV_SIZE - 8,
          },
        ]}
      />
    </View>
  );
}

// ---------- Componente principale ----------
interface ColorWheelPickerProps {
  value: string; // hex iniziale
  onChange: (hex: string) => void;
}

export default function ColorWheelPicker({ value, onChange }: ColorWheelPickerProps) {
  const initialRgb = hexToRgb(value) || { r: 0, g: 149, b: 246 };
  const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);

  const [hue, setHue] = useState(initialHsv.h);
  const [sat, setSat] = useState(initialHsv.s || 1);
  const [val, setVal] = useState(initialHsv.v || 1);
  const [hexInput, setHexInput] = useState(value.toUpperCase());

  useEffect(() => {
    const { r, g, b } = hsvToRgb(hue, sat, val);
    const hex = rgbToHex(r, g, b);
    setHexInput(hex);
    onChange(hex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue, sat, val]);

  function handleHexSubmit(text: string) {
    let clean = text.trim();
    if (!clean.startsWith("#")) clean = "#" + clean;
    const rgb = hexToRgb(clean);
    if (rgb) {
      const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
      setHue(hsv.h);
      setSat(hsv.s);
      setVal(hsv.v);
    }
    setHexInput(clean.toUpperCase());
  }

  const previewRgb = hsvToRgb(hue, sat, val);
  const previewHex = rgbToHex(previewRgb.r, previewRgb.g, previewRgb.b);

  return (
    <View style={styles.container}>
      <View style={styles.wheelRow}>
        <HueWheel hue={hue} onChange={setHue} />
      </View>

      <SVSquare hue={hue} sat={sat} val={val} onChange={(s, v) => { setSat(s); setVal(v); }} />

      <View style={styles.hexRow}>
        <View style={[styles.preview, { backgroundColor: previewHex }]} />
        <Text style={styles.hexLabel}>HEX</Text>
        <TextInput
          style={styles.hexInput}
          value={hexInput}
          onChangeText={setHexInput}
          onSubmitEditing={(e) => handleHexSubmit(e.nativeEvent.text)}
          onBlur={() => handleHexSubmit(hexInput)}
          autoCapitalize="characters"
          maxLength={7}
          placeholder="#0095F6"
          placeholderTextColor={colors.placeholder}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
  },
  wheelRow: {
    alignItems: "center",
    justifyContent: "center",
  },
  hueIndicator: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  svIndicator: {
    position: "absolute",
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  hexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    width: "100%",
    paddingHorizontal: spacing.md,
  },
  preview: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hexLabel: {
    fontFamily: fonts.semibold,
    fontWeight: "600",
    fontSize: 13,
    color: colors.textSecondary,
  },
  hexInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.text,
  },
});
