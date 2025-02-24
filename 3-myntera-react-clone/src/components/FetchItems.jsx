import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatusActions } from "../store/fetchStatusSlice";
import { itemsActions } from "../store/itemsSlice";

const API_BASE_URL = "https://myntra--backend.vercel.app"; // ✅ Backend URL centralized

const FetchItems = () => {
  const fetchStatus = useSelector((store) => store.fetchStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    if (fetchStatus?.fetchDone) {
      console.log("🚀 Data already fetched, skipping API call.");
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        dispatch(fetchStatusActions.markFetchingStarted());

        const response = await fetch(`${API_BASE_URL}/api/items`, {
          headers: { "Content-Type": "application/json" },
          signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        console.log("📦 API Response:", data); // ✅ Debugging ke liye print karo

        // ✅ Fix: Check for both formats (array or object with "items" key)
        const itemsArray = Array.isArray(data) ? data : data.items;

        if (!Array.isArray(itemsArray)) {
          throw new Error("Invalid data format received from API");
        }

        dispatch(fetchStatusActions.markFetchDone());
        dispatch(fetchStatusActions.markFetchingFinished());
        dispatch(itemsActions.addInitialItems(itemsArray));

        console.log("✅ Data fetched successfully:", itemsArray);
      } catch (error) {
        if (error.name === "AbortError") {
          console.warn("⚠️ Fetch request was aborted.");
        } else {
          console.error("❌ Error fetching data:", error);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort(); // ✅ Cleanup fetch request
    };
  }, [fetchStatus?.fetchDone, dispatch]);

  return null;
};

export default FetchItems;
