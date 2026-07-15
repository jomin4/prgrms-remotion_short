import React from "react";
import { theme } from "../../theme";

// 하단 자막(서브타이틀) 한 줄. 설명은 화면에 남기지 않고 여기에 짧게 표시.
export const Caption: React.FC<{ text: string; opacity?: number }> = ({
  text,
  opacity = 1,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 84,
        display: "flex",
        justifyContent: "center",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: "100%",
          background: theme.clay,
          color: theme.paper,
          fontSize: 44,
          fontWeight: 600,
          textAlign: "center",
          padding: "18px 34px",
          borderRadius: 16,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
};
