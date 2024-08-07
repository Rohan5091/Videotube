import { Schema, model } from "mongoose";


const videoSchema = new Schema({
  vodeoFile: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  views: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const Video = model("Video", videoSchema);

export default Video;

