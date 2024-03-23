require("dotenv").config();
const app = require("./app");
const dbConnect = require("./config/db");

app.listen(process.env.PORT, async () => {
  console.log(`Server is running at : http://localhost:${process.env.PORT}`);
  await dbConnect();
});
