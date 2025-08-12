import { Routes, Route, Navigate } from 'react-router';
import RatingsIndex from './ratingsindex.jsx';
import OfficerIndex from './officerindex.jsx';
import SimpleEditor from './simpleeditor.jsx';
import Person from './person.jsx';

function BadRoute() {
  throw Error(`Bad route: ${window.location.pathname}`);
}

export const routes = (
  <Routes>
    <Route path='/'>
      <Route path='' element={<Navigate to='ratings'/>}/>
      <Route path='officers' element={<Navigate to='A'/>}/>
      <Route path='officers/:letter' element={<OfficerIndex/>}/>
      <Route path='ratings' element={<Navigate to='5'/>}/>{/* lowest piece */}
      <Route path='ratings/:piece' element={<RatingsIndex/>}/>
      <Route path='person/rating' element={<Navigate to='40001'/>}/>{/* lowest rating */}
      <Route path='person/officer' element={<Navigate to='7'/>}/>{/* lowest officer number */}
      <Route path='person/rating/:nameid' element={<Navigate to='main'/>}/>
      <Route path='person/officer/:nameid' element={<Navigate to='otherservices'/>}/>
      <Route path='person/:sailorType/:nameId/:dataType' element={<Person/>}/>
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
      <Route path = '*' element={<BadRoute/>}/>
    </Route>
    <Route path = '*' element={<BadRoute/>}/>
  </Routes>
);
