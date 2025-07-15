import express from 'express';
import config from '@/config';
import cors from 'cors';
import type { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import limiter from '@/lib/express_rate_limit';
import v1Routes from '@/routes/v1/index';

/**
 * Express app initial
*/
const app = express();

//Apply CORS middleware
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.
            includes(origin)){
                callback(null, true)
            } else {
        callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false)
        console.log(`CORS error: ${origin} is not allowed by CORS`)
    }
    }
}
//Enable JSON request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression(
    {
        threshold: 1024
    }
));

app.use(helmet());

app.use(cors(corsOptions));
app.use(limiter);

(async () => {
    try {
        app.use('/api/v1',v1Routes)
    
        app.listen(config.PORT, () => {
            console.log(`server running: http://localhost:${config.PORT}`)
        })
    } catch (err){
        console.log('Failed to start the server', err)
    }

    if (config.NODE_ENV === 'production') {
        process.exit(1)
    }

})()


