import { connectToServer } from './socket-clien'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1>Websocket - Client</h1>

    <span>offline</span>
  </div>
`

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
connectToServer();