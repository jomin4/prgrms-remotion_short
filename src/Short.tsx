import React from "react";
import { Series } from "remotion";
import type { Scene, ShortContent } from "./types";
import { TitleScene } from "./scenes/TitleScene";
import { BulletScene } from "./scenes/BulletScene";
import { CompareScene } from "./scenes/CompareScene";
import { CodeScene } from "./scenes/CodeScene";
import { OutroScene } from "./scenes/OutroScene";
import { FlowScene } from "./scenes/FlowScene";
import { StepsScene } from "./scenes/StepsScene";

const renderScene = (scene: Scene) => {
  switch (scene.type) {
    case "title":
      return <TitleScene {...scene} />;
    case "bullet":
      return <BulletScene {...scene} />;
    case "compare":
      return <CompareScene {...scene} />;
    case "code":
      return <CodeScene {...scene} />;
    case "outro":
      return <OutroScene {...scene} />;
    case "flow":
      return <FlowScene {...scene} />;
    case "steps":
      return <StepsScene {...scene} />;
  }
};

// content JSON을 씬 시퀀스로 조립하는 메인 컴포지션
export const Short: React.FC<ShortContent> = ({ scenes }) => {
  return (
    <Series>
      {scenes.map((scene, i) => (
        <Series.Sequence key={i} durationInFrames={scene.durationInFrames}>
          {renderScene(scene)}
        </Series.Sequence>
      ))}
    </Series>
  );
};

// 씬 길이 합으로 전체 영상 길이를 계산 (Root의 calculateMetadata에서 사용)
export const totalDuration = (content: ShortContent) =>
  content.scenes.reduce((sum, s) => sum + s.durationInFrames, 0);
