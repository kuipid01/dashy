import ContainerDashboard from "../../_components/container-dashboard";

export default function SalesCardSkeleton() {
  return (
    <div className="lg:col-span-3 col-span-1">
      <ContainerDashboard>
        <div className="w-full h-full flex flex-col justify-between p-6 rounded-lg bg-primary animate-pulse">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="h-6 w-40 bg-gray-300 rounded-md" />
            <div className="h-10 w-36 bg-gray-300 rounded-md mt-2 sm:mt-0" />
          </div>

          {/* Total Sales */}
          <div className="flex flex-col mt-4 gap-2">
            <div className="h-10 w-32 bg-gray-300 rounded-md" />
            <div className="h-4 w-48 bg-gray-300 rounded-md" />
          </div>

          {/* Pills */}
          <div className="grid grid-cols-1 mt-5 sm:grid-cols-3 gap-4 lg:gap-5">
            {[0, 1, 2].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-300 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </ContainerDashboard>
    </div>
  );
}
