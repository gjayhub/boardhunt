import { supabase } from "@/utils/supabase";
import { create } from "zustand";

const useAdmin = create((set) => ({
  loading: null,
  pending: [],

  setPending: (pending) => set({ pending }),

  toggleAvailability: async (availability, id) => {
    const { data, error } = await supabase
      .from("boarding")
      .update({ is_available: !availability })
      .eq("id", id);

    if (error) {
      console.error("Error updating availability:", error);
    }
  },
  deleteBoarding: async (id) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("boarding")
      .delete()
      .eq("id", id);
    if (!error) {
      set({ loading: false });
      return { error };
    } else {
      console.error(error);
      return { error };
    }
  },

  getReservations: async (id) => {
    const { data, error } = await supabase
      .from("reservation_requests")
      .select(
        "id, profiles!request_by(contact,full_name),boarding!requested_boarding(images,title)"
      )
      .eq("reservation_status", "pending")
      .eq("boarding_owner", id);
    if (error) {
      console.log(error);
      return { error };
    } else {
      return { error, data };
    }
  },
  getPendingUpload: async (id) => {
    const { data, error } = await supabase
      .from("boarding")
      .select("id,title,details,images,ratings(rating)")
      .eq("upload_status", "pending")
      .eq("owner_id", id);
    if (error) {
      console.log(error);
      return { error };
    } else {
      const transformedData = data.map((item) => ({
        ...item,
        ratings: item.ratings.map((ratingObj) => ratingObj.rating),
      }));
      set({ pending: transformedData });
      return { data, error };
    }
  },
  getPendingUploadAdmin: async () => {
    const { data, error } = await supabase
      .from("boarding")
      .select("id,title,details,images,ratings(rating)")
      .eq("upload_status", "pending");

    if (error) {
      console.log(error);
      return { error };
    } else {
      const transformedData = data.map((item) => ({
        ...item,
        ratings: item.ratings.map((ratingObj) => ratingObj.rating),
      }));

      return { transformedData, error };
    }
  },
  getBoardingAdmin: async () => {
    try {
      const { data: boarding, error } = await supabase
        .from("boarding")
        .select(
          `id,title,images,
           ratings (rating)`
        )

        .neq("upload_status", "pending");

      if (error) {
        set({ loading: false });
        return { error };
      }

      const transformedBoarding = boarding.map((item) => ({
        ...item,
        ratings: item.ratings.map((ratingObj) => ratingObj.rating),
      }));

      return { transformedBoarding };
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useAdmin;
