import { Schema,model } from "mongoose";


const commentSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  video: {
    type: Schema.Types.ObjectId,
    ref: "Video"
  },
  tweet: {
    type: Schema.Types.ObjectId,
    ref: "Tweet"
  }
},{timestamps:true});

const Comment = model("comment",commentSchema);

export default Comment;
