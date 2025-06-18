import { create } from 'zustand';
import { useBlocker } from 'react-router';

export const useDirty = create((set)=> ({
  person: false,
  services: false,
  otherdata: false,
  otherservices: false,
  setDirty: (key) => set(()=>({[key]: true})),
  setClean: (key) => set(()=>({[key]: false})),
}));

export function useDirtyBlocker() {
  const dirty = useDirty();
  function block({currentLocation, historyAction, nextLocation}) {
    return (dirty.person | dirty.services | dirty.otherdata | dirty.otherservices);
  }
  const blocker = useBlocker(block);
  return blocker;
}
