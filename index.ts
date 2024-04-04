import express ,{Express,Request,Response} from "express";
import dotenv from "dotenv";
import cors from "cors";

import * as database from "./config/database";
import RouteVersion1 from "./api/v1/routes/index.route"
dotenv.config();

database.connect();

const app:Express= express();
const port:number|String = process.env.PORT || 3000;

// const corsOptions={
//   origin:"http://linl.com",
//   optionsSuccessStatus:200
// }
// app.use(cors(corsOptions));

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//Route
RouteVersion1(app);
//End Route
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});