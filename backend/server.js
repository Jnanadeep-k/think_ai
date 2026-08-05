require("dotenv").config();

const app = require("./app");
const initDatabase = require("./config/initDb");

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await initDatabase();

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to initialize database:", err);
    }
}

startServer();