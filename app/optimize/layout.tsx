import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Forge Optimizer - The Forge Calculator',
  description: 'Discover high-performance ore combinations for The Forge Roblox. Filter by trait and multiplier, then load the recipe into the calculator with one click.',
  alternates: {
    canonical: '/optimize',
  },
};

export default function OptimizeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
