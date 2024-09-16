import express, { request, response } from "express";
import "reflect-metadata";
import helmet from "helmet";
import { errorHandler } from "./Presentation/Middlewares/ExceptionHandlerMiddleware";
import { authMiddleware } from "./Presentation/Middlewares/AuthMiddleware";
import { openEndPoints } from "./Presentation/utility/openEndPointsResolver";
import config from "../config.json";
import cors, {CorsOptions} from "cors"
import masterRouter from "./Presentation/Routes/masterRoutes";


const PORT = process.env.PORT || 3000;

const app = express();

const corsOptions:CorsOptions = {
  credentials: true,
  origin: config.cors.allowedOrigions,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use(openEndPoints(config.endPoints.openEndPoints,authMiddleware));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "trusted-scripts.com"],
    },
  }),
  helmet.referrerPolicy({
    policy: "no-referrer",
  }),
  helmet.hsts({
    // 60 days
    maxAge: 86400,
    // removing the "includeSubDomains" option
    includeSubDomains: false,
  }),
  helmet({
    noSniff: false,
  }),
  helmet.frameguard({
    action: "deny",
  }),
  helmet({
    frameguard: false,
  })
);


app.use(express.json());

app.use(masterRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log("Listening to: ", PORT);
});