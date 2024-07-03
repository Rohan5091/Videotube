
import { Router } from "express";
import { getAllChannels, getAllSubscriber, subscribe } from "../controllers/subscription.controller.js";

const subscriptionRoute=Router();

subscriptionRoute.post("/subscribe",subscribe);
subscriptionRoute.get("/subscriber",getAllSubscriber);
subscriptionRoute.get("/channel",getAllChannels);


export default subscriptionRoute;