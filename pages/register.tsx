import { useSession } from "next-auth/react";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import Image from 'next/image';  // Use next/image instead of <img> tag

export default function Register() {
  const { data: session } = useSession();
  const router = useRouter();
  const email = session?.user?.email || "";
  const fullName = session?.user?.name || "";
  let [firstName, lastName] = fullName.split(" ");

  if (!firstName) firstName = "";
  if (!lastName) lastName = "";

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    dob: "",
    address: "",
    phone: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // useEffect to update form data with session info
  useEffect(() => {
    if (session) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        firstName: firstName || prevFormData.firstName,
        lastName: lastName || prevFormData.lastName,
      }));
    }
  }, [session, firstName, lastName]);  // Include firstName and lastName in dependency array

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function getCoordinates(address: string) {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(address)}`
    );
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const [longitude, latitude] = data.features[0].geometry.coordinates;
      return { latitude, longitude };
    } else {
      throw new Error("Adresse introuvable");
    }
  }

  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const address = formData.address;

    try {
      const { latitude, longitude } = await getCoordinates(address);
      const parisLatitude = 48.8566;
      const parisLongitude = 2.3522;

      const distance = calculateDistance(latitude, longitude, parisLatitude, parisLongitude);

      if (distance <= 50) {
        // Address is valid and within 50km of Paris
        console.log("Adresse valide");

        const response = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            email,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          router.push(`/profile/${data.id}`); // Redirect to user profile
        } else if (response.status === 409) {
          const data = await response.json();
          setErrorMessage(data.error); // Show error message if email is already used
        } else {
          setErrorMessage("Erreur lors de l'inscription.");
        }
      } else {
        setErrorMessage("L'adresse doit être située à moins de 50 km de Paris.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de la vérification de l'adresse.");
    }
  };

  return (
    <main>
      <div>
        <title>Sauvegarder les informations</title>

        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-md-6 order-md-2">
                <Image
                  src="/images/blog_B4T_Security.png"
                  alt="Image"
                  width={500}
                  height={300}
                  className="img-fluid"
                  priority={true}
                />
              </div>
              <div className="col-md-6 contents">
                <div className="row justify-content-center">
                  <div className="col-md-8">
                    <div className="mb-4">
                      <h3>Sauvegarder les informations</h3>
                      <p className="mb-4">Complétez les informations manquantes pour continuer.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="form-group">
                        <label htmlFor="firstName">Prénom</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="form-control"
                          value={formData.firstName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="lastName">Nom</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="form-control"
                          value={formData.lastName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="dob">Date de naissance</label>
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          className="form-control"
                          value={formData.dob}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="address">Adresse</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className="form-control"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="phone">Numéro de téléphone</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-control"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                      <div className="form-group">
                        <button type="submit" className="btn btn-primary">
                          Sauvegarder et continuer
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
