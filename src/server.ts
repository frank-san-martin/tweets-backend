import express, { urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { mainRouter } from './routes/main';

const server = express();

server.use(helmet());
server.use(cors());
server.use(urlencoded({ extended: true }));
server.use(express.json());

// rotas
server.use(mainRouter);


// inicializar servidor
server.listen(process.env.PORT || 3000, () => {
    console.log(`🔥🔥 Running at PORT ${process.env.BASE_URL}`);
});