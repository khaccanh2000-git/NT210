const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  info: { type: String },
  color: { type: String },
  price: { type: Number },
  quantity: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
  imageType: { type: String },
  imageData: { type: Buffer },
});

productSchema.virtual("imageSrc").get(function () {
  if (this.imageType != null && this.imageData != null)
    return `data:${
      this.imageType
    };charset=utf-8;base64,${this.imageData.toString("base64")}`;
});
module.exports = mongoose.model("product", productSchema);
