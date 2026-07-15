import React from "react";
import { Composition } from "remotion";
import { Short, totalDuration } from "./Short";
import { CodeAnalysis } from "./CodeAnalysis";
import { analysisDuration } from "./typesAnalysis";
import { VIDEO } from "./theme";
import type { ShortContent } from "./types";
import type { CodeAnalysisContent } from "./typesAnalysis";
import explainerDefault from "../content/explainer/git-reset.json";
import codeDefault from "../content/code/recursion.json";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 템플릿 B — 개념 설명 (씬 조립형) */}
      <Composition
        id="Explainer"
        component={Short}
        defaultProps={explainerDefault as ShortContent}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        calculateMetadata={({ props }) => ({
          durationInFrames: totalDuration(props),
        })}
      />

      {/* 템플릿 A — 코드 분석 (에디터 + 시각화) */}
      <Composition
        id="CodeAnalysis"
        component={CodeAnalysis}
        defaultProps={codeDefault as CodeAnalysisContent}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        calculateMetadata={({ props }) => ({
          durationInFrames: analysisDuration(props),
        })}
      />
    </>
  );
};
