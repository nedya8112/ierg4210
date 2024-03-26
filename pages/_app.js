import "../styles/style.css";
import { useEffect } from 'react';
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }) {
  // let audio;

  // useEffect(() => {
  //   if (!audio) {
  //     audio = document.getElementById("bgm");
  //     audio.volume = 0.025;

  //     document.addEventListener('keydown', (e) => {

  //       if (e.key == 'p') {
  //         if (audio.paused) {
  //           audio.play();
  //         } else {
  //           audio.pause();
  //         }
  //       }
  //     });
  //     // audio.play();
  //   }
  // }, []);

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
        {/* <audio id="bgm" loop preload="auto" src="./StellarStellar.mp3" /> */}
      </SessionProvider>
    </>
  );
}
