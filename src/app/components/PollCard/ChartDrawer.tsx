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

const { Bar, BarChart, ResponsiveContainer } = await import("recharts");

export function ChartDrawer({ data }: { data: { value: number }[] }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row items-center justify-center gap-2"
        >
          Chart <BarChartIcon />
        </Button>
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
