const URL = process.env.MONGODB_URI,
  mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
console.log("connecting to", URL);
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { String, minlength: 3, required: true },
  number: { String, minlength: 8, required: true },
});
personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
