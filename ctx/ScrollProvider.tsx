import React, { createContext } from "react";
import {
  Easing,
  SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type StateContext = SharedValue<number>;
type SetContext = (v: boolean) => void;

const ScrollCtx = createContext<StateContext>({
  value: 0,
  addListener() {},
  removeListener() {},
  modify() {},
});
const setContext = React.createContext<SetContext>((_: boolean) => {});

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const isScroll = useSharedValue(0);
  const setMode = React.useCallback(
    (v: boolean) => {
      "worklet";
      isScroll.value = withTiming(v ? 1 : 0, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    },
    [isScroll]
  );

  return (
    <ScrollCtx.Provider value={isScroll}>
      <setContext.Provider value={setMode}>{children}</setContext.Provider>
    </ScrollCtx.Provider>
  );
};

export const useCtxScrollValue = () => {
  return React.useContext(ScrollCtx);
};
export const useCtxSetScrollValue = () => {
  return React.useContext(setContext)
};
