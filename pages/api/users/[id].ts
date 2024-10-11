import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma"; // Assurez-vous que Prisma est correctement configuré

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  // Convertir l'id en nombre et vérifier la validité
  const userId = parseInt(id as string, 10);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID utilisateur invalide" });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      // Vous n'avez plus besoin de la variable password ici
      const { ...userData } = user; // Conservez tous les autres champs

      return res.status(200).json(userData);
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'utilisateur:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des données de l'utilisateur" });
    }
  } else if (req.method === 'PUT') {
    try {
      const { firstName, lastName, dob, address, phone, email } = req.body;

      // Validation des champs
      if (!firstName || !lastName || !dob || !address || !phone || !email) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires." });
      }

      // Vérifiez et convertissez la date de naissance
      const dobDate = new Date(dob);
      if (isNaN(dobDate.getTime())) {
        return res.status(400).json({ error: "La date de naissance est invalide." });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          dob: dobDate, // Utilisez l'objet Date
          address,
          phone,
          email,
        },
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données de l'utilisateur:", error);
      return res.status(500).json({ error: "Erreur lors de la mise à jour des données de l'utilisateur" });
    }
  } else {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }
}
