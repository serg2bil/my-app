import RootLayout from "./layout"
import "./globals.css"
import { Provider } from 'react-redux';
import store from '@/components/store';
import { useEffect } from "react";

export default function MyApp({ Component, pageProps }) {

      
  return (
    <RootLayout>
      <Provider store={store}>
        
          <Component {...pageProps} />
        
      </Provider>
    </RootLayout>
  )
}