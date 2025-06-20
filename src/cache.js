import { createStore, useStore } from 'zustand';
import { useQuery } from '@tanstack/react-query';
import { fullRecordQuery } from './queries';

//TODO
//Perhaps I should merge this into queries
//Then mutate can simplify invalidate this cache by removing a record from the map
//Or queryFn can take repsonsibility for populating the cache in the first place, and I won't need this JIT-ish cache filling
//(But the JIT-ish cache filling might be efficient)
//Either way, I may be able to hide everything behind the useQuery interface (but I don't have to)

function hash(sailorType, nameId) {
  return `${sailorType}:${nameId}`;
}

const RECORDS = new Map();

function getRecord(sailorType, nameId, selection, query) {
  const { data: queryData, status: queryStatus } = query; //if it is possible to do this without hooks, could be more efficient to do the lookup inside the conditional
  let record = null;

  if(RECORDS.has(hash(sailorType, nameId))) {
    record = RECORDS.get(hash(sailorType, nameId));
  }
  else if(queryStatus === 'success') {
    record = createStore((set) => ({
      record: queryData,
      selection: selection,
    }));
    RECORDS.set(hash(sailorType, nameId), record);
    console.log('QUERIED', record);
  }

  if(record === null) {
    return {
      data: createStore((set) => ({
        record: { [selection]: null },
        selection: selection,
      })),
      setData: null,
      status: queryStatus,
    };
  }
  return {
    data: record,
    setData: (value) => {
      record.setState((prev) => {
        const newRecord = structuredClone(prev);
        newRecord.record[selection] = value;
        return newRecord;
      });
    },
    status: queryStatus,
  };
}

export function useRecord(sailorType, nameId, selection) {
  const inner = getRecord(sailorType, nameId, selection, useQuery(fullRecordQuery(sailorType, nameId)));
  return {data: useStore(inner.data, (state)=>state.record[selection]), setData: inner.setData, status: inner.status};
}
