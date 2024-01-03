import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://jxvseqprkejktgtrcolk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp4dnNlcXBya2Vqa3RndHJjb2xrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5OTQ3MTQsImV4cCI6MjAxOTU3MDcxNH0.WnXybZU3s4LNkI4lSB-wX4URgk7OBwpn4lGK_zGtKKY";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
