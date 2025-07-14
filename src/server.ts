import express from 'express';
import config from '@/config';
import cors from 'cors';
import type { CorsOptions } from 'cors';
/**
 * Express app initial
*/
const app = express();

//Apply CORS middleware

const corsOptions: CorsOptions = {
    origin(origin, callback) {
    }
}

app.use(cors(corsOptions))

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World'
    })
})

app.listen(config.PORT, () => {
    console.log(`server running: http://localhost:${config.PORT}`)
})