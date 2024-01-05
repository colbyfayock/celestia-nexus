import { OpenAPIHono } from '@hono/zod-openapi';

import people from './people';
import species from './species';

const app = new OpenAPIHono();

app.route('/people', people);
app.route('/species', species);

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Celestia Nexus',
  },
});

export default app
