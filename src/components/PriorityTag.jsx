import { PRIORITY_STYLES } from "../utils/constants";

export default function PriorityTag({ priority }) {
  const style = PRIORITY_STYLES[priority];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${style.soft} ${style.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.bg}`} />
      {priority}
    </span>
  );
}
