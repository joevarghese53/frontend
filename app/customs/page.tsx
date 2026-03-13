"use client"

import { useState } from "react"
import Image from "next/image"

import {
  Upload,
  Palette,
  Sparkles,
  Layers,
  Undo,
  Redo,
  RotateCcw,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Page() {
  const [activeTool, setActiveTool] = useState("upload")
  const [mobileDrawer, setMobileDrawer] = useState(false)

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col bg-[#f6f7f9]">
      {/* TOP TOOLBAR */}

      <div className="flex h-14 items-center gap-4 border-b bg-white px-6 shadow-sm">
        <Undo className="cursor-pointer hover:text-gray-600" />
        <Redo className="cursor-pointer hover:text-gray-600" />
        <RotateCcw className="cursor-pointer hover:text-gray-600" />

        <div className="ml-auto font-semibold">Flow State Designer</div>
      </div>

      {/* MAIN WORKSPACE */}

      <div className="flex flex-1 overflow-hidden">
        {/* DESKTOP ICON SIDEBAR */}

        <div className="hidden w-16 flex-col items-center gap-6 border-r bg-white py-6 md:flex">
          <ToolIcon
            icon={<Upload />}
            active={activeTool === "upload"}
            onClick={() => setActiveTool("upload")}
          />

          <ToolIcon
            icon={<Palette />}
            active={activeTool === "colors"}
            onClick={() => setActiveTool("colors")}
          />

          <ToolIcon
            icon={<Sparkles />}
            active={activeTool === "ai"}
            onClick={() => setActiveTool("ai")}
          />

          <ToolIcon
            icon={<Layers />}
            active={activeTool === "layers"}
            onClick={() => setActiveTool("layers")}
          />
        </div>

        {/* DESKTOP TOOL DRAWER */}

        <div className="hidden w-[320px] overflow-y-auto border-r bg-white p-6 md:block">
          <DrawerContent activeTool={activeTool} />
        </div>

        {/* CANVAS AREA */}

        <div className="flex flex-1 items-center justify-center p-4 md:p-10">
          <div className="rounded-2xl bg-white p-10 shadow-xl md:p-16">
            <div className="relative w-[260px] md:w-[420px]">
              <Image
                src="/img/black-shirt.png"
                alt="shirt"
                width={420}
                height={520}
                priority
              />

              {/* PRINT AREA */}

              <div className="absolute top-[45%] left-1/2 flex h-56 w-56 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border-2 border-dashed border-red-400 text-xs text-gray-500">
                Print Area
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP PREVIEW */}

        <div className="hidden w-[280px] border-l bg-white p-6 lg:block">
          <h3 className="mb-4 font-semibold">Preview</h3>

          <div className="space-y-6">
            <PreviewCard title="Front" src="/img/black-shirt.png" />

            <PreviewCard title="Back" src="/img/black-shirt-back.png" />
          </div>
        </div>
      </div>

      {/* MOBILE TOOLBAR */}

      <div className="fixed right-0 bottom-16 left-0 flex justify-around border-t bg-white py-3 md:hidden">
        <MobileTool
          icon={<Upload />}
          onClick={() => {
            setActiveTool("upload")
            setMobileDrawer(true)
          }}
        />

        <MobileTool
          icon={<Palette />}
          onClick={() => {
            setActiveTool("colors")
            setMobileDrawer(true)
          }}
        />

        <MobileTool
          icon={<Sparkles />}
          onClick={() => {
            setActiveTool("ai")
            setMobileDrawer(true)
          }}
        />

        <MobileTool
          icon={<Layers />}
          onClick={() => {
            setActiveTool("layers")
            setMobileDrawer(true)
          }}
        />
      </div>

      {/* MOBILE DRAWER */}

      {mobileDrawer && (
        <div className="fixed right-4 bottom-28 left-4 rounded-xl bg-white p-6 shadow-lg md:hidden">
          <DrawerContent activeTool={activeTool} />

          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setMobileDrawer(false)}
          >
            Close
          </Button>
        </div>
      )}

      {/* BOTTOM BAR */}

      <div className="fixed right-0 bottom-0 left-0 flex h-16 items-center justify-between border-t bg-white px-6 md:px-8">
        <div>
          <p className="text-sm text-gray-500">Regular T-Shirt</p>

          <p className="text-lg font-semibold">₹899</p>
        </div>

        <Button size="lg" className="bg-red-600 hover:bg-red-700">
          Create Product
        </Button>
      </div>
    </div>
  )
}

/* TOOL ICON */

function ToolIcon({
  icon,
  active,
  onClick,
}: {
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg transition ${active ? "bg-red-100 text-red-500" : "hover:bg-gray-100"}`}
    >
      {icon}
    </div>
  )
}

/* MOBILE TOOL */

function MobileTool({
  icon,
  onClick,
}: {
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100"
    >
      {icon}
    </button>
  )
}

/* DRAWER CONTENT */

function DrawerContent({ activeTool }: { activeTool: string }) {
  if (activeTool === "upload") {
    return (
      <>
        <h2 className="mb-4 text-lg font-semibold">Upload</h2>

        <div className="rounded-xl border-2 border-dashed p-10 text-center text-sm text-gray-500">
          Drag image here
        </div>

        <Button className="mt-4 w-full">Upload Image</Button>

        <p className="mt-3 text-sm text-gray-400">
          Recent uploads will appear here
        </p>
      </>
    )
  }

  if (activeTool === "colors") {
    return (
      <>
        <h2 className="mb-4 text-lg font-semibold">Shirt Colors</h2>

        <div className="flex flex-wrap gap-3">
          {["black", "white", "red", "blue", "green"].map((color) => (
            <div
              key={color}
              className="h-10 w-10 cursor-pointer rounded-full border transition hover:scale-110"
              style={{ background: color }}
            />
          ))}
        </div>
      </>
    )
  }

  if (activeTool === "ai") {
    return (
      <>
        <h2 className="mb-4 text-lg font-semibold">AI Generate</h2>

        <Input placeholder="Describe your design..." />

        <Button className="mt-4 w-full">Generate Design</Button>
      </>
    )
  }

  if (activeTool === "layers") {
    return (
      <>
        <h2 className="mb-4 text-lg font-semibold">Layers</h2>

        <div className="space-y-2">
          <div className="rounded-md border p-2 text-sm">Background</div>

          <div className="rounded-md border p-2 text-sm">Image Layer</div>
        </div>
      </>
    )
  }

  return null
}

/* PREVIEW CARD */

function PreviewCard({ title, src }: { title: string; src: string }) {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="mb-2 text-sm font-medium">{title}</p>

      <Image src={src} width={180} height={220} alt="preview" />
    </div>
  )
}
