export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="bg-gray-200 h-44 sm:h-48" />
      {/* Text placeholders */}
      <div className="p-4 space-y-3">
        <div className="h-3 w-20 bg-gray-200 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-14 bg-gray-200 rounded-full" />
          <div className="h-8 w-16 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
