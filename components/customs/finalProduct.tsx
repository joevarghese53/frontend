import React from 'react'
import { Button } from '../ui/button'
import { Shirt } from 'lucide-react'
import Image from "next/image"

type FinalProductProps = {
  color: string;
  category: string;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  onRemoveFront: () => void;
  onRemoveBack: () => void;
};

const FinalProduct = ({ color, category, frontImageUrl, backImageUrl, onRemoveFront, onRemoveBack }: FinalProductProps) => {

    const frontImage = frontImageUrl || `/images/customs/canvas/${color}_tshirt_${category}_front_desktop.png`;
    const backImage = backImageUrl || `/images/customs/canvas/${color}_tshirt_${category}_back_desktop.png`;
    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-black sm:text-3xl">
                Final Product
            </h2>
            {/* Cards */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                {/* Front */}
                <div className="rounded-3xl border border-gray-200 bg-[#e8e8e8] p-4 shadow-sm sm:p-6">
                    <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-black px-4 py-1 text-white sm:mb-6">
                        <Shirt className="w-3 h-3" />
                        <span className="text-sm">
                            Front
                        </span>
                    </div>

                    <div className="mb-5 flex min-h-64 items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_50%_30%,#25c7e9_0%,#1d889b_35%,#236477_68%,#173d4b_100%)] sm:mb-8 sm:min-h-87.5">
                        <Image
                            src={frontImage}
                            alt={`${color} ${category} shirt, front view`}
                            width={640}
                            height={640}
                            unoptimized={Boolean(frontImageUrl)}
                            className="max-h-60 max-w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)] sm:max-h-80"
                        />
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full text-xs sm:text-sm"
                        onClick={onRemoveFront}
                    >
                        Remove Front Design
                    </Button>
                </div>

                {/* Back */}
                <div className="rounded-3xl border border-gray-200 bg-[#e8e8e8] p-4 shadow-sm sm:p-6">
                    <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-black px-4 py-1 text-white sm:mb-6">
                        <Shirt className="w-3 h-3" />
                        <span className="text-sm">
                            Back
                        </span>
                    </div>

                    <div className="mb-5 flex min-h-64 items-center justify-center rounded-3xl bg-[radial-gradient(circle_at_50%_30%,#25c7e9_0%,#1d889b_35%,#236477_68%,#173d4b_100%)] sm:mb-8 sm:min-h-87.5">
                        <Image
                            src={backImage}
                            alt={`${color} ${category} shirt, back view`}
                            width={640}
                            height={640}
                            unoptimized={Boolean(backImageUrl)}
                            className="max-h-60 max-w-full object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)] sm:max-h-80"
                        />
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full text-xs sm:text-sm"
                        onClick={onRemoveBack}
                    >
                        Remove Back Design
                    </Button>
                </div>
            </div>

            {/* Note */}
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 sm:items-center sm:gap-4">
                <div className="flex h-5 w-6 shrink-0 items-center justify-center rounded-full border-2 border-amber-500 font-bold text-amber-500">
                    i
                </div>

                <p className="text-sm text-gray-700">
                    Price is calculated based on the front and back design.
                    If you remove one of the designs, the price will be
                    adjusted accordingly.
                </p>
            </div>
        </div>
    )
}

export { FinalProduct }