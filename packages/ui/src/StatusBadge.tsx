export function StatusBadge({ status }: { status: string }) {
  const color = status === 'critical' ? 'bg-[#b3392a]' : status === 'warning' ? 'bg-[#a66a1e]' : 'bg-[#3f7a5c]';
  // Motion reserved for the genuinely urgent state -- warning/safe stay
  // static so the pulse actually means something when it appears.
  const pulse = status === 'critical' ? 'arf-status-pulse' : '';
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium text-white ${color} ${pulse}`}>
      {status.toUpperCase()}
    </span>
  );
}
