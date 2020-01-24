import * as express from "express";
import * as cors from "cors";
import { json, urlencoded } from "body-parser";

import AuthRouter from "./routes/auth";
import AccountsRouter from "./routes/accounts";
import PaymentRouter from "./routes/payment";

class App {

    public app;

    constructor () {
        this.init();
        this.mountRoutes();
    }

    private init(){
        this.app = express();
        this.app.use(json());
        this.app.use(urlencoded({
            extended: true
        }));
        this.app.use(function (req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
            next();
        });
        this.app.use(cors());
    }

    private mountRoutes (): void {
        this.app.get("/api", (request: express.Request, response: express.Response) => {
            response.json({
                name: "OPEN BANK API DEMO APP "
            })
        });

        this.app.use((err: Error & { status: number }, request: express.Request, response: express.Response, next: express.NextFunction): void => {
            response.status(err.status || 500);
            response.json({
                error: "Server error"
            })
        });

        this.app.use('/api/auth', AuthRouter.routes());
        this.app.use('/api/accounts', AccountsRouter.routes());
        this.app.use('/api/payment', PaymentRouter.routes());

    }
}

export default new App().app
