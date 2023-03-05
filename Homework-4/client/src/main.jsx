import { MantineProvider } from '@mantine/core'
import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { store } from './store/store'

import './index.css'

export const Context = createContext({ store })

const themeConfig = {
  colorScheme: 'dark',
  colors: {
    deepBlue: ['#E9EDFC', '#C1CCF6', '#99ABF0'],
    blue: ['#E9EDFC', '#C1CCF6', '#99ABF0'],
  },

  shadows: {
    md: '1px 1px 3px rgba(0, 0, 0, .25)',
    xl: '5px 5px 3px rgba(0, 0, 0, .25)',
  },

  headings: {
    fontFamily: 'Roboto, sans-serif',
    sizes: {
      h1: { fontSize: 30 },
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Context.Provider value={{ store }}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={themeConfig}
      >
        <App />
      </MantineProvider>
    </Context.Provider>
  </BrowserRouter>
)
