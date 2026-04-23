import { CheckCircle2, Circle } from "lucide-react";

import { getPasswordChecks, PASSWORD_RULES } from "@/lib/password-rules";

export function PasswordRequirements({ password }: { password: string }) {
  const checks = getPasswordChecks(password);

  return (
    <div className="rounded-2xl bg-brand-cream px-4 py-3 text-sm leading-7 text-brand-gray">
      <p className="font-medium text-brand-dark-text">Password requirements</p>
      <div className="mt-2 space-y-1.5">
        {PASSWORD_RULES.map((rule) => {
          const passed = checks[rule.key];

          return (
            <p key={rule.key} className={passed ? "flex items-center gap-2 text-brand-green" : "flex items-center gap-2 text-brand-gray"}>
              {passed ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              <span>{rule.label}</span>
            </p>
          );
        })}
      </div>
    </div>
  );
}
