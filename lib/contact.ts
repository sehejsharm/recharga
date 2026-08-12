/**
 * Shared contact-form contract.
 *
 * Kept out of the "use server" module because every export from a Server
 * Actions file must itself be an async server function — constants and types
 * belong here so both the action and the client form can import them.
 */

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
