import { cn } from "@/lib/utils";

export function StepForm({
  steps,
  currentStep,
  onNext,
  onBack,
  children,
}: {
  steps: string[];
  currentStep: number;
  onNext: () => void;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-6">
        {steps.map((step, index) => (
          <div key={step} className={cn("rounded-2xl border px-4 py-3 text-sm", index === currentStep ? "border-brand-gold bg-brand-gold/10 text-brand-dark-text" : "border-brand-border bg-white text-brand-gray")}>
            {index + 1}. {step}
          </div>
        ))}
      </div>
      {children}
      <div className="flex justify-between">
        <button type="button" onClick={onBack} className="rounded-full border border-brand-border px-5 py-3 text-sm font-semibold">Back</button>
        <button type="button" onClick={onNext} className="rounded-full bg-brand-gold px-5 py-3 text-sm font-semibold text-brand-black">Next</button>
      </div>
    </div>
  );
}
