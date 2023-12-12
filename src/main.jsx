import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { MapsClientPage } from './pages/MapsClientPage'
import { store } from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <MapsClientPage />
    </Provider>
  </React.StrictMode>,
)
