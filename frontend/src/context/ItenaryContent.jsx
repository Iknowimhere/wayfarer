import { useContext,createContext,useEffect,useState } from "react";
import useAuth from "./AuthContext";
import axios from "../utils/axios";


const ItineraryContext = createContext();


export const ItineraryProvider = ({ children }) => {

    const { token } = useAuth();
    const [itineraries, setItineraries] = useState([]);
    

    const fetchItinaries = async () => {
        try {
            const response = await axios.get("/itineraries", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItineraries([...response.data]);
        } catch (error) {
            console.error("Error fetching itineraries:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchItinaries();
        }
    }, [token]);

    return (
        <ItineraryContext.Provider value={{ itineraries, setItineraries }}>
            {children}
        </ItineraryContext.Provider>
    );
}
export default function useItinerary() {
    return useContext(ItineraryContext);
}