import { Schema,model } from "mongoose";

const tweetSchema = new Schema({
  content: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
  
},{timestamps:true});

const Tweet = model("tweet",tweetSchema);

export default Tweet;