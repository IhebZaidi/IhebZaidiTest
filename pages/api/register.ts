import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma'; // Utilisation de Prisma ou autre ORM

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

      // Créez un nouvel utilisateur si l'email n'existe pas
      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          dob,
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
