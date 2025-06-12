import { init_data } from './data_utils';

function mainPersonQF({queryKey}) {
  const [, {sailorType, nameId}] = queryKey;
  return new Promise((resolve, reject) => {
    if(nameId === '0') {
      resolve(init_data(sailorType));
    }
    else if(typeof(nameId) === 'undefined') {
      reject(new Error());
    }
    else {
      if(sailorType === 'rating') {
        const fetchData = async() => {
          const response = await(fetch(process.env.REACT_APP_API_ROOT + 'name?nameid=' + nameId));
          if(!response.ok) {
            throw new Error('Bad response: ' + response.status);
          }
          return response.json();
        }
        resolve(fetchData());
      }
      else if(sailorType === 'officer') {
        const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
        socket.onerror = (e) => { reject(e); };
        socket.onmessage = (e) => {
          if(e.data === 'NULL') {
            throw new Error('Bad response');
          }
          resolve(JSON.parse(e.data));
          socket.close();
        };
        socket.onopen = () => { socket.send('L@S:Officer:' + nameId) };
      }
      else {
        reject(new Error('Bad sailor type' + sailorType));
      }
    }
  });
}

export async function mainPersonMutate(queryClient, sailorType, nameId, data) {
  const key = mainPersonQuery(sailorType, nameId).queryKey;
  const currentData = await queryClient.fetchQuery({queryKey: key});
  if(sailorType === 'rating') {
    queryClient.setQueryData(mainPersonQuery(sailorType, nameId).queryKey, {...currentData, name: data});
  }
  else {
    queryClient.setQueryData(mainPersonQuery(sailorType, nameId).queryKey, data);
  }
}

export async function serviceRecordsMutate(queryClient, nameId, data) {
  const key = mainPersonQuery('rating', nameId).queryKey;
  const currentData = await queryClient.fetchQuery({queryKey: key});
  //TODO: The "RECONCILED" thing is a workaround
  const newData = {service_history: data.services, status: data.reconciled ? 'RECONCILED' : null};
  queryClient.setQueryData(key, {...currentData, ...newData});
}

export async function otherDataMutate(queryClient, sailorType, nameId, data) {
  const key = mainPersonQuery(sailorType, nameId).queryKey;
  const currentData = await queryClient.fetchQuery({queryKey: key});
  queryClient.setQueryData(key, {...currentData, other_data: data});
}

export async function otherServicesMutate(queryClient, sailorType, nameId, data) {
  const key = mainPersonQuery(sailorType, nameId).queryKey;
  const currentData = await queryClient.fetchQuery({queryKey: key});
  queryClient.setQueryData(key, {...currentData, service_other: data});
}

export const mainPersonQuery = (sailorType, nameId) => ({
  queryKey: ['mainPersonData', {sailorType: sailorType, nameId: Number(nameId)}],
  queryFn: mainPersonQF,
  select: (x) => ( sailorType === 'rating' ? x.name : x),
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
});

export const serviceRecordsQuery = (nameId) => ({
  queryKey: ['mainPersonData', {sailorType: 'rating', nameId: Number(nameId)}],
  queryFn: mainPersonQF,
  select: (x) => ( {reconciled: x.status === 'RECONCILED', services: x.service_history} ), //TODO: The "RECONCILED" thing is a workaround
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
});

export const otherServicesQuery = (sailorType, nameId) => ({
  queryKey: ['mainPersonData', {sailorType: sailorType, nameId: Number(nameId)}],
  queryFn: mainPersonQF,
  select: (x) => ( x.service_other ),
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
});

export const otherDataQuery = (sailorType, nameId) => ({
  queryKey: ['mainPersonData', {sailorType: sailorType, nameId: Number(nameId)}],
  queryFn: mainPersonQF,
  select: (x) => ( x.other_data ),
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  staleTime: Infinity
});

function simpleTableQueryFn({queryKey}) {
  const [, table] = queryKey;
  return new Promise((resolve, reject) => {
    const socket = new WebSocket('ws://' + process.env.REACT_APP_QUERYER_ADDR + ':' + process.env.REACT_APP_QUERYER_PORT);
    socket.onerror = (e) => { reject(e); };
    socket.onmessage = (e) => {
      if(e.data === 'NULL') {
        resolve([]);
      }
      else {
        resolve(JSON.parse(e.data));
      }
      socket.close();
    };
    socket.onopen = () => { socket.send('L@S:SimpleData:' + table) };
  });
}

export const simpleTableQuery = (table) => ({
    queryKey: ['simpleEditor', table],
    queryFn: simpleTableQueryFn,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
});
