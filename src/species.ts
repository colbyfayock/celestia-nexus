import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { ErrorSchema } from './error';

import species from '../data/species.json';

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

const SpeciesSchema = z
  .object({
    id: z.string().openapi({
      example: '1'
    }),
    homeworld: z.string().openapi({
      example: '1',
    }),
    classification: z.string().openapi({
      example: 'Sentient',
    }),
    designation: z.string().openapi({
      example: 'Bipedal',
    }),
    language: z.string().openapi({
      example: 'Terran'
    }),
    
  })
  .openapi('Species');

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
          schema: SpeciesSchema,
        },
      },
      description: 'Retrieve the species',
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
  const currentSpecies = species.find((species) => species.id === id);

  if ( !currentSpecies ) {
    return c.json({
      error: `Can not find species of ID ${id}`
    }, 404);
  }
  return c.json(currentSpecies)
});

export default app;