import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase server env is not configured" }, { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Missing admin session" }, { status: 401 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Invalid admin session" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile || !["owner", "staff"].includes(profile.role)) {
    return NextResponse.json({ error: "Admin permission required" }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No image file selected" }, { status: 400 });
  }

  const fileExt = file.name.split(".").pop() || "jpg";
  const safeExt = fileExt.replace(/[^a-z0-9]/gi, "").toLowerCase() || "jpg";
  const filePath = `${userData.user.id}/${Date.now()}-${crypto.randomUUID()}.${safeExt}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: false
  });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);

  return NextResponse.json({ url: data.publicUrl });
}
