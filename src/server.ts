import app from "./app";
import serverless from "serverless-http";
//import { PORT } from "./constants";

//app.listen(PORT, () => console.log(`Listening on port ${PORT}`)); 
//module.exports.handler = serverless(app);
const handler = serverless(app);
module.exports.handler = async (event: any, context: any) => {
 return await handler(event, context);
};