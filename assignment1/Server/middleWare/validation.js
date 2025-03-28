import { validationResult } from 'express-validator';

function doValidation(req, res, next) {
    const result = validationResult(req);
    if (result.isEmpty()) {
        return next();
    }
    
    return res.status(400).json({
        errors: result.array().map(err => ({
            field: err.path,
            message: err.msg
        }))
    });
}

export function checkValidation(validationRules) {
    return [...validationRules, doValidation];
}