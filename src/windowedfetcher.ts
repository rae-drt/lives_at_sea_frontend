/* Began as Joseph Luck's paginated fetcher (https://www.josephluck.co.uk/blog/paginated-hooks)
 * But I have reworked it for my purposes here, including making it "windowed" rather than paginated.
 * That is, it caches a moving window across the record set, rather than a steadily growing number of pages.
 */

import { useState, useCallback } from 'react';

type Fetcher = (
  from: number,
  horizon: number
) => (...args: any[]) => Promise<Windowed<any>>;

export const useWindowedFetcher = <Fn extends Fetcher>(
  nextFetcher: Fn,
  prevFetcher: Fn,
  horizon = 5,
  refreshBuffer = 3, //TOOD: Assert that this is lower than horizon
) => {
  type Return = ReturnType<typeof fetcher>;

  const [ids, setIds] = useState<string[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cursorPos, setCursorPos] = useState(0);

  const fetchData = useCallback(
    (initial: boolean,
     fetcher: Fn) =>
      async (...args: any[]) => {
        const from = initial ? 0 : ids[ids.length - 1]
        try {
console.log(from, horizon);
          const size = initial ? 1 + (horizon * 2) : horizon;
  console.log(size);
          const response = await fetcher(from, size)(...args);
console.log('response', response);
          const newIds = response.results;
          if(initial || newIds.length === 0) {
            setIds(newIds);
          }
          else {
            setIds([...ids.slice(ids.length - horizon - 1), ...newIds]);
          }
          setLoaded(true);
          setInitialized(true);
          return response;
        } catch (err) {
          setErrored(true);
        }
      },
    [ids, horizon]
  );

  const fetchInitial = useCallback(
    async (...args: any[]) => {
      if (!loadingInitial) {
console.warn('fetchInitial');
        setLoaded(false);
        setLoadingInitial(true);
        setInitialized(false);
        try {
          return await fetchData(true, nextFetcher)(...args);
        } finally {
          setLoadingInitial(false);
        }
      }
    },
    [fetchData, loadingInitial, nextFetcher]
  ) as Return;

  const fetchNextPage = useCallback(
    async (...args: any[]) => {
      if (!loading) {
        setLoading(true);
        try {
          return await fetchData(false, nextFetcher)(...args);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchData, loading, nextFetcher]
  ) as Return;

  const fetchPreviousPage = useCallback(
    async (...args: any[]) => {
      if (!loading) {
        setLoading(true);
        try {
          return await fetchData(false, prevFetcher)(...args);
        } finally {
          setLoading(false);
        }
      }
    },
    [fetchData, loading, prevFetcher]
  ) as Return;

  const getNextRecord = useCallback(
    (step = 1) => { //TODO: handle a step that goes outside of the window (by recentering the window on the result of the step??)
      console.log(cursorPos, ids);
      const next = ids[cursorPos + step];
      console.log(next);
      if(cursorPos + step === ids.length - refreshBuffer) {
        fetchNextPage().then(setCursorPos(horizon - refreshBuffer + 1));
      }
      //else if(cursorPos + step - refreshBuffer < 0) {
      //  fetchPreviousPage().then(setCursorPos(horizon + refreshBuffer));
     // }
      else {
        setCursorPos(cursorPos + step);
      }
      return next;
    },
    [ids, cursorPos, horizon, fetchNextPage, refreshBuffer]
  );

  return {
    ids,
    loadingInitial,
    loading,
    loaded,
    errored,
    fetchInitial,
    getNextRecord,
    initialized,
  };
};
