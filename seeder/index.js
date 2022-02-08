const roomSeeder = require("./rooms");

require("../db/connection");

roomSeeder.run();

process.exitCode = 1;
