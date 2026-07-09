import { trustStats } from '../../data/hospitalData';
import { useCountUp } from '../../hooks/useAnimation';

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(value, 2000);

  return (
    <div
      ref={ref}
      className="text-center p-6 rounded-xl bg-white shadow-sm border border-border transition-all duration-300 hover:shadow-md hover:border-primary/20"
    >
      <div className="flex items-baseline justify-center mb-2">
        <span className="text-4xl md:text-5xl font-bold text-primary">
          {count.toLocaleString()}
        </span>
        <span className="text-2xl md:text-3xl font-bold text-primary ml-1">
          {suffix}
        </span>
      </div>
      <p className="text-muted text-sm md:text-base">{label}</p>
    </div>
  );
}

export function Stats() {
  return (
    <section className="py-12 bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustStats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
