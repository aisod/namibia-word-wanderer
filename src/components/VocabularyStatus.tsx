import { Button } from "@/components/ui/button";
export function VocabularyStatus({ onBack, onRetry, error }: { onBack: () => void; onRetry: () => unknown; error?: unknown }) {
  return <div className="min-h-screen grid place-items-center p-6"><div className="text-center space-y-4" role="status">
    <p>{error ? "We couldn’t load these words. Check your connection and try again." : "There aren’t enough words for this game yet."}</p>
    <Button onClick={() => void onRetry()}>Try again</Button>{" "}<Button variant="outline" onClick={onBack}>Back to games</Button>
  </div></div>;
}
