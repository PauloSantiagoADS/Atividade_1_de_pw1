import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

import { Technologie } from "../@types/Technologies";

import {
  serviceCreateTechnologies,
  serviceUpdateTechnologies,
  serviceDeleteTechnologies,
  serviceGetAllTechnologies,
  serviceGetTechnologies,
} from "../services/technologies";

import { serviceGetUser } from "../services/users";

const verifyFields = (
  { title, deadline }: { title: string; deadline: string },
  res: Response
) => {
  if (!title && !deadline) {
    return res.status(400).json({ message: "title or deadline are required" });
  }
};

const technologieExist = (idTech: string, idUser: string, res: Response) => {
  const tech = serviceGetTechnologies(idTech, idUser);
  const isTechExist = Boolean(tech);
  if (!isTechExist) {
    return res.status(404).json({ message: "Technologie not found" });
  }
};

export const createTechnologie = (req: Request, res: Response) => {
  const { title, deadline } = req.body;
  const { userId } = req.headers;

  verifyFields({ title, deadline }, res);

  const newTech: any = { title, deadline };
  const tecnologie = serviceCreateTechnologies(userId as string, newTech);
  return res.status(201).json(tecnologie);
};

export const getTechnologies = (req: Request, res: Response) => {
  const { userId } = req.headers;
  const tecnologie = serviceGetAllTechnologies(userId as string);
  return res.status(200).json(tecnologie);
};

export const putTechnologies = (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.headers;
  const { title, deadline } = req.body;

  verifyFields({ title, deadline }, res);
  technologieExist(id, userId as string, res);

  const newTech: any = { title, deadline };
  const tech = serviceUpdateTechnologies(id, userId as string, newTech);
  return res.status(203).json(tech);
};

export const patchTechnologies = (req: Request, res: Response) => {
  const { userId } = req.headers;
  const { id } = req.params;
  const data = req.body;

  technologieExist(id, userId as string, res);

  const tech = serviceUpdateTechnologies(id, userId as string, data);
  return res.status(203).json(tech);
};

export const deleteTechnologies = (req: Request, res: Response) => {
  const { userId } = req.headers;
  const { id } = req.params;

  technologieExist(id, userId as string, res);
  serviceDeleteTechnologies(id, userId as string);

  return res.status(204).send();
};
