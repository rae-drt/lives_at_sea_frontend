import './App.css';
import Person from './person';
import OfficerIndex from './officerindex';
import RatingsIndex from './ratingsindex';
import { Routes, Route, Navigate} from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
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
          </Route>
        </Routes>
      </QueryClientProvider>
    </div>
  );
}

export default App;
