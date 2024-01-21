import queryClient from "@/src/query/QueryClient";
import tamaguiConfig from "@/tamagui.config";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { TamaguiProvider } from "tamagui";

const MainProvider = ({ children }: PropsWithChildren<{}>) => {
  return <TamaguiProvider config={tamaguiConfig}>
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SafeAreaProvider>
  </TamaguiProvider>
}

export default MainProvider;