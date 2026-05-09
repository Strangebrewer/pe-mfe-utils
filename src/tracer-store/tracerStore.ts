import { create } from "zustand";

type Trace = {
  id: string;
  label: string;
};

export interface TracerStore {
  traces: Trace[];
  addTraceId: (trace: Trace) => void;
  removeTraceId: (trace: Trace) => void;
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
}));
