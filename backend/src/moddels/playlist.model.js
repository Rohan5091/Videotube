import { Schema,model } from "mongoose";


const playlistSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Video'
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  description: {
    type: String
  }
},{timestamps:true});

const Playlist = model("playlist",playlistSchema);

export default Playlist;
