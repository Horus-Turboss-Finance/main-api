import { ResponseException } from './responseException';
import { catchSync } from './catchError';

/**
 * Middleware global qui vérifie si la requête possède le header content type application/json lors d'une requête post put et patch.
 *
 * @returns Middleware Express
 */
export const validateContentType = catchSync(async (req, res, next) => {
    const contentType = req.headers['content-type'];

    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!contentType || !contentType.includes('application/json')) {
            throw ResponseException("Expected application/json content-type").UnsupportedMediaType();
        }
    }

    next();
});