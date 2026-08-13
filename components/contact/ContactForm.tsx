"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconArrowRight } from "@/components/graphics/Icons";
import {
  CONTACT_ENDPOINT,
  INITIAL_CONTACT_STATE,
  INTERESTS,
  type ContactState,
} from "@/lib/contact";

export function ContactForm() {
  const [state, setState] = useState<ContactState>(INITIAL_CONTACT_STATE);
  const [pending, setPending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const uid = useId();

  // Move focus to the confirmation so the outcome is announced rather than
  // silently appearing somewhere below the button.
  useEffect(() => {
    if (state.status === "success") statusRef.current?.focus();
  }, [state.status]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    const form = event.currentTarget;
    setPending(true);
    setState(INITIAL_CONTACT_STATE);

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(new FormData(form).entries()),
        ),
      });

      // A non-JSON body means the endpoint is missing or misconfigured —
      // never report success in that case.
      let result: ContactState | null = null;
      try {
        result = (await response.json()) as ContactState;
      } catch {
        result = null;
      }

      if (result && typeof result.message === "string") {
        setState(result);
        if (result.status === "success") form.reset();
      } else {
        setState({
          status: "error",
          message:
            "We couldn't send that just now. Please email admin@rechargachargine.com directly.",
        });
      }
    } catch {
      setState({
        status: "error",
        message:
          "That didn't send — please check your connection, or email admin@rechargachargine.com directly.",
      });
    } finally {
      setPending(false);
    }
  }

  const fieldId = (name: string) => `${uid}-${name}`;
  const errorId = (name: string) => `${uid}-${name}-error`;
  const describedBy = (name: keyof NonNullable<ContactState["errors"]>) =>
    state.errors?.[name] ? errorId(name) : undefined;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      action={CONTACT_ENDPOINT}
      method="post"
      noValidate
      className="space-y-6"
    >
      {/* Honeypot. Hidden from people and from assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={fieldId("website")}>
          Website (leave this field empty)
        </label>
        <input
          id={fieldId("website")}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor={fieldId("name")} className="field-label">
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            id={fieldId("name")}
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={describedBy("name")}
            className="field"
          />
          <FieldError id={errorId("name")} message={state.errors?.name} />
        </div>

        <div>
          <label htmlFor={fieldId("organisation")} className="field-label">
            Organisation
          </label>
          <input
            id={fieldId("organisation")}
            name="organisation"
            type="text"
            maxLength={160}
            autoComplete="organization"
            placeholder="Company or institution"
            aria-invalid={Boolean(state.errors?.organisation)}
            aria-describedby={describedBy("organisation")}
            className="field"
          />
          <FieldError
            id={errorId("organisation")}
            message={state.errors?.organisation}
          />
        </div>
      </div>

      <div>
        <label htmlFor={fieldId("email")} className="field-label">
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id={fieldId("email")}
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@company.com"
          aria-invalid={Boolean(state.errors?.email)}
          aria-describedby={describedBy("email")}
          className="field"
        />
        <FieldError id={errorId("email")} message={state.errors?.email} />
      </div>

      <fieldset>
        <legend className="field-label">
          I&rsquo;m getting in touch as <span aria-hidden="true">*</span>
        </legend>
        <div
          className="grid gap-3 sm:grid-cols-2"
          aria-describedby={describedBy("interest")}
        >
          {INTERESTS.map((option, i) => (
            <label
              key={option.value}
              className="group flex cursor-pointer items-center gap-3 rounded-lg border border-hairline bg-abyss px-4 py-3 text-sm text-ink-2 transition-colors duration-300 hover:border-brand/40 has-checked:border-brand/60 has-checked:text-ink has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
            >
              <input
                type="radio"
                name="interest"
                value={option.value}
                defaultChecked={i === 0}
                className="sr-only"
              />
              {/* Styled from the label's :has() state, so the dot tracks the
                  real radio without depending on sibling order. */}
              <span
                aria-hidden="true"
                className="flex h-4 w-4 flex-none items-center justify-center rounded-full border border-ink-3 transition-colors duration-300 group-has-checked:border-brand"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand opacity-0 transition-opacity duration-300 group-has-checked:opacity-100" />
              </span>
              {option.label}
            </label>
          ))}
        </div>
        <FieldError id={errorId("interest")} message={state.errors?.interest} />
      </fieldset>

      <div>
        <label htmlFor={fieldId("message")} className="field-label">
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={fieldId("message")}
          name="message"
          required
          rows={6}
          maxLength={4000}
          placeholder="What would you like to discuss?"
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={describedBy("message")}
          className="field resize-y"
        />
        <FieldError id={errorId("message")} message={state.errors?.message} />
      </div>

      <div className="flex flex-col gap-5 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary group w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Sending…" : "Send message"}
          {!pending && (
            <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          )}
        </button>
        <p className="max-w-xs text-xs leading-relaxed text-ink-3">
          We use your details only to reply to this enquiry. We don&rsquo;t sell
          them, and we don&rsquo;t add you to a mailing list.
        </p>
      </div>

      {/* Single live region for the overall outcome. */}
      <p
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={`text-sm leading-relaxed ${
          state.status === "success"
            ? "text-brand"
            : state.status === "error"
              ? "text-[#FF6B6B]"
              : "sr-only"
        }`}
      >
        {state.message}
      </p>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-xs text-[#FF6B6B]">
      {message}
    </p>
  );
}
