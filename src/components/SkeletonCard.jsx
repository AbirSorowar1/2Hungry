export function FoodCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-44 skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-5 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-full" />
        <div className="h-3 skeleton rounded-lg w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 skeleton rounded-lg w-16" />
          <div className="w-9 h-9 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function RestaurantCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="h-40 skeleton" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 skeleton rounded-lg w-3/4" />
            <div className="h-3 skeleton rounded-lg w-1/2" />
          </div>
        </div>
        <div className="h-3 skeleton rounded-lg w-full" />
      </div>
    </div>
  );
}
