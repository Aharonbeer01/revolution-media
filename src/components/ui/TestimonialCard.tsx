import { Testimonial } from "@/types/testimonial";

export function TestimonialCard({ quote, author, role, property }: Testimonial) {
  return (
    <div className="flex h-full flex-col rounded-lg bg-warm-white p-6 shadow-sm sm:p-8">
      {/* Decorative quote mark */}
      <span className="block text-4xl leading-none text-gold">&ldquo;</span>
      <p className="mt-2 flex-1 text-base italic text-midnight/80 leading-relaxed">
        {quote}
      </p>
      <div className="mt-6">
        <p className="font-semibold text-midnight">{author}</p>
        <p className="text-sm text-midnight/50">
          {role}, {property}
        </p>
      </div>
    </div>
  );
}
