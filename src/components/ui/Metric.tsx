interface MetricProps {
  value: string;
  label: string;
  prefix?: string;
}

export function Metric({ value, label, prefix }: MetricProps) {
  return (
    <div>
      <p className="text-3xl font-bold text-gold sm:text-4xl">
        {prefix}
        {value}
      </p>
      <p className="mt-1 text-sm text-soft-white/60">{label}</p>
    </div>
  );
}
