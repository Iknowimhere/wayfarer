
import itineraryModel from '../models/itenary.model.js';
import userModel from '../models/user.model.js';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";



class ItineraryService {

    async travelPlan(req) {
        try {
            const { travelType, location, startDate, endDate, budget } = req.body;
            
            let user=await userModel.findById(req.userId);

            if(!user.isSubscribed && user.itenaryCount>=2){
                let err = new Error("You have reached the limit of 2 itineraries. Please subscribe to create more itineraries.");
                err.statusCode = 403;
                throw err;
            }

            const client = new GoogleGenAI({
                apiKey: process.env.GEMINI_APIKEY,
            })

            const response = await client.models.generateContent({
                model: "gemini-2.0-flash",
                contents:  `Create a travel itinerary for travel type ${travelType} for the location ${location} from date (${startDate} to date ${endDate},and budget of  $${budget}). Return JSON:
                        {
                          "days": [{
                            "date": "YYYY-MM-DD",
                            "plan": ["activity/place 1", "activity/place 2"],
                            "cost": 0,
                            "tip": "daily tip"
                          }],
                          "total": {
                            "stay": 0,
                            "food": 0,
                            "travel": 0
                          },
                          "tips": ["general tip 1", "general tip 2"]
                        }`,
            })

            


            if (!response || !response.text) {
                let err = new Error("No response from Google GenAI");
                err.statusCode = 500;
                throw err;
            }

            let content = response.text;
            content = content
                .replace(/```json\n/g, "")
                .replace(/```/g, "")
                .trim();

            const jsonData = content? JSON.parse(content) : null;
            
            let payload = req.body;
            payload.itinerary = jsonData;
            if(req.userId){
                payload.userId = req.userId;
            }
            await this.saveItinerary(payload);
            // user.itenaryCount = user.itenaryCount + 1;
            // await user.save();
           await userModel.findByIdAndUpdate(req.userId, { $inc: { itenaryCount: 1 } });
            return { message: "Success", data: jsonData};

        } catch (error) {
            throw error;
        }

    }

    async saveItinerary(payload) {
        let newTravelPlan = await itineraryModel.create(payload);
        if (newTravelPlan) {
            return "saved";
        } else {
            let error = new Error("Unable to save itinerary");
            error.statusCode = 400;
            throw err;
        }
    }

    async getAllItinerary(req) {
        let alltravelPlan = await itineraryModel.find({userId: req.userId})
        // .populate("userId", "name email displayPicture");
        // console.log(alltravelPlan);
        
        if (alltravelPlan) {
            return alltravelPlan;
        } else {
            let err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }
    async deleteItinerary(id) {
        let deletedTravelPlan = await itineraryModel.findByIdAndDelete(id);
        if (deletedTravelPlan) {
            return deletedTravelPlan;
        } else {
            let err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }

    async getAutocomplete(req) {
       let { location } = req.query;
        
       const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input: location,
        key: process.env.GOOGLE_API,
      },
    });
    return response.data.predictions.map((prediction) => prediction.description);
    }
    async getItineraryById(id) {
        let itinerary = await itineraryModel.findById(id);
        if (itinerary) {
            return itinerary;
        } else {
            let err = new Error("Travel Plans not found");
            err.statusCode = 404;
            throw err;
        }
    }
}

export default new ItineraryService();