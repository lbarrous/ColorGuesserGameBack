import app from "./app";
import serverless from "serverless-http";
import { PORT } from "./constants";

app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); 
module.exports.handler = serverless(app);