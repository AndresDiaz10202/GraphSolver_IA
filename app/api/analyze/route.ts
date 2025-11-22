import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json()

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analiza esta gráfica matemática y proporciona:
1. La ecuación matemática que representa (en formato LaTeX si es posible, pero sin los delimitadores $$)
2. El tipo de función (lineal, cuadrática, exponencial, trigonométrica, etc.)
3. Un análisis paso a paso de cómo llegaste a esa ecuación (mínimo 4 pasos detallados)

Responde ÚNICAMENTE con un JSON válido en este formato exacto:
{
  "equation": "ecuación aquí",
  "graphType": "tipo de función",
  "steps": [
    {
      "title": "Título del paso",
      "description": "Descripción detallada",
      "formula": "fórmula opcional"
    }
  ]
}`,
            },
            {
              type: "image",
              image: image,
            },
          ],
        },
      ],
    })

    // Parse the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No se pudo extraer JSON de la respuesta")
    }

    const result = JSON.parse(jsonMatch[0])

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error in analyze API:", error)
    const errorMessage = error instanceof Error ? error.message : "Error al analizar la gráfica"
    return NextResponse.json(
      {
        error:
          "No se pudo analizar la gráfica. Por favor, asegúrate de que la imagen sea clara y contenga una gráfica matemática visible.",
        details: errorMessage,
      },
      { status: 500 },
    )
  }
}
