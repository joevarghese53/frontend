import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

const Preview = ({ color, category, side, setSide, frontImageUrl, backImageUrl }: { color: string; category: string; side: "front" | "back"; setSide: Dispatch<SetStateAction<"front" | "back">>; frontImageUrl: string | null; backImageUrl: string | null }) => {

  const frontImage = frontImageUrl || `/images/customs/canvas/${color}_tshirt_${category}_front_desktop.png`;
  const backImage = backImageUrl || `/images/customs/canvas/${color}_tshirt_${category}_back_desktop.png`;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="mb-4 text-xl font-semibold sm:mb-6 sm:text-3xl">
          Preview
        </h2>
        <div className="mb-4 flex gap-2 sm:mb-6 sm:gap-4">
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

      <div className="flex h-[65svh] min-h-64 max-h-120 items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_50%_30%,#25c7e9_0%,#1d889b_35%,#236477_68%,#173d4b_100%)] sm:h-120">
        {side === "front" && (
          <Image
            src={frontImage}
            alt={`${color} ${category} shirt, front view`}
            width={720}
            height={720}
            unoptimized={Boolean(frontImageUrl)}
            className="h-[90%] max-w-[90%] object-contain"
          />
        )}
        {side === "back" && (
          <Image
            src={backImage}
            alt={`${color} ${category} shirt, back view`}
            width={720}
            height={720}
            unoptimized={Boolean(backImageUrl)}
            className="h-[90%] max-w-[90%] object-contain"
          />
        )}
      </div>

    </>

  )
}

export { Preview };