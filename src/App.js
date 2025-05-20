import './App.css';
import Person from './person';
import OfficerIndex from './officerindex';
import RatingsIndex from './ratingsindex';
import SimpleEditor from './simpleeditor';
import { Routes, Route, Navigate} from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental';

const queryClientOptions = process.env.REACT_APP_PERSIST_CACHE ?
  {
    defaultOptions: {
      queries: {
        gcTime: Infinity,
      },
    },
  }
  :
  {}
;

const queryClient = new QueryClient(queryClientOptions);

if(process.env.REACT_APP_BROADCAST_CACHE) {
  console.log("Enabled cache state broadcast (changes made in one tab will be broadcast to others)");
  broadcastQueryClient({
    queryClient,
    broadcastChannel: 'tna-l@s',
  });
}

const routes = (
  <Routes>
    <Route path={process.env.PUBLIC_URL}>
      <Route path='' element={<Navigate to='ratings'/>}/>
      <Route path='officers' element={<Navigate to='A'/>}/>
      <Route path='officers/:letter' element={<OfficerIndex/>}/>
      <Route path='ratings' element={<Navigate to='5'/>}/>{/* lowest piece */}
      <Route path='ratings/:piece' element={<RatingsIndex/>}/>
      <Route path='rating' element={<Navigate to='40001'/>}/>{/* lowest rating */}
      <Route path='officer' element={<Navigate to='7'/>}/>{/* lowest officer number */}
      <Route path='rating/:nameid' element={<Navigate to='main'/>}/>
      <Route path='officer/:nameid' element={<Navigate to='otherservices'/>}/>
      <Route path=':sailorType/:nameId/:dataType' element={<Person/>}/>
      <Route path='sources' element={<SimpleEditor table='sources' primary='sourceid'/>}/>
      <Route path='ships' element={<SimpleEditor table='ships' primary='shipid'/>}/>
      <Route path='battles' element={<SimpleEditor table='battlehonours' primary='battleid'/>}/>
      <Route path='counties' element={<SimpleEditor table='counties' primary='countyId'/>}/>
      <Route path='places' element={<SimpleEditor table='places' primary='placeId'/>}/>
      <Route path='ratingstable' element={<SimpleEditor table='ratings' primary='ratingid'/>}/>
      <Route path='ratingsauto' element={<SimpleEditor table='ratingsauto' primary='ratingautoid'/>}/>
      {/*TODO: What do we do with these awkward cases?
        <Route path='acronyms' element={<SimpleEditor table='acronyms' primary='acronym'/>}/> -- tricky case, there is no independent primary key, and the actual primary (acronym) is a non-integer and needs to be visible and editable
        <Route path='countries' element={<SimpleEditor table='countries' primary='country'/>}/> -- this one only has the country field*
      */}
    </Route>
  </Routes>
);

function App() {
  if(process.env.REACT_APP_PERSIST_CACHE) {
    console.log("Enabled cache state persistence (changes made will survive refresh)");
    return (
      <div className="App">
        <PersistQueryClientProvider client={queryClient} persistOptions={{persister: createSyncStoragePersister({storage: window.localStorage})}}>
          <ReactQueryDevtools initialIsOpen={false} />
          {routes}
        </PersistQueryClientProvider>
      </div>
    );
  }
  else {
    return (
      <div className="App">
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          {routes}
        </QueryClientProvider>
      </div>
    );
  }
}

export default App;
