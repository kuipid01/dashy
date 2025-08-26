interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            i < currentStep
              ? "bg-primary"
              : i === currentStep
              ? "bg-primary ring-2 ring-primary/30"
              : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}
