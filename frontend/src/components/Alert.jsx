import { AlertCircle } from "lucide-react";

export default function Alert({ children, onRetry }) {
  return (
    <div className="alert" role="alert">
      <AlertCircle size={19} />
      <span>{children}</span>
      {onRetry && <button className="text-button" type="button" onClick={onRetry}>Try again</button>}
    </div>
  );
}
