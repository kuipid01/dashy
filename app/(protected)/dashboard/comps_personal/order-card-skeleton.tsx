import ContainerDashboard from "../../_components/container-dashboard";

export default function TotalOrdersSkeleton() {
  return (
    <div className="lg:col-span-2 col-span-1">
      <ContainerDashboard>
        <div className="w-full bg-primary p-6 h-full flex flex-col rounded-lg animate-pulse">
          {/* Header */}
          <div className="flex mb-2 justify-between items-center">
            <div className="h-6 w-40 bg-gray-300 rounded-md" />
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
          </div>

          {/* Orders count + arrow */}
          <div className="flex items-center gap-1 mt-2">
            <div className="h-10 w-24 bg-gray-300 rounded-md" />
            <div className="h-6 w-12 bg-gray-300 rounded-md" />
          </div>

          {/* Comparison text */}
          <div className="h-4 w-48 bg-gray-300 rounded-md mt-1 mb-3" />

          {/* Line chart placeholder */}
          <div className="h-[100px] w-full bg-gray-200 rounded-md" />
        </div>
      </ContainerDashboard>
    </div>
  );
}
