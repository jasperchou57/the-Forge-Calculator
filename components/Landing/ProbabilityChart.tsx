interface ProbabilityChartProps {
  title: string;
  data: { name: string; prob: number; color: string }[];
}

export default function ProbabilityChart({ title, data }: ProbabilityChartProps) {
  return (
    <figure>
      <figcaption className="mb-2 text-base font-semibold text-gray-100">{title}</figcaption>
      <ul>
        {data.map(({ name, prob, color }) => (
          <li
            key={name}
            className="grid min-h-9 grid-cols-[min(43%,8rem)_minmax(0,1fr)_4ch] items-center gap-x-3 text-base leading-6"
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
