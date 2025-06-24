import { createStore, useStore } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { queries } from './queries';

//TODO
//Perhaps I should merge this into queries
//Then mutate can simplify invalidate this cache by removing a record from the map
//Or queryFn can take repsonsibility for populating the cache in the first place, and I won't need this JIT-ish cache filling
//(But the JIT-ish cache filling might be efficient)
//Either way, I may be able to hide everything behind the useQuery interface (but I don't have to)

const RECORDS = new Map();

function getRecord(sailorType, nameId, selection, query) {
  const key = `${sailorType}:${nameId}:${selection}`;
  if(!RECORDS.has(key)) {
    if(query.status === 'success') {
      RECORDS.set(key,
                  createStore((set) => ({
                    [selection]: query.data,
                    update: (value) => set({[selection]: value}),
                  })));
    }
  }
  return {
    data: RECORDS.get(key) || createStore(() => ({[selection]: null})),
    status: query.status,
  };
}

export function useRecord(sailorType, nameId, selection) {
  const inner = getRecord(sailorType, nameId, selection, useQuery(queries[selection](sailorType, nameId)));
  return {data: useStore(inner.data, (state)=>state[selection]), setData: useStore(inner.data, (state)=>state.update), status: inner.status};
}
