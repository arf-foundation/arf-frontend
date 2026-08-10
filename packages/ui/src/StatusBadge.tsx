export function StatusBadge({ status }: { status: string }) {
  const color = status === 'critical' ? 'bg-[#b3392a]' : status === 'warning' ? 'bg-[#a66a1e]' : 'bg-[#3f7a5c]';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium text-white ${color}`}>
      {status.toUpperCase()}
    </span>
  );
}
