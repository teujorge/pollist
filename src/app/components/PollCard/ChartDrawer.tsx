"use client";

import { BarChartIcon } from "@radix-ui/react-icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const { Bar, BarChart, ResponsiveContainer } = await import("recharts");

export function ChartDrawer({ data }: { data: { value: number }[] }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="border-accent flex h-11 w-24 flex-row items-center justify-center gap-2 rounded-md border px-4 py-2 text-neutral-300 transition-colors hovact:bg-neutral-900">
          Chart <BarChartIcon />
        </button>
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
