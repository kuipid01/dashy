export const Subcard: React.FC<{ planType: string }> = ({ planType }) => {
  return (
    <div className="  px-6 flex flex-col justify-between py-6 h-fit border rounded-md bg-secondary">
      <p className="text-white font-medium mb-6">Subscription</p>
      <h2 className="text-white font-bold text-lg">{planType}</h2>
      <p className="text-gray-100 mb-6">Renews on 2023-09-15</p>
      <button className="border text-white rounded-md px-4 py-1">
        Cancel Subscription
      </button>
    </div>
  );
};
