import e, { Request, Response } from 'express';
import knex from '../database/connection';

import serializedPoint from '../utils/serializedPoints'

class PointsController {
    async index(req: Request, res: Response){
        const { city, uf, items } = req.query;
        
        const parsedItems = String(items)
            .split(',')
            .map(item => Number(item.trim()));

        const points = await knex('points')
            .join('point_items', 'points.id', '=', 'point_items.point_id')
            .whereIn('point_items.item_id', parsedItems)
            .where('city', String(city))
            .where('uf', String(uf))
            .distinct()
            .select('points.*');

        //Retorna todos os dados caso nao tenha params ou query
        if(items === undefined){
            const points = await knex('points')
            const serializedResult = serializedPoint(points)
            return res.status(200).json(serializedResult)
            
        }else{
            const serializedResult = serializedPoint(points)
            return res.status(200).json(serializedResult)
        }
        
    }
    async show(req: Request, res: Response) {
        const { id } = req.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return res.status(400).json({ Message: 'Point not found' });
        }

        const serializedPoint = {
               ...point,
                image_url: `http://192.168.0.107:3333/uploads/${point.image}`
            }

        const items = await knex.raw(`SELECT title FROM items
                                        JOIN point_items ON items.id = point_items.item_id
                                      WHERE point_items.point_id = ${id}`)

        /*  const items = await knex('items')
                .join('point_items', 'items.id', '=', 'point_items.item_id')
                .where('point_items.point_id', id);
        */
        return res.status(200).json({ point: serializedPoint, items });

    }
    async create(req: Request, res: Response) {
        let {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = req.body;

        // const trx = await knex.transaction();
        try {
            await knex.transaction(async trx => {
                const point = {
                    image: req.file.filename,
                    name,
                    email,
                    whatsapp,
                    latitude,
                    longitude,
                    city,
                    uf
                }

                const insertedIds = await trx('points').insert(point);

                const point_id = insertedIds[0];

                const pointItems = items
                .split(',')
                .map((item: string) => Number(item.trim()))
                .map((item_id: number) => {
                    return {
                        item_id,
                        point_id
                    }
                });
                await trx('point_items').insert(pointItems)
                return res.json({
                    id: point_id,
                    ...point
                });
            });
        } catch (error) {
             console.error(error)
            return res.status(400).json({ Message: "Unable to add point" });
        }
    }
}

export default PointsController;