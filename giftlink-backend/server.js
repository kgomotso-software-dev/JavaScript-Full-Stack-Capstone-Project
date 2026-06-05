const app = require("./app");
const logger = require("./logger");

const port = 3060;

app.listen(port, "0.0.0.0", () => {
    logger.info(`Server running on port ${port}`);
});