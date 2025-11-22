"use client"

import type React from "react"

import { useCallback, useState } from "react"
import { Upload, ImageIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface UploadZoneProps {
  onImageUpload: (imageData: string) => void
}

export function UploadZone({ onImageUpload }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          onImageUpload(result)
        }
        reader.readAsDataURL(file)
      }
    },
    [onImageUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-dashed"
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <label className="cursor-pointer block">
        <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />

        <div className="p-12 md:p-20 text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            {isDragging ? (
              <ImageIcon className="w-10 h-10 text-primary animate-bounce" />
            ) : (
              <Upload className="w-10 h-10 text-primary" />
            )}
          </div>

          <h3 className="text-2xl font-semibold mb-3">{isDragging ? "¡Suelta la imagen aquí!" : "Sube tu gráfica"}</h3>

          <p className="text-muted-foreground mb-6 text-pretty">
            Arrastra y suelta una imagen o haz clic para seleccionar
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            <Upload className="w-5 h-5" />
            Seleccionar Imagen
          </div>

          <p className="text-sm text-muted-foreground mt-6">Formatos soportados: PNG, JPG, JPEG, GIF</p>
        </div>
      </label>
    </Card>
  )
}
