import { Request, Response } from "express";
import * as Yup from "yup";

import { getRepository } from "typeorm";
import Orphanage from "../models/Orphanage";

import orphanageView from "../views/orphanages_view";

export default {
  async index(req: Request, res: Response) {
    const orphanagesRepository = getRepository(Orphanage);

    // relations para indicar que há um relacionamento com a tabela imagens
    const orphanages = await orphanagesRepository.find({
      relations: ["images"],
    });

    return res.json(orphanageView.renderMany(orphanages));
  },
  async show(req: Request, res: Response) {
    const { id } = req.params;

    const orphanagesRepository = getRepository(Orphanage);

    // relations para indicar que há um relacionamento com a tabela imagens
    const orphanage = await orphanagesRepository.findOneOrFail(id, {
      relations: ["images"],
    });

    return res.json(orphanageView.render(orphanage));
  },
  async create(req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = req.body;

    const orphanagesRepository = getRepository(Orphanage);

    // O multer há algum problema que ao utilizar o envio de diversos arquivos, ele não entende que é um array, então necessita deste seguinte código para instruir que trata-se de
    const requestImages = req.files as Express.Multer.File[];
    const images = requestImages.map((image) => {
      return { path: image.filename };
    });

    // open_on_weekends convertendo para booleano
    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === "true",
      images,
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required(),
        })
      ),
    });
    // Abort Early retorna todos os erros
    await schema.validate(data, {
      abortEarly: false,
    });

    const orphanage = orphanagesRepository.create(data);

    await orphanagesRepository.save(orphanage);

    return res.json(orphanage);
  },
};
