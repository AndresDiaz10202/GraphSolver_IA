"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import Image from "next/image"

interface ResultDisplayProps {
  image: string
  isAnalyzing: boolean
  result: {
    equation: string
    steps: Array<{ title: string; description: string; formula?: string }>
    graphType: string
  } | null
  error?: string | null
  onReset: () => void
}

export function ResultDisplay({ image, isAnalyzing, result, error, onReset }: ResultDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Image Preview */}
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-muted">
          <Image src={image || "/placeholder.svg"} alt="Gráfica subida" fill className="object-contain" />
        </div>
      </Card>

      {/* Analysis Status */}
      {isAnalyzing && (
        <Card className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Analizando gráfica...</h3>
              <p className="text-muted-foreground">Identificando patrones y calculando la ecuación</p>
            </div>
          </div>
        </Card>
      )}

      {error && !isAnalyzing && (
        <Card className="p-8 border-destructive/50 bg-destructive/5">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Error en el Análisis</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={onReset} variant="outline" className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Intentar de nuevo
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Results */}
      {result && !isAnalyzing && !error && result.steps && (
        <div className="space-y-6">
          {/* Equation Result */}
          <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">Ecuación Identificada</h3>
                <p className="text-sm text-muted-foreground">Tipo: {result.graphType}</p>
              </div>
            </div>

            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary font-mono">{result.equation}</p>
              </div>
            </div>
          </Card>

          {/* Step by Step Analysis */}
          <Card className="p-6 md:p-8">
            <h3 className="text-2xl font-bold mb-6">Análisis Paso a Paso</h3>

            <div className="space-y-6">
              {result.steps.map((step, index) => (
                <div key={index} className="relative pl-8 pb-6 last:pb-0">
                  {/* Timeline line */}
                  {index < result.steps.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-border" />
                  )}

                  {/* Step number */}
                  <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed mb-3">{step.description}</p>

                    {step.formula && <div className="bg-muted rounded-lg p-4 font-mono text-sm">{step.formula}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button onClick={onReset} variant="outline" size="lg" className="gap-2 bg-transparent">
              <RotateCcw className="w-5 h-5" />
              Analizar otra gráfica
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
