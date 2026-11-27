const CategorySelector = ({ category, setCategory }: { category: string; setCategory: (category: string) => void }) => {

    return (
        <div className="rounded-[15px] border p-4 shadow-[0_0_14px_8px_rgba(0,0,0,0.16),0_0_4px_1px_rgba(0,0,0,0.16)] sm:p-5">

            <h2 className="font-semibold mb-4">
                Category
            </h2>

            <div className="grid grid-cols-2 gap-4">

                <button
                    onClick={() =>
                        setCategory("regular")
                    }
                    className={`
                    rounded-2xl
                    min-h-24
                    p-3
                    border
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    ${category === "regular"
                            ? "border-black"
                            : "border-black/30"
                        }
                  `}
                >
                    👕
                    Regular
                </button>

                <button
                    onClick={() =>
                        setCategory("oversized")
                    }
                    className={`
                    rounded-2xl
                    min-h-24
                    p-3
                    border
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-2
                    ${category === "oversized"
                            ? "border-black"
                            : "border-black/30"
                        }
                  `}
                >
                    🧥
                    Oversized
                </button>

            </div>

        </div>
    )
}

export { CategorySelector };