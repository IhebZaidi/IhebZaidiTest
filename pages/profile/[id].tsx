import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react"; // Import the sign-out function

interface User {
  firstName: string;
  lastName: string;
  dob: string;
  address: string;
  phone: string;
  email: string;
}

export default function Profile() {
  const router = useRouter();
  const { id } = router.query; // Get user ID from the URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<User | null>(null); // For the update form

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/users/${id}`); // API to get user details
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setFormData(userData); // Initialize formData with user data
          } else {
            setErrorMessage("Erreur lors du chargement des données de l'utilisateur.");
          }
        } catch (error) {
          setErrorMessage("Erreur réseau lors du chargement des données.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  // Function to handle changes in the form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  // Function to update the profile
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) return;

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setFormData(updatedUser); // Update form data with the latest user info
        alert("Profil mis à jour avec succès !");
      } else {
        alert("Erreur lors de la mise à jour du profil.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau lors de la mise à jour du profil.");
    }
  };

  // Handle sign out and redirect
  const handleSignOut = async () => {
    await signOut({ redirect: false }); // Sign out without automatic redirection
    router.push("/"); // Redirect to login page (index.tsx)
  };

  if (loading) return <p>Chargement...</p>;
  if (errorMessage) return <p>{errorMessage}</p>;

  return (
    <main>
      <div>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="/fonts/icomoon/style.css" />
        <link rel="stylesheet" href="/css/owl.carousel.min.css" />
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/style.css" />
        <title>Mon Profil</title>

        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-6 order-md-2">
                <img src="/images/blog_B4T_Security.png" alt="Image" className="img-fluid" />
              </div>
              <div className="col-md-6 contents">
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <h1>
                      Bienvenue, {user?.firstName} {user?.lastName}!
                    </h1>
                    <p>
                      <strong>Date de naissance:</strong> {user?.dob}
                    </p>
                    <p>
                      <strong>Adresse:</strong> {user?.address}
                    </p>
                    <p>
                      <strong>Téléphone:</strong> {user?.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>

                    <h2>Mise à jour de votre profil</h2>
                    <form onSubmit={handleUpdate}>
                      <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="form-control"
                          value={formData?.firstName || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="form-control"
                          value={formData?.lastName || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="dob">Date de naissance</label>
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          className="form-control"
                          value={formData?.dob || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="address">Adresse</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className="form-control"
                          value={formData?.address || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Numéro de téléphone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-control"
                          value={formData?.phone || ""}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                          Mettre à jour le profil
                        </button>
                      </div>
                    </form>
                    <div className="form-group">
                      <button onClick={handleSignOut} className="btn btn-secondary">
                        Se déconnecter
                      </button>
                    </div>
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
