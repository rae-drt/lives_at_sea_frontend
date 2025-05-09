import './App.css';
import Person from './person';
import OfficerIndex from './officerindex';
import RatingsIndex from './ratingsindex';
import SimpleEditor from './simpleeditor';
import { Routes, Route, Navigate} from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Routes>
          <Route path={process.env.PUBLIC_URL}>
            <Route path='' element={<Navigate to='ratings'/>}/>
            <Route path='officers' element={<Navigate to='A'/>}/>
            <Route path='officers/:letter' element={<OfficerIndex/>}/>
            <Route path='ratings' element={<Navigate to='188/5'/>}/>{/* lowest series, lowest piece */}
            <Route path='ratings/:series/:piece' element={<RatingsIndex/>}/>
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
      </QueryClientProvider>
    </div>
  );
}

export default App;
