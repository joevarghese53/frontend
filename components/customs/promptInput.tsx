import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const suggestions = [
  "Fallen Angel",
  "Japanese Flowers",
  "Street Racer",
  "Samurai",
];

const PromptInput = ({ prompt, setPrompt }: { prompt: string; setPrompt: (prompt: string) => void }) => {
  return (
    <div className="p-5 rounded-[15px] border shadow-[0_0_14px_8px_rgba(0,0,0,0.16),0_0_4px_1px_rgba(0,0,0,0.16)]">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Describe Your Idea
        </h2>

        <p className="text-sm text-muted-foreground mt-1">
          Describe what you'd like to wear.
        </p>
      </div>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A fallen angel sitting beneath the moon..."
          className="h-30 p-5 resize-none border border-solid border-[#adadad] focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
          {prompt.length}/200
        </div>
      </div>

      {/* Suggestions */}
      <div className="mt-5">
        <p className="text-sm text-muted-foreground mb-3">
          Try these ideas
        </p>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <Button
              key={item}
              type="button"
              variant="default"
              size="sm"
              onClick={() => setPrompt(item)}
              className="rounded-full px-4"
            >
              {item}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export { PromptInput };