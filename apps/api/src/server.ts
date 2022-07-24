import * as cors from 'cors';
import * as env from 'env-var';
import * as express from 'express';
import { createServer } from 'http';
import { createLightship } from 'lightship';
import { Server, ServerOptions } from 'socket.io';

import { ReceiptRepository } from './app/domain/recipe/receipt.repository';
import createReceiptHandlers from './app/domain/recipe/recipt.handlers';
import authAPI from './app/domain/user/auth.api';
import { UserRepository } from './app/domain/user/user.repository';
import { authHandler } from './app/handler/auth.handler';
import { ClientEvents, ServerEvents } from './events';

export interface Components {
  receiptRepository: ReceiptRepository;
  userRepository: UserRepository;
}

const PORT = env.get('PORT').default('3000').required().asIntPositive();

export default async function server(
  components: Components,
  serverOptions: Partial<ServerOptions> = {}
) {
  console.log('start api');
  const app = express();
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json({ strict: true }));
  app.use(cors({ origin: ['http://localhost:4200'] }));

  const httpServer = createServer(app);
  const io = new Server<ClientEvents, ServerEvents>(httpServer, serverOptions);

  app.use('/login', authAPI(components.userRepository));

  app.use('/', (_req, res) => {
    res.json({
      name: 'kookaburra.api',
      version: process.env.COMMIT_HASH,
    });
  });

  io.use(authHandler);

  const { listReceipt } = createReceiptHandlers(components);

  io.on('connection', (socket) => {
    socket.on('recipt:list', listReceipt);
  });

  const lightship = await createLightship();

  httpServer
    .listen(PORT, () => {
      console.log(`server startet on localhost:${PORT}`);
      lightship.signalReady();
    })
    .on('error', () => lightship.shutdown());

  lightship.registerShutdownHandler(() => {
    httpServer.close();
  });
}
