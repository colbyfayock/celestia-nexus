import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { ErrorSchema } from './error';

import locations from '../data/locations.json';

const app = new OpenAPIHono();

const ParamsSchema = z.object({
  id: z
    .string()
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1',
    }),
});

const LocationsSchema = z
  .object({
    id: z.string().openapi({
      example: '1'
    }),
    name: z.string().openapi({
      example: 'Astra Prime',
    }),
    description: z.string().openapi({
      example: 'Cosmic crossroads',
    }),
    terrain_type: z.string().openapi({
      example: 'Space station',
    }),
    climate: z.string().openapi({
      example: 'Controlled',
    }),
    population: z.string().openapi({
      example: 'Diverse'
    }),
  })
  .openapi('Locations');

const route = createRoute({
  method: 'get',
  path: '/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: LocationsSchema,
        },
      },
      description: 'Retrieve the location',
    },
    404: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Unknown Error'
    }
  },
});

app.openapi(route, (c) => {
  const { id } = c.req.valid('param');
  const person = locations.find((person) => person.id === id);

  if ( !person ) {
    return c.json({
      error: `Can not find location of ID ${id}`
    }, 404);
  }
  return c.json(person)
});

export default app;