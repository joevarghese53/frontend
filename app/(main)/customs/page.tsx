"use client";

import { useMemo, useState } from "react";

import { PromptInput } from "@/components/customs/promptInput";
import { ColorSelector } from "@/components/customs/colorSelector";
import { CategorySelector } from "@/components/customs/categorySelector";
import { Preview } from "@/components/customs/preview";
import { FinalProduct } from "@/components/customs/finalProduct";
import { Button } from "@/components/ui/button";

import { useGenerateImageMutation } from "@/redux/api/generateImageApiSlice";
import { useCreateCProductMutation } from "@/redux/api/cProductApiSlice";

type GeneratedDesign = {
  design: string;
  mockup: string;
};

type DesignCache = Record<string, GeneratedDesign>;

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [color, setColor] = useState("black");
  const [category, setCategory] = useState("regular");
  const [side, setSide] = useState<"front" | "back">("front");
  const [cache, setCache] = useState<DesignCache>({});

  const [generateImage, { isLoading: isGenerating }] = useGenerateImageMutation();
  const [createProduct, { isLoading: isCreating }] = useCreateCProductMutation();

  const frontKey = useMemo(
    () => `${color}-${category}-front`,
    [color, category]
  );

  const backKey = useMemo(
    () => `${color}-${category}-back`,
    [color, category]
  );

  const handleRemoveFront = () => {
    setCache((prev) => {
      const updated = { ...prev };
      delete updated[frontKey];
      return updated;
    });
  };

  const handleRemoveBack = () => {
    setCache((prev) => {
      const updated = { ...prev };
      delete updated[backKey];
      return updated;
    });
  };

  const handleGenerateImage = async () => {
    try {
      const response = await generateImage({
        prompt,
        color,
        category,
        side,
      }).unwrap();

      const key = `${color}-${category}-${side}`;

      setCache((prev) => ({
        ...prev,
        [key]: {
          design: response.design,
          mockup: response.mockup,
        },
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const dataURLToFile = (
    dataUrl: string,
    fileName: string
  ): File => {
    const arr = dataUrl.split(",");

    const mime = arr[0].match(/:(.*?);/)![1];

    const bstr = atob(arr[1]);

    let n = bstr.length;

    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, {
      type: mime,
    });
  };

  const handleCreateProduct = async () => {
    try {
      const front = cache[frontKey];
      const back = cache[backKey];

      if (!front && !back) {
        alert("Please generate at least one design.");
        return;
      }

      const formData = new FormData();

      formData.append("prompt", prompt);
      formData.append("category", category);

      if (front) {
        formData.append(
          "frontImage",
          dataURLToFile(
            front.mockup,
            "frontImage.png"
          )
        );

        formData.append(
          "frontDesign",
          dataURLToFile(
            front.design,
            "frontDesign.png"
          )
        );
      }

      if (back) {
        formData.append(
          "backImage",
          dataURLToFile(
            back.mockup,
            "backImage.png"
          )
        );

        formData.append(
          "backDesign",
          dataURLToFile(
            back.design,
            "backDesign.png"
          )
        );
      }

      const response = await createProduct(
        formData
      ).unwrap();

      console.log(response);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 max-w-7xl mx-auto px-6 grid lg:grid-cols-[420px_1fr] gap-8">
      {/* LEFT PANEL */}

      <div className="space-y-6">
        <PromptInput
          prompt={prompt}
          setPrompt={setPrompt}
        />

        <ColorSelector
          color={color}
          setColor={setColor}
        />

        <CategorySelector
          category={category}
          setCategory={setCategory}
        />

        <Button
          size="lg"
          className="w-full rounded-[15px] py-5 text-lg font-semibold"
          disabled={!prompt || isGenerating}
          onClick={handleGenerateImage}
        >
          {isGenerating
            ? "Generating..."
            : "✨ Generate Design"}
        </Button>
      </div>

      {/* RIGHT PANEL */}

      <div className="sticky top-32 h-fit">
        <div className="p-5 rounded-[15px] border shadow-[0_0_14px_8px_rgba(0,0,0,0.16),0_0_4px_1px_rgba(0,0,0,0.16)]">
          <Preview
            color={color}
            category={category}
            side={side}
            setSide={setSide}
            frontImageUrl={
              cache[frontKey]?.mockup ?? null
            }
            backImageUrl={
              cache[backKey]?.mockup ?? null
            }
          />

          <FinalProduct
            color={color}
            category={category}
            frontImageUrl={
              cache[frontKey]?.mockup ?? null
            }
            backImageUrl={
              cache[backKey]?.mockup ?? null
            }
            onRemoveFront={handleRemoveFront}
            onRemoveBack={handleRemoveBack}
          />
          {/* Create Button */}
          <Button
            className="mt-5 w-full rounded-2xl text-xl py-5 font-semibold bg-black hover:bg-zinc-900"
            onClick={handleCreateProduct}
            disabled={isCreating}
          >
            {isCreating ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}