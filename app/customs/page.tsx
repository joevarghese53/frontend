"use client";
import { useState } from "react";
import { PromptInput } from "@/components/customs/promptInput";
import { ColorSelector } from "@/components/customs/colorSelector";
import { CategorySelector } from "@/components/customs/categorySelector";
import { Preview } from "@/components/customs/preview";
import { FinalProduct } from "@/components/customs/finalProduct";
import { Button } from "@/components/ui/button";
import { useGenerateImageMutation } from "@/redux/api/generateImageApiSlice";

export default function Page() {

  const [prompt, setPrompt] = useState("");
  const [color, setColor] = useState("black");
  const [category, setCategory] = useState("regular");
  const [side, setSide] = useState("front");
  const coords = [
    111.328125,
    143,
    285,
    380
  ]
  const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
  const [backImageUrl, setBackImageUrl] = useState<string | null>(null);

  const [generateImage] = useGenerateImageMutation();

  const handleGenerateImage = async (prompt: string, color: string, category: string, coords: number[], side: string) => {
    try {
      const response = await generateImage({ prompt, color, category, coords, side, device: "desktop" }).unwrap();
      console.log("Image generated successfully:", response);
      if (side === "front") {
        setFrontImageUrl(response.mockup);
      } else {
        setBackImageUrl(response.mockup);
      }
    } catch (error) {
      console.error("Failed to generate image:", error);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-[420px_1fr] gap-8">

      {/* LEFT PANEL */}
      <div className="space-y-6">
        <PromptInput prompt={prompt} setPrompt={setPrompt} />
        <ColorSelector color={color} setColor={setColor} />
        <CategorySelector category={category} setCategory={setCategory} />
        <Button
          size="lg"
          variant="default"
          className="w-full rounded-[15px] py-5 text-lg font-semibold"
          onClick={() => handleGenerateImage(prompt, color, category, coords, side)}
        >
          ✨ Generate Design
        </Button>
      </div>

      {/* RIGHT PANEL */}
      <div className="sticky top-32 h-fit">
        <div className="p-5 rounded-[15px] border shadow-[0_0_14px_8px_rgba(0,0,0,0.16),0_0_4px_1px_rgba(0,0,0,0.16)]">
          <Preview color={color} category={category} side={side} setSide={setSide} frontImageUrl={frontImageUrl} backImageUrl={backImageUrl} />
          <FinalProduct color={color} category={category} frontImageUrl={frontImageUrl} backImageUrl={backImageUrl} />
        </div>
      </div>

    </div>
  );
}