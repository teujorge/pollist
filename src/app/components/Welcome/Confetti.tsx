"use client";

import { useWindowSize } from "@uidotdev/usehooks";
import ReactConfetti from "react-confetti";

export function Confetti() {
  const size = useWindowSize();

  return (
    <ReactConfetti
      recycle={false}
      width={size.width ?? 0}
      height={size.height ?? 0}
      initialVelocityY={20}
      confettiSource={{
        w: 10,
        h: 10,
        x: (size.width ?? 10) / 2,
        y: size.height ?? 0,
      }}
    />
  );
}
