/**
 * Shared contact-form contract.
 *
 * The site is a static export, so there is no Node runtime to host a Server
 * Action. The form posts to a PHP endpoint instead, which Hostinger runs
 * natively — see public/api/contact.php for the server half.
 */

/**
 * Endpoint the form posts to. Root-relative so it works on the production
 * domain, on a staging subdomain, and in a local preview without changes.
 */
export const CONTACT_ENDPOINT = "/api/contact.php";

export const INTERESTS = [
  { value: "oem", label: "OEM / manufacturer" },
  { value: "investor", label: "Investor" },
  { value: "press", label: "Press" },
  { value: "other", label: "Something else" },
] as const;

export type ContactField =
  | "name"
  | "organisation"
  | "email"
  | "interest"
  | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors keyed by input name. */
  errors?: Partial<Record<ContactField, string>>;
};

export const INITIAL_CONTACT_STATE: ContactState = {
  status: "idle",
  message: "",
};
