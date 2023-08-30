const resolvers = {
  getMessage: ({ id }) => {
    return `Message from ${id}`;
  },
  setMessage: async (args) => {
    //db operation
    const fs = require("fs");
    const path = require("path");
    const {} = require("uuid");
    const filePath = path.join("store", "Text", "message.json");
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      if (data) {
        fs.writeFile(filePath, JSON.stringify(data), (err) => {
          if (err) throw err;
          console.log("ARGS", JSON.stringify(data));
        });
      }
    });
    return "New Message Saved";
  },
  updateMessage: ({ id, author, content }) => {
    //db operation
    return `updated Message from ${id} - ${author} => ${content}`;
  },
};

module.exports = resolvers;
