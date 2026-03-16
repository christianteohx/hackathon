import { MOCK_ORGANIZATIONS } from "./mockData";
import { Organization } from "./types";

export function getOrganizationById(id: string): Organization | undefined {
  return MOCK_ORGANIZATIONS.find((org) => org.id === id);
}

export function getOrganizationByCustomDomain(
  domain: string
): Organization | undefined {
  return MOCK_ORGANIZATIONS.find((org) => org.customDomain === domain);
}
