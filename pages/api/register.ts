import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Assurez-vous que le chemin est correct

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, firstName, lastName, dob, address, phone } = req.body;

    try {
      // Vérifiez si l'utilisateur existe déjà dans la base de données
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        // Si l'utilisateur existe, renvoyer ses informations
        return res.status(200).json(existingUser);
      }

      // Convertir dob en objet Date valide
      const parsedDob = new Date(dob);
      if (isNaN(parsedDob.getTime())) {
        return res.status(400).json({ error: 'Date de naissance invalide' });
      }

      // Créez un nouvel utilisateur si l'email n'existe pas
      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          dob: parsedDob, // Utilisation de la date formatée
          address,
          phone,
        },
      });

      res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erreur interne du serveur." });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
