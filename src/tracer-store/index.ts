import { create } from "zustand";

type Trace = {
  id: string;
  label: string;
};

export interface TracerStore {
  traces: Trace[];
  addTraceId: (trace: Trace) => void;
  removeTraceId: (trace: Trace) => void;
  clearTraces: () => void;
}

export const useTracerStore = create<TracerStore>((set) => ({
  traces: [],
  addTraceId: (trace: Trace) =>
    set((state: any) => ({
      traces: [...state.traces, trace],
    })),
  removeTraceId: (trace: Trace) =>
    set((state: any) => ({
      traces: state.traces.filter((t: Trace) => t.id !== trace.id),
    })),
  clearTraces: () => set({ traces: [] }),
}));

export function startTrace(label: string) {
  const traceId = crypto.randomUUID();
  useTracerStore.getState().addTraceId({ id: traceId, label });
  return traceId;
}
