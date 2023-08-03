import { useState } from 'react';
import './App.css';
import Input from './components/Input';
import Introduction from './components/Introduction';
import MatrixTable from './components/MatrixTable';


function App() {
  const [ size, setSize ] = useState(0)
  const [ isPlay, setIsPlay ] = useState(false)

  console.log(size)
  return (
    <div className="App">
      <div>

      <Input onStart={(_size) => {
          setSize(parseInt(_size))
          setIsPlay(true)
        }} />
        <Introduction />
      </div>

        { isPlay && <MatrixTable rows={size} cols={size} />}
    </div>
  );
}

export default App;
