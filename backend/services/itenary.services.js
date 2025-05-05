import openAi from 'openai';
import itineraryModel from '../models/itenary.model.js';

class ItineraryService {

    async travelPlan(req) {
        try {
            const { travelType, location, startDate, endDate, budget } = req.body;
            const client = new openAi({
                apiKey: process.env.DEEPSEEK_APIKEY,
                baseURL: "https://openrouter.ai/api/v1",
            });

            const response = await client.chat.completions.create({
                model: "deepseek/deepseek-r1:free",
                messages: [
                    {
                        role: "user",
                        content: `Create a travel itinerary for travel type ${travelType} for the location ${location} from date (${startDate} to date ${endDate},and budget of  $${budget}). Return JSON:
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
                    },
                ],
            });

            if (!response || !response.choices || !response.choices.length === 0) {
                let err = new Error("No response from OpenAI");
                err.statusCode = 500;
                throw err;
            }

            let content = response.choices[0].message.content;
            content = content
                .replace(/```json\n/g, "")
                .replace(/```/g, "")
                .trim();

            const jsonData = content? JSON.parse(content) : null;
            
            let payload = req.body;
            payload.itinerary = jsonData;
            let newTravelPlan = await this.saveItinerary(payload);

            return { message: "Success", data: jsonData};
            // return { message: "Success", data: jsonData, travelPlan: "newTravelPlan" };

        } catch (error) {
            throw error;
        }

    }

    async saveItinerary(payload) {
        let newTravelPlan = await itineraryModel.create(payload);
        if (newTravelPlan) {
            // console.log("Travel Plan is saved ", newTravelPlan);
            return "saved";
        } else {
            let error = new Error("Unable to save itinerary");
            error.statusCode = 400;
            throw err;
        }
    }

    async getAllItinerary() {
        let alltravelPlan = await itineraryModel.find();
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
}

export default new ItineraryService();