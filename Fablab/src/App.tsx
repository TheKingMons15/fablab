import { useState } from 'react'
import './App.css'
import fablab from "./Img/fablab.svg"


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="" target="_blank">
          <img src={fablab} className="logo react" alt="Fablab logo" />
        </a>

      </div>
      <h1>Site Undercontroccion</h1>
      <div className="card">
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
