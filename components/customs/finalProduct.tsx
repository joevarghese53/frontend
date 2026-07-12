import React from 'react'
import { Button } from '../ui/button'
import { Shirt } from 'lucide-react'

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
            <h2 className="text-3xl font-bold text-black">
                Final Product
            </h2>
            {/* Cards */}
            <div className="grid grid-cols-2 gap-6">
                {/* Front */}
                <div className="bg-[#e8e8e8] border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="inline-flex items-center gap-3 bg-black text-white px-4 py-1 rounded-2xl mb-6">
                        <Shirt className="w-3 h-3" />
                        <span className="text-sm">
                            Front
                        </span>
                    </div>

                    <div className="flex justify-center items-center mb-8 min-h-87.5">
                        <img
                            src={frontImage}
                            className="max-h-80 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]"
                        />
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={onRemoveFront}
                    >
                        Remove Front Design
                    </Button>
                </div>

                {/* Back */}
                <div className="bg-[#e8e8e8] border border-gray-200 rounded-3xl p-6 shadow-sm">
                    <div className="inline-flex items-center gap-3 bg-black text-white px-4 py-1 rounded-2xl mb-6">
                        <Shirt className="w-3 h-3" />
                        <span className="text-sm">
                            Back
                        </span>
                    </div>

                    <div className="flex justify-center items-center mb-8 min-h-87.5">
                        <img
                            src={backImage}
                            className="max-h-80 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.2)]"
                        />
                    </div>

                    <Button
                        variant="destructive"
                        className="w-full"
                        onClick={onRemoveBack}
                    >
                        Remove Back Design
                    </Button>
                </div>
            </div>

            {/* Note */}
            <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 mt-5">
                <div className="flex h-5 w-6 items-center justify-center rounded-full border-2 border-amber-500 text-amber-500 font-bold">
                    i
                </div>

                <p className="text-gray-700 text-sm">
                    Price is calculated based on the front and back design.
                    If you remove one of the designs, the price will be
                    adjusted accordingly.
                </p>
            </div>
        </div>
    )
}

export { FinalProduct }