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
  const [pos, setPos] = useState(0);

  const fetchData = useCallback(
    (initial: boolean, fetcher: Fn) => async (...args: any[]) => {
      const from = initial ? 0 : ids[ids.length - 1]
      try {
        const size = initial ? 1 + (horizon * 2) : horizon;
        const newIds = await fetcher(from, size)(...args);
        if(initial || newIds.length === 0) {
          setIds(newIds);
        }
        else {
          setIds([...ids.slice(horizon - pos), ...newIds]);
        }
        setLoaded(true);
        setInitialized(true);
        return Math.floor((horizon - pos + newIds.length) / 2);
      } catch (err) {
        setErrored(true);
        return [];
      }
    },
    [ids, horizon, pos]
  );

  const fetchInitial = useCallback(
    async (...args: any[]) => {
      if (!loadingInitial) {
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
console.log(pos, ids);
      const next = ids[pos + step];
      if(step > 0 && (pos + step >= ids.length - refreshBuffer)) {
        fetchNextPage().then((x)=>{if(x.length) setPos(horizon - refreshBuffer + 1)});
      }
      else if(step < 0 && (pos + step <= refreshBuffer)) {
console.warn('fetchPreviousPage API not implemented');
        fetchPreviousPage().then((x)=>{setPos(horizon + refreshBuffer)});
      }
      else {
        setPos(pos + step);
      }
      return next;
    },
    [ids, pos, horizon, fetchNextPage, fetchPreviousPage, refreshBuffer]
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
