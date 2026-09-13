import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";

const Preview = ({ color, category, side, setSide, frontImageUrl, backImageUrl }: { color: string; category: string; side: "front" | "back"; setSide: Dispatch<SetStateAction<"front" | "back">>; frontImageUrl: string | null; backImageUrl: string | null }) => {

  const frontImage = frontImageUrl || `/images/customs/canvas/${color}_tshirt_${category}_front_desktop.png`;
  const backImage = backImageUrl || `/images/customs/canvas/${color}_tshirt_${category}_back_desktop.png`;

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-semibold mb-6">
          Preview
        </h2>
        <div className="flex gap-4 mb-6">
          <Button
            onClick={() => setSide("front")}
            size="lg"
            variant={side === "front" ? "default" : "outline"}
          >
            Front
          </Button>
          <Button
            onClick={() => setSide("back")}
            size="lg"
            variant={side === "back" ? "default" : "outline"}
          >
            Back
          </Button>
        </div>
      </div>

      <div className="h-120 rounded-3xl flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#25c7e9_0%,#1d889b_35%,#236477_68%,#173d4b_100%)]">
        {side === "front" && (
          <img
            src={frontImage}
            className="h-[90%] object-contain"
          />
        )}
        {side === "back" && (
          <img
            src={backImage}
            className="h-[90%] object-contain"
          />
        )}
      </div>

    </>

  )
}

export { Preview };