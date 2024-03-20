"use client";

import { Button } from "@/components/ui/button";
import { BarChartIcon } from "@radix-ui/react-icons";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const { Bar, BarChart, LabelList, ResponsiveContainer } = await import(
  "recharts"
);

export function ChartDrawer({
  data,
}: {
  data: { value: number; label: string }[];
}) {
  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row items-center justify-center gap-2"
        >
          Chart <BarChartIcon />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Votes</DrawerTitle>
        </DrawerHeader>

        <div className="h-[60dvh] w-full p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 100, right: 30, bottom: 30, left: 30 }}
            >
              <Bar
                dataKey="value"
                fill="white"
                label={{
                  fill: "black",
                  position: "insideTop",
                  className: "text-base sm:text-2xl font-bold",
                }}
              >
                <LabelList
                  dataKey="label"
                  position="top"
                  angle={0}
                  fill="rgb(212 212 212)"
                  className="text-xs sm:text-base"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
