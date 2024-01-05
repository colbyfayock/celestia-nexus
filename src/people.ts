import { z, createRoute, OpenAPIHono } from '@hono/zod-openapi';

import { ErrorSchema } from './error';

import people from '../data/people.json';

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

const PeopleSchema = z
  .object({
    id: z.string().openapi({
      example: '1'
    }),
    name: z.string().openapi({
      example: 'Captain Alex Mercer'
    }),
    location: z.string().openapi({
      example: '1'
    }),
    species: z.string().openapi({
      example: '1'
    }),
    height: z.string().openapi({
      example: '1.8 meters'
    }),
    weight: z.string().openapi({
      example: '75 kilograms'
    }),
    skin_color: z.string().openapi({
      example: 'Tan'
    }),
    hair_color: z.string().openapi({
      example: 'Brown'
    }),
    birth_year: z.string().openapi({
      example: '2230'
    }),
  })
  .openapi('People');

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
          schema: PeopleSchema,
        },
      },
      description: 'Retrieve the person',
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
  const currentPerson = people.find((person) => person.id === id);

  if ( !currentPerson ) {
    return c.json({
      error: `Can not find person of ID ${id}`
    }, 404);
  }
  return c.json(currentPerson)
});

export default app;