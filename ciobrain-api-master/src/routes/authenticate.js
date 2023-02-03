import dotenv from 'dotenv';
import { Router } from "express"
dotenv.config();

const authenticateRouter = Router()

const checkAuth = (req, res, next) => {
    console.log(req.body)
    if (req.body.password === process.env.PASSWORD) {
        res.status(200).send('Success')
        return;
    }
    res.status(401).send('Not Authorized')
}

export const authenticate = (req, res, next) => {
    if (req.body.password === process.env.PASSWORD) {
        next();
        return;
    }
    res.status(401).json({ error: "Not authenticated" })
}

authenticateRouter.post('/', checkAuth)

export default authenticateRouter;