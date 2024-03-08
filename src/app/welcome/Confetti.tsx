"use client";

import ReactConfetti from "react-confetti";
import { useWindowSize } from "@uidotdev/usehooks";

export function Confetti() {
  const size = useWindowSize();

  if (!size.width || !size.height) return null;

  return (
    <ReactConfetti
      recycle={false}
      width={size.width}
      height={size.height}
      numberOfPieces={300}
      gravity={0.25}
      initialVelocityY={40}
      confettiSource={{
        w: 200,
        h: 10,
        x: size.width / 2 - 100,
        y: size.height,
      }}
    />
  );
}
