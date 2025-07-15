import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 60000, // 1-minute time window for request limiting
    limit: 60, // Allow a maximum 60  requests per winodow per IP
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error: 'You have sent too many requests in a given amount of time. Please try again later',
    },
});

export default limiter