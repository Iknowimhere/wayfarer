
import itineraryService from "../services/itenary.services.js";

class ItineraryController{

    async travelPlan(req,res,next){

        let travelPlan = await itineraryService.travelPlan(req);
        // console.log("hello");
        
        res.status(200).json(travelPlan);
    }

    async getAllItinerary(req,res,next){
        let alltravelPlan = await itineraryService.getAllItinerary();
        res.status(200).json(alltravelPlan);
    }
    async deleteItinerary(req,res,next){
        await itineraryService.deleteItinerary(req.params.id);
        res.sendStatus(204)
    }


    async getAutocomplete(req,res,next){
        let autocomplete = await itineraryService.getAutocomplete(req);
        if (!autocomplete) {
            res.status(404).json({ message: "No data found" });
            return;
        }
        res.status(200).json(autocomplete);
    }
}

export default new ItineraryController();
