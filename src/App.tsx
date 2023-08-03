import { useState } from 'react';
import './App.css';
import Input from './components/Input';
import Introduction from './components/Introduction';
import MatrixTable from './components/MatrixTable';


function App() {
  const [ size, setSize ] = useState(0)
  const [ time, setTime ] = useState(0)
  const [ isPlay, setIsPlay ] = useState(false)
  console.log(size)
  return (
    <div className="App">
      <div>

      <Input onStart={(_size) => {
          setSize(parseInt(_size))
          setTime((new Date().getTime()))
          setIsPlay(true)
        }} />
        <Introduction />
      </div>

        { isPlay && <MatrixTable rows={size} cols={size} time={time} />}
    </div>
  );
}

export default App;
