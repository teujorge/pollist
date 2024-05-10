import { Loader } from "../../Loader";
import { Suspense } from "react";
import { PricingTable } from "./settings/PricingTable";
import { ClerkUserButtonClient } from "./ClerkUserButtonClient";

export function ClerkUserButton() {
  return (
    <ClerkUserButtonClient
      pricingTable={
        <Suspense fallback={<Loader />}>
          <PricingTable />
        </Suspense>
      }
    />
  );
}
