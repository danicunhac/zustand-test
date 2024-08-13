'use client';

import { create } from 'zustand';
import { combine, devtools, persist } from 'zustand/middleware';

import { Button } from '@/components/ui/button';
import { createSelectors } from '@/lib/utils';

interface CountAction {
  increase: () => void;
  reset: () => void;
  setCount: (newCount: number) => void;
}

interface CountState {
  count: number;
}

interface MiddlewareAction extends Omit<CountAction, 'setCount'> {}

// Each action receives a function that can accept parameters and returns
// an object inside a call of `set`, where we can access the state.
// (newState) => set((state) => ({ foo: newState, bar: state })),
// where `set` merges the state, avoiding need of spread.

const useStore = create<CountState & CountAction>((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
  setCount: (newCount: number) => set({ count: newCount }),
}));

const combinedStore = create(
  combine({ count: 0 }, (set) => ({
    increase: () => set((state) => ({ count: state.count + 1 })),
    reset: () => set({ count: 0 }),
  }))
);

const middlewareStore = create<CountState & MiddlewareAction>()(
  devtools(
    persist(
      (set) => ({
        count: 0,
        increase: () =>
          set((state) => ({
            count: state.count + 1,
          })),
        reset: () => set({ count: 0 }),
      }),
      {
        name: 'countStore',
      }
    )
  )
);

export default function Home() {
  const [count, increase, reset] = useStore((state) => [
    state.count,
    state.increase,
    state.reset,
  ]);

  const combinedCount = combinedStore((state) => state.count);

  const [combinedIncrease, combinedReset] = combinedStore((state) => [
    state.increase,
    state.reset,
  ]);

  const [middlewareCount, middlewareIncrease, middlewareReset] =
    middlewareStore((state) => [state.count, state.increase, state.reset]);

  const storeSelectors = createSelectors(useStore);

  const countSelector = storeSelectors.use.count();
  const increaseSelector = storeSelectors.use.increase();
  const resetSelector = storeSelectors.use.reset();

  return (
    <main className="flex min-h-screen flex-col px-24 py-16 gap-12">
      <div className="flex flex-col gap-4">
        <h1>Regular State (create)</h1>
        <div className="flex gap-4">
          <Button onClick={increase}>Add</Button>
          <Button variant={'outline'} onClick={reset}>
            Reset
          </Button>
          <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <code className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert">
              {count}
            </code>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1>Combined State (combine)</h1>
        <div className="flex gap-4">
          <Button onClick={combinedIncrease}>Add</Button>
          <Button variant={'outline'} onClick={combinedReset}>
            Reset
          </Button>
          <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <code className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert">
              {combinedCount}
            </code>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h1>Middleware State (devtools/persist)</h1>
        <div className="flex gap-4">
          <Button onClick={middlewareIncrease}>Add</Button>
          <Button variant={'outline'} onClick={middlewareReset}>
            Reset
          </Button>
          <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <code className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert">
              {middlewareCount}
            </code>
          </div>
        </div>
        <p className="text-slate-400 font-light text-sm">
          State persists on local storage with given <br />
          name (countStore), created on first page load with initial value.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h1>Created Selectors (utils) (linked)</h1>
        <div className="flex gap-4">
          <Button onClick={increaseSelector}>Add</Button>
          <Button variant={'outline'} onClick={resetSelector}>
            Reset
          </Button>
          <div className="relative z-[-1] flex place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
            <code className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert">
              {countSelector}
            </code>
          </div>
        </div>
      </div>
    </main>
  );
}
