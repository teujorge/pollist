"use client";

import { Bar, BarChart, ResponsiveContainer } from "recharts";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function ChartDrawer({ data }: { data: { value: number }[] }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="w-fit">Open Chart</button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Votes</DrawerTitle>
          </DrawerHeader>

          <div className="h-[60dvh] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <Bar
                  dataKey="value"
                  style={
                    {
                      fill: "white",
                      opacity: 0.9,
                    } as React.CSSProperties
                  }
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
