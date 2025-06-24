import { createStore, useStore } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { queries } from './queries';

//TODO
//Perhaps I should merge this into queries
//Then mutate can simplify invalidate this cache by removing a record from the map
//Or queryFn can take repsonsibility for populating the cache in the first place, and I won't need this JIT-ish cache filling
//(But the JIT-ish cache filling might be efficient)
//Either way, I may be able to hide everything behind the useQuery interface (but I don't have to)

function hash(sailorType, nameId, selection) {
  return `${sailorType}:${nameId}:${selection}`;
}

const RECORDS = new Map();

function getRecord(sailorType, nameId, selection, query) {
  const { data: queryData, status: queryStatus } = query; //if it is possible to do this without hooks, could be more efficient to do the lookup inside the conditional

  if(!RECORDS.has(hash(sailorType, nameId, selection))) {
    if(queryStatus === 'success') {
      RECORDS.set(hash(sailorType, nameId, selection),
                  createStore((set) => ({
                    [selection]: queryData,
                    update: (value) => set({[selection]: value}),
                  })));
    }
  }
  return {
    data: RECORDS.get(hash(sailorType, nameId, selection)) || createStore(() => ({[selection]: null})),
    status: queryStatus,
  };
}

export function useRecord(sailorType, nameId, selection) {
  const inner = getRecord(sailorType, nameId, selection, useQuery(queries[selection](sailorType, nameId)));
  return {data: useStore(inner.data, (state)=>state[selection]), setData: useStore(inner.data, (state)=>state.update), status: inner.status};
}
