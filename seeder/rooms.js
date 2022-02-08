const Room = require("../schemas/room");
const rooms = require("./data").rooms

exports.run = () => {
  try {
    console.log("[STARTED] Seeding Rooms Data");
    rooms.map(async (room) => {
      await (new Room(room)).save()
    })
    console.log("[FINISH] Seeding Rooms Data");
  } catch (error) {
    console.log(error.message);
  }
}
