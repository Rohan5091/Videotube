import { Schema,model } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  channel: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
},{timestamps:true});

const Subscription = model("subscription",subscriptionSchema);

export default Subscription;