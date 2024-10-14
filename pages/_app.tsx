import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';

// Importation des fichiers CSS globaux
import "../public/fonts/icomoon/style.css";
import "../public/css/owl.carousel.min.css";
import "../public/css/bootstrap.min.css";
import "../public/css/style.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default MyApp;
