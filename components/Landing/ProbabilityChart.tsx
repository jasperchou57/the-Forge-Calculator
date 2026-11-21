interface ProbabilityChartProps {
  title: string;
  data: { name: string; prob: number; color: string }[];
}

export default function ProbabilityChart({ title, data }: ProbabilityChartProps) {
  return (
    <figure>
      <figcaption className="mb-3 text-sm font-semibold text-gray-300">{title}</figcaption>
      <ul className="space-y-2">
        {data.map(({ name, prob, color }) => (
          <li
            key={name}
            className="grid grid-cols-[min(43%,8rem)_minmax(0,1fr)_4ch] items-center gap-x-3 text-base leading-6"
          >
            <span className="font-medium text-gray-100">{name}</span>
            <span aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full" style={{ width: `${prob}%`, backgroundColor: color }} />
            </span>
            <span className="text-right font-semibold tabular-nums text-white">{prob}%</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
