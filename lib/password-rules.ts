export const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters" },
  { key: "uppercase", label: "At least one uppercase letter" },
  { key: "number", label: "At least one number" },
  { key: "special", label: "At least one special character" },
] as const;

export function getPasswordChecks(password: string) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}

export function isStrongPassword(password: string) {
  const checks = getPasswordChecks(password);
  return Object.values(checks).every(Boolean);
}

export function getPasswordValidationMessage(password: string) {
  if (!password) {
    return "Password is required.";
  }
  if (isStrongPassword(password)) {
    return true;
  }
  return "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.";
}
