import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0B0B0C",
          borderRadius: 36,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: 6,
            color: "#F4F4F5",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          N
        </div>
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 18,
            height: 18,
            borderRadius: 999,
            background: "#FF4D2E",
          }}
        />
      </div>
    ),
    size,
  );
}
