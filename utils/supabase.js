import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://obnefrejjzeohcpycsos.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibmVmcmVqanplb2hjcHljc29zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTYwMTE1NjQsImV4cCI6MjAzMTU4NzU2NH0.30IDDtgPEt38ShDBlbLHnSGuBtgsAhw4FNwOiPKT7qA";
const servicerole =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibmVmcmVqanplb2hjcHljc29zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNjAxMTU2NCwiZXhwIjoyMDMxNTg3NTY0fQ.Nz2oBfWHzSPskRKEYNDsUjHKZOazE1H4UA1dybX44Pc";
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const supabaseAdmin = createClient(supabaseUrl, servicerole);
