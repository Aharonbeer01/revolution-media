import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = request.nextUrl.searchParams.get("token");

  if (!id || !token) {
    return new NextResponse(htmlPage("Invalid Link", "The rejection link is missing required parameters."), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const supabase = createServiceRoleClient();

  // Fetch ambassador
  const { data: ambassador, error: fetchError } = await supabase
    .from("ambassadors")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !ambassador) {
    return new NextResponse(htmlPage("Not Found", "Ambassador application not found."), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Validate token
  if (ambassador.approval_token !== token) {
    return new NextResponse(htmlPage("Invalid Token", "The token is invalid."), {
      status: 403,
      headers: { "Content-Type": "text/html" },
    });
  }

  // Check status
  if (ambassador.status !== "pending") {
    return new NextResponse(
      htmlPage("Already Processed", `This application has already been ${ambassador.status}.`),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  }

  // Update status to rejected
  const { error: updateError } = await supabase
    .from("ambassadors")
    .update({ status: "rejected" })
    .eq("id", id);

  if (updateError) {
    console.error("[Reject Error]", updateError);
    return new NextResponse(htmlPage("Error", "Failed to reject the application. Please try again."), {
      status: 500,
      headers: { "Content-Type": "text/html" },
    });
  }

  return new NextResponse(
    htmlPage(
      "Application Rejected",
      `The application from ${ambassador.full_name} (${ambassador.email}) has been rejected. No invitation email was sent.`
    ),
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function htmlPage(title: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} | Revolution Media</title>
<style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#f5f5f5;}
.card{background:#fff;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,0.08);}
h1{color:#1A1A1A;font-size:24px;margin:0 0 16px;}p{color:#666;line-height:1.6;margin:0;}
</style></head>
<body><div class="card"><h1>${title}</h1><p>${message}</p></div></body>
</html>`;
}
