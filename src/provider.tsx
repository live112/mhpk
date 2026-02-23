import { HeroUIProvider } from "@heroui/system";

import { ToastProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";

import type { NavigateOptions } from "react-router-dom";
import { LoaderProvider, useLoader } from "@context/LoaderContext";
import { Loader } from "@components/loader";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <LoaderProvider>
      <InnerProvider>{children}</InnerProvider>
    </LoaderProvider>
  );
}

function InnerProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { isLoading } = useLoader();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <Loader mostrarLoader={isLoading} />
      <ToastProvider
        maxVisibleToasts={2}
        placement="top-right"
        regionProps={{
          className: "z-50",
        }}
      />
      {children}
    </HeroUIProvider>
  );
}
