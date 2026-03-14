import type { ProjectInput } from "@/types/project";

function getStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function validateOptionalUrl(value: FormDataEntryValue | null, label: string) {
  const input = getStringValue(value);

  if (!input) {
    return null;
  }

  let parsed: URL;

  try {
    parsed = new URL(input);
  } catch {
    throw new Error(`${label} must be a valid http or https URL.`);
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`${label} must be a valid http or https URL.`);
  }

  return parsed.toString();
}

export function validateEmail(email: string) {
  const value = email.trim().toLowerCase();

  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error("Enter a valid email address.");
  }

  return value;
}

export function validateDisplayName(displayName: string) {
  const value = displayName.trim();

  if (!value) {
    throw new Error("Display name is required.");
  }

  if (value.length > 50) {
    throw new Error("Display name must be 50 characters or fewer.");
  }

  return value;
}

export function validateJoinCode(joinCode: string) {
  const value = joinCode.trim().toUpperCase();

  if (!/^[A-Z0-9]{6}$/.test(value)) {
    throw new Error("Join code must be 6 uppercase letters or numbers.");
  }

  return value;
}

export function validateProjectInput(input: ProjectInput) {
  const name = input.name.trim();
  const tagline = input.tagline.trim();
  const description = input.description.trim();

  if (!name) {
    throw new Error("Project name is required.");
  }

  if (name.length > 100) {
    throw new Error("Project name must be 100 characters or fewer.");
  }

  if (tagline.length > 140) {
    throw new Error("Tagline must be 140 characters or fewer.");
  }

  if (description.length > 2000) {
    throw new Error("Description must be 2000 characters or fewer.");
  }

  return {
    demoUrl: validateOptionalUrl(input.demoUrl, "Demo URL"),
    description,
    githubUrl: validateOptionalUrl(input.githubUrl, "GitHub URL"),
    name,
    tagline
  };
}

export function parseProjectInput(formData: FormData): ProjectInput {
  return {
    demoUrl: getStringValue(formData.get("demoUrl")),
    description: getStringValue(formData.get("description")),
    githubUrl: getStringValue(formData.get("githubUrl")),
    name: getStringValue(formData.get("name")),
    tagline: getStringValue(formData.get("tagline"))
  };
}
