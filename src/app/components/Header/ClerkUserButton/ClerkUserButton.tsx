import { Loader } from "../../Loader";
import { Suspense } from "react";
import { PricingTable } from "./settings/PricingTable";
import { ClerkUserButtonClient } from "./ClerkUserButtonClient";
import { UserButton2 } from "./UserButton2";

export function ClerkUserButton() {
  return (
    <>
      <UserButton2 />
      <ClerkUserButtonClient
        pricingTable={
          <Suspense fallback={<Loader />}>
            <PricingTable />
          </Suspense>
        }
      />
    </>
  );
}
