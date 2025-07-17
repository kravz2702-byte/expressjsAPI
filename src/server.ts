/**
 * Import modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
/**
 * Custom modules
 */
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, diconnectFromDatabase } from '@/lib/mongoose';

/**
 * Router
 */
import v1Routes from '@/routes/v1/index';

/**
 * Types 
 */
import type { CorsOptions } from 'cors';

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
        await connectToDatabase()
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


const handleServerShutdown = async () => {
    try{
        await diconnectFromDatabase()
        console.log('server SHUTDOWN')
        process.exit(0);
    } catch (err) {
        console.log('Error during server SHUTDOWN', err)
    }
}
process.on('SIGTERM', handleServerShutdown)
process.on('SIGINT', handleServerShutdown)