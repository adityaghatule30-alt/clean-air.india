// Supabase Edge Function: send-contact-email
// Deno TypeScript Function for secure contact message storage & Resend email notification
// Deploy command: supabase functions deploy send-contact-email --no-verify-jwt

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, topic, message, timestamp } = await req.json();

    // 2. Server-side Validation
    const cleanName = String(name || '').trim();
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanTopic = String(topic || 'Feedback').trim();
    const cleanMessage = String(message || '').trim();
    const submissionTime = timestamp || new Date().toISOString();

    if (!cleanName || cleanName.length < 2) {
      return new Response(
        JSON.stringify({ error: "Invalid name (minimum 2 characters required)." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address format." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      return new Response(
        JSON.stringify({ error: "Message must be at least 5 characters long." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Optional: Store in Supabase Database Table if credentials available
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase.from("contact_messages").insert([
          {
            name: cleanName,
            email: cleanEmail,
            topic: cleanTopic,
            message: cleanMessage,
            created_at: submissionTime,
          },
        ]);
      } catch (dbErr) {
        console.warn("Could not record message in Supabase database table:", dbErr);
      }
    }

    // 4. Send Email via Resend API
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL") || "openingtruth3107@gmail.com";
    const SENDER_EMAIL = Deno.env.get("SENDER_EMAIL") || "onboarding@resend.dev";

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not set in Supabase Secrets.");
      return new Response(
        JSON.stringify({
          success: true,
          mock: true,
          message: "Message received. Set RESEND_API_KEY in Supabase secrets to dispatch live emails."
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailSubject = `[CleanAir India] New Contact Message — ${cleanTopic}`;
    const emailBody = `New message received from CleanAir India.

Name: ${cleanName}
Email: ${cleanEmail}
Topic: ${cleanTopic}
Submitted: ${submissionTime}

Message:
${cleanMessage}
`;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `CleanAir India <${SENDER_EMAIL}>`,
        to: [NOTIFICATION_EMAIL],
        reply_to: cleanEmail, // Direct Reply button in Gmail
        subject: emailSubject,
        text: emailBody,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API delivery error:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to dispatch email via Resend.", details: errorText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await resendResponse.json();
    return new Response(
      JSON.stringify({
        success: true,
        id: data.id,
        message: "Message processed and notification email sent successfully.",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Supabase Edge Function error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
