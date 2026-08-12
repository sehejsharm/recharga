"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { INTERESTS, type ContactState } from "@/lib/contact";
import { rateLimit } from "@/lib/rate-limit";
import { company } from "@/lib/site";

/**
 * Contact form Server Action.
 *
 * Secrets stay server-side: RESEND_API_KEY is read here and never reaches the
 * client bundle. Validation is re-run on the server regardless of what the
 * browser did, and nothing the sender supplies is ever rendered as HTML.
 */

const INTEREST_VALUES: string[] = INTERESTS.map((i) => i.value);

const LIMITS = {
  name: 120,
  organisation: 160,
  email: 254,
  message: 4000,
} as const;

// Intentionally permissive: the goal is to catch typos, not to police the RFC.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

const SUCCESS_MESSAGE =
  "Thank you — your message is with us. We read every enquiry and will reply personally.";

const clean = (value: FormDataEntryValue | null) =>
  typeof value === "string" ? value.trim() : "";

/** Strips control characters so nothing can forge headers in the email. */
const safeLine = (value: string) => value.replace(/[\r\n\t]+/g, " ").trim();

export async function submitContact(
  _prevState: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: a real person never fills a hidden field. Return the success
  // shape so a bot cannot tell it was caught.
  if (clean(formData.get("website"))) {
    return { status: "success", message: SUCCESS_MESSAGE };
  }

  const name = clean(formData.get("name"));
  const organisation = clean(formData.get("organisation"));
  const email = clean(formData.get("email"));
  const interest = clean(formData.get("interest"));
  const message = clean(formData.get("message"));

  const errors: ContactState["errors"] = {};

  if (name.length < 2) errors.name = "Please tell us your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is too long.";

  if (organisation.length > LIMITS.organisation)
    errors.organisation = "That organisation name is too long.";

  if (!EMAIL_RE.test(email) || email.length > LIMITS.email)
    errors.email = "Please enter a valid email address.";

  if (!INTEREST_VALUES.includes(interest))
    errors.interest = "Please choose the option that fits best.";

  if (message.length < 10)
    errors.message = "A sentence or two of context helps us reply well.";
  else if (message.length > LIMITS.message)
    errors.message = "Please keep this under 4,000 characters.";

  if (Object.keys(errors).length > 0) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      errors,
    };
  }

  // Rate limit per client IP: 5 messages per 10 minutes.
  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerList.get("x-real-ip") ||
    "unknown";

  const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!limit.ok) {
    return {
      status: "error",
      message:
        "That's a few messages in quick succession — please try again shortly.",
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? company.email;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Never pretend a message was delivered when it was not.
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] Email transport not configured. Submission:", {
        name,
        organisation,
        email,
        interest,
        messageLength: message.length,
      });
      return {
        status: "success",
        message: `${SUCCESS_MESSAGE} (Development mode: logged to the server console, not emailed.)`,
      };
    }

    console.error(
      "[contact] Missing RESEND_API_KEY, CONTACT_TO_EMAIL or CONTACT_FROM_EMAIL.",
    );
    return {
      status: "error",
      message:
        "Our contact system is temporarily unavailable. Please try again shortly.",
    };
  }

  const interestLabel =
    INTERESTS.find((i) => i.value === interest)?.label ?? interest;

  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email,
      subject: `Recharga Chargine enquiry — ${safeLine(name)}${
        organisation ? ` (${safeLine(organisation)})` : ""
      } · ${interestLabel}`,
      // Plain text only: nothing the sender typed is ever rendered as HTML.
      text: [
        `Name:         ${safeLine(name)}`,
        `Organisation: ${safeLine(organisation) || "—"}`,
        `Email:        ${safeLine(email)}`,
        `Interest:     ${interestLabel}`,
        "",
        "Message:",
        message,
        "",
        "—",
        `Sent from the ${company.shortName} website contact form.`,
      ].join("\n"),
    });

    if (error) {
      console.error("[contact] Resend rejected the message:", error);
      return {
        status: "error",
        message:
          "We couldn't send that just now. Please try again in a moment.",
      };
    }
  } catch (cause) {
    console.error("[contact] Unexpected failure sending message:", cause);
    return {
      status: "error",
      message: "We couldn't send that just now. Please try again in a moment.",
    };
  }

  return { status: "success", message: SUCCESS_MESSAGE };
}
