"use client"

import { useState } from "react"
import { Upload, Sparkles, Calculator } from "lucide-react"
import { UploadZone } from "@/components/upload-zone"
import { ResultDisplay } from "@/components/result-display"
import { Header } from "@/components/header"

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{
    equation: string
    steps: Array<{ title: string; description: string; formula?: string }>
    graphType: string
  } | null>(null)

  const handleImageUpload = async (imageData: string) => {
    setUploadedImage(imageData)
    setIsAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      })

      const data = await response.json()

      if (data.error || !response.ok) {
        setError(data.error || "Error al analizar la gráfica. Por favor, intenta de nuevo.")
        return
      }

      if (!data.equation || !data.steps || !data.graphType) {
        setError("La respuesta del servidor no tiene el formato esperado.")
        return
      }

      setResult(data)
    } catch (error) {
      console.error("[v0] Error analyzing graph:", error)
      setError("Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setUploadedImage(null)
    setResult(null)
    setIsAnalyzing(false)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Análisis con IA</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-balance">
            Convierte Gráficas en
            <span className="text-primary"> Ecuaciones</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Sube una imagen de cualquier gráfica matemática y obtén su ecuación con el análisis paso a paso
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto">
          {!uploadedImage ? (
            <UploadZone onImageUpload={handleImageUpload} />
          ) : (
            <ResultDisplay
              image={uploadedImage}
              isAnalyzing={isAnalyzing}
              result={result}
              error={error}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Sube tu Gráfica</h3>
            <p className="text-sm text-muted-foreground">
              Arrastra o selecciona una imagen de cualquier función matemática
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Análisis Inteligente</h3>
            <p className="text-sm text-muted-foreground">
              IA avanzada identifica patrones y características de la función
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mx-auto mb-4">
              <Calculator className="w-6 h-6 text-chart-2" />
            </div>
            <h3 className="font-semibold mb-2">Ecuación Detallada</h3>
            <p className="text-sm text-muted-foreground">Recibe la ecuación completa con explicación paso a paso</p>
          </div>
        </div>
      </main>
    </div>
  )
}
