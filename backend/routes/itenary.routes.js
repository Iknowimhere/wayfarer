import express from 'express';
import itineraryController from '../controllers/itenary.controllers.js';
import validateSchema from '../middlewares/validate.js';
import itinerarySchema from '../validators/itenary.validator.js';
import auth from '../middlewares/auth.js';

const itineraryRouter = express.Router();

itineraryRouter.post("/",auth,validateSchema(itinerarySchema),itineraryController.travelPlan);
itineraryRouter.get("/",auth,itineraryController.getAllItinerary);
itineraryRouter.delete("/:id",auth,itineraryController.deleteItinerary);

export default itineraryRouter;