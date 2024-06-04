export class AccountNotFoundError extends Error {
  constructor(label: string, address: string, error?: string) {
    error = error ? `\n\n${error}` : "";
    address = address ? ` at address ${address}` : "";
    super(`Failed to find ${label}${address}${error}`);
    Object.setPrototypeOf(this, AccountNotFoundError.prototype);
  }
}

export class UnexpectedResponse extends Error {
  constructor(label: string, address?: string, error?: string) {
    error = error ? `\n\n${error}` : "";
    address = address ? ` at address ${address}` : "";
    super(`Unexpected response from ${label}${address}${error}`);
    Object.setPrototypeOf(this, UnexpectedResponse.prototype);
  }
}
