const ColorSelector = ({ color, setColor }: { color: string; setColor: (color: string) => void }) => {

    return (
        <div className="p-5 rounded-[15px] border shadow-[0_0_14px_8px_rgba(0,0,0,0.16),0_0_4px_1px_rgba(0,0,0,0.16)]">

            <h2 className="font-semibold mb-4">
                Shirt Color
            </h2>

            <div className="flex gap-4">

                <button
                    onClick={() => setColor("black")}
                    className={`
                    w-11
                    h-11
                    rounded-full
                    bg-black
                    border-2
                    ${color === "black"
                            ? "ring-2 ring-black"
                            : "ring-2 ring-black/30"
                        }
                  `}
                />

                <button
                    onClick={() => setColor("white")}
                    className={`
                    w-11
                    h-11
                    rounded-full
                    bg-white
                    border
                    ${color === "white"
                            ? "ring-2 ring-black"
                            : "ring-2 ring-black/30"
                        }
                  `}
                />

            </div>

        </div>
    )
}

export { ColorSelector };