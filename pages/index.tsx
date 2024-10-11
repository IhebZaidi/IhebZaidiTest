"use client"; // <-- Add this at the top of the file to make it a Client Component

import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main>
      <div>
        {/* Required meta tags */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap"
          rel="stylesheet"
        />
        {/* Assurez-vous que ces fichiers CSS sont bien dans le dossier public */}
        <link rel="stylesheet" href="/fonts/icomoon/style.css" />
        <link rel="stylesheet" href="/css/owl.carousel.min.css" />
        {/* Bootstrap CSS */}
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        {/* Style principal */}
        <link rel="stylesheet" href="/css/style.css" />
        <title>Login #8</title>

        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-6 order-md-2">
                {/* Assurez-vous que cette image est bien dans le dossier public */}
                <img
                  src="/images/blog_B4T_Security.png"
                  alt="Image"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-6 contents">
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="mb-4">
                      <h3>
                        Test with <strong>Iheb Zaidi</strong>
                      </h3>
                    </div>
                    <form action="#" method="post">
                      <span className="d-block text-left my-4 text-muted">
                        Register avec Google pour continuer
                      </span>
                      <div className="social-login">
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => signIn("google")} // Trigger Google sign-in
                        >
                          <span className="icon-google mr-3" />
                          Se connecter avec Google
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
