import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import React, { useEffect, startTransition } from "react";

interface Store {
  renderLock: boolean;
  timeoutId: NodeJS.Timeout | undefined;
}

const useRenderLockStore = create(
  subscribeWithSelector<Store>(() => ({
    renderLock: false,
    timeoutId: undefined
  }))
);

useRenderLockStore.subscribe(
  (state) => state,
  (state, prevState) => {
    if (!(state.renderLock === true && prevState.renderLock === true)) {
      if (state.timeoutId !== undefined) {
        clearTimeout(state.timeoutId);
      }
    }

    if (state.renderLock === true && prevState.renderLock === false) {
      // React doesn't provide a way of knowing if a component's rendering
      // was interrupted. So, to prevent a deadlock when a component obtained
      // a lock but was interrupted before it's release, we have this failsafe
      const timeoutId = setTimeout(() => {
        useRenderLockStore.setState({
          renderLock: false
        });
      }, 500);

      useRenderLockStore.setState({
        timeoutId
      });
    }
  }
);

/**
 * To prevent JS thread from being blocked when too many components are rendered at once, 
 * we use this HOC to queue the rendering of components. Each component wrapped in this HOC
 * competes for the lock to render. Only one component can render at a time. 
 * 
 * @param Component Component to be rendered
 * @param Placeholder A placeholder component to be rendered while the lock is not obtained
 * @returns 
 */
export default function withRenderQueue<T extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<T>,
  Placeholder?: React.ComponentType<T>
): React.FunctionComponent<T> {
  return function RenderQueueComponent(props: T & JSX.IntrinsicAttributes) {
    // Once the lock is obtained, we update state to trigger render
    const [lockObtained, setLockObtained] = React.useState(false);
    useEffect(() => {
      // If this component has already obtained the lock, we don't need to do anything
      if (lockObtained) {
        return;
      }
      if (!useRenderLockStore.getState().renderLock) {
        // If lock is available, we grab the lock
        useRenderLockStore.setState({
          renderLock: true
        });
        // Update state to trigger render of the component. We use startTransition to batch the state update
        // just in case other heavy state changes can be interrupted by react
        startTransition(() => {
          setLockObtained(true);
        });
      }
    }, [lockObtained]);

    useEffect(
      () =>
        // We use transient state subscription to listen to renderLock state changes. This doesn't trigger
        // re-render of every component wrapped in the HOC. Only when the lock is obtained, and
        // we set setLockObtained to true, the component will re-render. Otherwise, it will just run the
        // the subscription function without re-rendering
        useRenderLockStore.subscribe(
          (state) => state.renderLock,
          () => {
            if (lockObtained) {
              return;
            }

            if (!useRenderLockStore.getState().renderLock) {
              useRenderLockStore.setState({
                renderLock: true
              });

              startTransition(() => {
                setLockObtained(true);
              });
            }
          }
        ),
      [lockObtained]
    );

    useEffect(() => {
      if (lockObtained) {
        // If this component possesses the lock, it releases it after 50ms
        // to allow other components to render. 50ms is arbitrary, but it seems to work
        // in our case. We can adjust this number if needed or use requestAnimationFrame
        // in the future
        setTimeout(() => {
          useRenderLockStore.setState({
            renderLock: false
          });
        }, 50);
      }
    }, [lockObtained]);

    if (!lockObtained) {
      return Placeholder ? <Placeholder {...props} /> : null;
    }

    return <Component {...props} />;
  };
}