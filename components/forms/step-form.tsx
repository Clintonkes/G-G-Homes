import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function StepForm({
  steps,
  currentStep,
  onNext,
  onBack,
  nextLabel,
  isLastStep = false,
  disableNext = false,
  isSubmitting = false,
  children,
}: {
  steps: string[];
  currentStep: number;
  onNext: () => void | Promise<void>;
  onBack: () => void;
  nextLabel?: string;
  isLastStep?: boolean;
  disableNext?: boolean;
  isSubmitting?: boolean;
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
        <Button
          variant="outline"
          type="button"
          onClick={onBack}
          disabled={currentStep === 0 || isSubmitting}
        >
          Back
        </Button>
        <Button
          type={isLastStep ? "submit" : "button"}
          onClick={isLastStep ? undefined : onNext}
          disabled={disableNext}
          isLoading={isSubmitting}
          loadingText={isLastStep ? "Submitting..." : "Loading..."}
        >
          {nextLabel ?? (isLastStep ? "Submit" : "Next")}
        </Button>
      </div>
    </div>
  );
}
