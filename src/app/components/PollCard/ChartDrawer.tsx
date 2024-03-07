"use client";

import { BarChartIcon } from "@radix-ui/react-icons";
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
        <button className="flex h-fit w-fit flex-row items-center justify-center gap-2 rounded-md bg-neutral-900 px-2 py-1 text-neutral-300 transition-colors hovact:bg-neutral-800">
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
