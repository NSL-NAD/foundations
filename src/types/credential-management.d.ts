// Credential Management API — not yet in all TS DOM libs
// https://developer.mozilla.org/en-US/docs/Web/API/PasswordCredential

interface PasswordCredentialData {
  id: string;
  password: string;
  name?: string;
  iconURL?: string;
}

declare class PasswordCredential extends Credential {
  constructor(data: PasswordCredentialData);
  readonly password: string;
  readonly name: string;
  readonly iconURL: string;
}

interface Window {
  PasswordCredential?: typeof PasswordCredential;
}
