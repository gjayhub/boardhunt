// useStore.js
import { create } from "zustand";
import { supabase } from "../utils/supabase"; // Adjust the import path as needed

const useStore = create((set) => ({
  session: null,
  userProfile: null,
  loading: false,
  toggleFavoriteLoading: null,
  previewBoarding: [],
  previewSuggestion: null,
  boardingDetails: null,
  searchResult: null,
  favorites: [],
  searchQuery: "",
  isReserved: null,
  userPreference: null,
  isAvailable: null,
  ratings: [],
  setRatings: (ratings) => set({ ratings }),

  filters: {
    location: "",
    price: { lowest: "", highest: "" },
    type: "",
    tags: "",
  },
  setIsAvailable: (isAvailable) => set({ isAvailable }),
  setBoardingDetails: (boardingDetails) => set({ boardingDetails }),
  setUserPreference: (userPreference) => set({ userPreference }),
  setIsReserved: (isReserved) => set({ isReserved }),
  setSearchResult: (searchResult) => set({ searchResult }),
  setFilters: (filters) => set({ filters }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setLoading: (loading) => set({ loading }),
  setSession: (session) => set({ session }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setPreviewBoarding: (previewBoarding) => set({ previewBoarding }),

  signIn: async (email, password) => {
    set({ loading: true });
    const response = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    const {
      error,
      data: { session },
    } = response || {};

    if (error) {
      set({ loading: false });
      return { error };
    }

    if (session) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (profileError) {
        set({ loading: false });
        return { error: profileError };
      }

      set({ session, userProfile: profile, loading: false });
      return { session, profile };
    }

    set({ loading: false });
  },

  signUp: async (email, password, fullname, number, role) => {
    set({ loading: true });
    const response = await supabase.auth.signUp({
      email,
      password,
    });

    const { data, error } = response || {};

    if (error) {
      set({ loading: false });
      return { error };
    }

    if (data && data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullname,
        contact_number: number,
        role: role,
        email,
      });

      if (profileError) {
        set({ loading: false });
        return { error: profileError };
      }

      set({
        session: data.user,
        userProfile: { full_name: fullname, contact_number: number, role },
        loading: false,
      });
      return { session: data.user };
    }

    set({ loading: false });
  },

  signOut: async () => {
    set({ loading: true });
    const { error } = await supabase.auth.signOut();

    if (error) {
      set({ loading: false });
      return { error };
    }

    set({ session: null, userProfile: null, loading: false });
  },

  getBoarding: async (id) => {
    set({ loading: true });
    try {
      const { data: boarding, error } = await supabase
        .from("boarding")
        .select(
          `id,title,images,
           ratings (rating)`
        )
        .eq("owner_id", id)
        .neq("upload_status", "pending");

      if (error) {
        set({ loading: false });
        return { error };
      }

      const transformedBoarding = boarding.map((item) => ({
        ...item,
        ratings: item.ratings.map((ratingObj) => ratingObj.rating),
      }));

      set({ previewBoarding: transformedBoarding, loading: false });
    } catch (error) {
      // console.log(error);
    }
  },
  getSuggestions: async (preference) => {
    set({ loading: true });

    const { data: boarding, error } = await supabase
      .from("boarding")
      .select(
        `id,title,images,
    ratings (rating)`
      )
      .or(
        `tags.cs.{${preference?.tags}},location.eq.${preference?.location},type.eq.${preference?.type}`
      )
      .neq("upload_status", "pending");

    if (error) {
      console.error("Error fetching data:", error);
    } else {
      // Transform the ratings into a flat array of values
    }

    if (error) {
      set({ loading: false });
      return { error };
    }

    // Check if the result is less than 10
    if (boarding.length < 10) {
      // Fetch backup data
      const { data: backupData, error: backupError } = await supabase
        .from("boarding")
        .select("id, title, images, ratings(rating)")
        .limit(5);

      // Handle backup data error
      if (backupError) {
        set({ loading: false });
        return { error: backupError };
      }

      // Combine primary data with backup data
      const combinedData = [...boarding, ...backupData];

      // Filter out duplicates
      const uniqueData = Array.from(
        new Set(combinedData.map((item) => item.id))
      ).map((id) => combinedData.find((item) => item.id === id));

      const transformedBoarding = uniqueData.map((item) => ({
        ...item,
        ratings: item.ratings.map((ratingObj) => ratingObj.rating),
      }));

      set({ previewSuggestion: transformedBoarding, loading: false });
    } else {
      set({ previewSuggestion: boarding, loading: false });
    }
  },
  searchBoarding: async (search) => {
    const { data: searchResult, error } = await supabase
      .from("boarding")
      .select("id,title,images,ratings(rating)")
      .textSearch("fts", search, {
        type: "plain",
        config: "english",
      })
      .neq("upload_status", "pending");
    if (error) {
      return { error };
    }
    const transformedData = searchResult.map((item) => ({
      ...item,
      ratings: item.ratings.map((ratingObj) => ratingObj.rating),
    }));
    set({ searchResult: transformedData });
    return { transformedData };
  },
  searchWithFilter: async (search, range) => {
    let highest = range?.highest;
    if (range?.highest === "Above") {
      highest = 100000;
    }
    let query = supabase
      .from("boarding")
      .select("id,title,images,ratings(rating)")
      .textSearch("fts", search, {
        type: "plain",
        config: "english",
      })
      .neq("upload_status", "pending");

    if (range && range.lowest !== undefined) {
      query = query.gte("price", `${range.lowest}`);
    }
    if (highest && highest !== undefined) {
      query = query.lte("price", `${highest}`);
    }

    const { data: searchResult, error } = await query;

    if (error) {
      console.log(error);
      return { error };
    }

    const transformedData = searchResult.map((item) => ({
      ...item,
      ratings: item.ratings.map((ratingObj) => ratingObj.rating),
    }));

    set({ searchResult: transformedData });

    return { transformedData };
  },

  chechReservation: async (boardingId, profileId) => {
    const { data: resevation, error } = await supabase
      .from("reservation_requests")
      .select("id,reservation_status")
      .eq("requested_boarding", boardingId)
      .eq("request_by", profileId)
      .single();

    if (error && error.code !== "PGRST116") {
      set({ isReserved: null });
      return { error };
    } else {
      set({ isReserved: resevation });
    }
  },
  checkRating: async (boardingId) => {
    const { data, error } = await supabase
      .from("ratings")
      .select("rating")
      .eq("boarding_id", boardingId);
    if (error) {
      console.error("Error fetching ratings:", error);
      return { data: [] }; // Return an empty array in case of error
    }

    const ratings = data.map((item) => item.rating);
    return { data: ratings };
  },

  getBoardingDetails: async (boardingId, profileId) => {
    set({ loading: true });

    // Fetch boarding details
    const { data: boardingDetails, error: boardingError } = await supabase
      .from("boarding")
      .select("*, profiles(full_name, contact),ratings(rating)")
      .eq("id", boardingId)
      .single();
    const transformedBoarding = {
      ...boardingDetails,
      ratings: boardingDetails.ratings.map((ratingObj) => ratingObj.rating),
    };

    if (boardingError) {
      set({ loading: false });
      return { error: boardingError };
    }

    // Check if the boarding is a favorite for the user
    const { data: favorite, error: favoriteError } = await supabase
      .from("favorites")
      .select("*")
      .eq("boarding_id", boardingId)
      .eq("profile_id", profileId)
      .single();

    if (favoriteError && favoriteError.code !== "PGRST116") {
      // PGRST116: no matching rows found
      set({ loading: false });
      return { error: favoriteError };
    }

    set({
      boardingDetails: transformedBoarding,
      isFavorite: !!favorite, // Convert the result to a boolean
      loading: false,
      error: null,
      isAvailable: boardingDetails.is_available,
      ratings: transformedBoarding.ratings,
    });
  },

  toggleFavorite: async (boardingId, profileId, isFavorite) => {
    let error = null;

    if (isFavorite) {
      // Remove from favorites
      const { error: removeError } = await supabase
        .from("favorites")
        .delete()
        .eq("boarding_id", boardingId)
        .eq("profile_id", profileId);
      error = removeError;
    } else {
      // Add to favorites
      const { error: addError } = await supabase
        .from("favorites")
        .insert({ boarding_id: boardingId, profile_id: profileId });
      error = addError;
    }

    if (!error) {
      set((state) => ({ isFavorite: !state.isFavorite }));
    }

    return { error };
  },
  getFavorites: async (id) => {
    set({ toggleFavoriteLoading: true });
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select(
        "id,boarding(id,title,details,price,images,profiles(full_name,contact),ratings(rating))"
      )
      .eq("profile_id", id);

    if (error) {
      set({ loading: false });
      return { error };
    }

    const favoritesPrev = favorites.map((item) => item.boarding);
    const transformedData = favoritesPrev.map((item) => ({
      ...item,
      ratings: item.ratings.map((ratingObj) => ratingObj.rating),
    }));

    set({ favorites: transformedData, toggleFavoriteLoading: false });
  },
}));

export default useStore;
