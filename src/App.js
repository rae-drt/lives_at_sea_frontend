import './App.css';
import ServiceRecord from './servicerecord.js';
import { Routes, Route} from 'react-router';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<ServiceRecord/>}/>
      </Routes>
    </div>
  );
}

export default App;
