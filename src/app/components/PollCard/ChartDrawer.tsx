import { Button } from "@/components/ui/button";
import { ChartBar } from "@phosphor-icons/react/dist/ssr";
import { formatNumber } from "@/lib/utils";
import {
  Drawer,
  DrawerTitle,
  DrawerHeader,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function ChartDrawer({
  data,
}: {
  data: { value: number; label: string }[];
}) {
  const maxValue = Math.max(...data.map((item) => item.value));
  return (
    <Drawer shouldScaleBackground>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row items-center justify-center gap-2"
        >
          Chart <ChartBar size={18} />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Votes</DrawerTitle>
        </DrawerHeader>
        <div className="flex w-full flex-col items-center p-8">
          <div className="grid h-[60vh] w-full max-w-4xl grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-4 sm:w-11/12 sm:gap-8 lg:w-3/4">
            {data.map((item, index) => (
              <div
                key={index}
                className="relative flex w-full flex-col items-center justify-end"
              >
                <div
                  className="flex w-full transform-gpu flex-col items-center justify-between rounded-t-lg bg-foreground transition-all duration-300 ease-out"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className="text-base font-bold text-black sm:text-xl">
                    {formatNumber(item.value)}
                  </span>
                </div>
                <span className="absolute bottom-1 w-11/12 rounded-lg border border-accent bg-black p-2 text-center text-xs font-bold shadow sm:w-3/4 md:text-sm lg:text-base">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="h-0.5 w-full rounded-full bg-accent" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
