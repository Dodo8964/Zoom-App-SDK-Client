// pages/_app.tsx
import '../styles/globals.css';
import '@zoom/meetingsdk/dist/css/bootstrap.css';
import '@zoom/meetingsdk/dist/css/react-select.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
