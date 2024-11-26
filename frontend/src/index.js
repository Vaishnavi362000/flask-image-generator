import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import theme from './theme';
import './index.css';
import App from './App';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoadingProvider } from './context/LoadingContext';

 
ReactDOM.render(
  <GoogleOAuthProvider clientId="828806469773-s781pve0ffqghs6me2480ramqk9fajba.apps.googleusercontent.com">
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <BrowserRouter>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </BrowserRouter>
      </ChakraProvider>
  </GoogleOAuthProvider>,
  document.getElementById('root')
);


