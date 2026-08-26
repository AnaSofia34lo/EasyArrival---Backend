import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AvailabilityEstimation,
  AvailabilityEstimationInput,
  ParkingAiService,
} from '../../domain/services/parking-ai.service';

@Injectable()
export class LlmParkingAiService extends ParkingAiService {
  private readonly logger = new Logger(LlmParkingAiService.name);

  constructor(private readonly configService: ConfigService) {
    super();
  }

  async estimateAvailability(
    input: AvailabilityEstimationInput,
  ): Promise<AvailabilityEstimation> {
    const provider =
      this.configService.get<string>('AI_PROVIDER')?.toLowerCase() ?? 'heuristic';

    try {
      if (provider === 'gemini') {
        const gemini = await this.estimateWithGemini(input);
        if (gemini) {
          return gemini;
        }
      }

      if (provider === 'deepseek') {
        const deepseek = await this.estimateWithDeepSeek(input);
        if (deepseek) {
          return deepseek;
        }
      }
    } catch (error) {
      this.logger.warn(`Fallo proveedor IA (${provider}): ${(error as Error).message}`);
    }

    return this.estimateHeuristic(input);
  }

  private async estimateWithGemini(
    input: AvailabilityEstimationInput,
  ): Promise<AvailabilityEstimation | null> {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      return null;
    }

    const model = this.configService.get<string>('GEMINI_MODEL') ?? 'gemini-2.0-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const prompt = this.buildPrompt(input);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini respondió con estado ${response.status}`);
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    const text =
      data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('') ??
      '';

    return this.parseModelOutput(text, input.currentAvailabilityPercent);
  }

  private async estimateWithDeepSeek(
    input: AvailabilityEstimationInput,
  ): Promise<AvailabilityEstimation | null> {
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');
    if (!apiKey) {
      return null;
    }

    const model = this.configService.get<string>('DEEPSEEK_MODEL') ?? 'deepseek-chat';
    const baseUrl =
      this.configService.get<string>('DEEPSEEK_BASE_URL') ??
      'https://api.deepseek.com';

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content:
              'Responde SOLO JSON válido con llaves estimatedAvailabilityPercent, confidencePercent y explanation.',
          },
          {
            role: 'user',
            content: this.buildPrompt(input),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek respondió con estado ${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const text = data.choices?.[0]?.message?.content ?? '';

    return this.parseModelOutput(text, input.currentAvailabilityPercent);
  }

  private parseModelOutput(
    output: string,
    fallbackAvailability: number,
  ): AvailabilityEstimation | null {
    if (!output) {
      return null;
    }

    const jsonText = this.extractJson(output);
    if (!jsonText) {
      return null;
    }

    const parsed = JSON.parse(jsonText) as {
      estimatedAvailabilityPercent?: number;
      confidencePercent?: number;
      explanation?: string;
    };

    const estimatedAvailabilityPercent = this.clampPercent(
      parsed.estimatedAvailabilityPercent ?? fallbackAvailability,
    );

    const confidencePercent = this.clampPercent(parsed.confidencePercent ?? 55);
    const explanation =
      parsed.explanation?.trim() ||
      'Estimación basada en disponibilidad actual e histórico reciente.';

    return {
      estimatedAvailabilityPercent,
      confidencePercent,
      explanation,
    };
  }

  private extractJson(text: string): string | null {
    const trimmed = text.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed;
    }

    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start < 0 || end <= start) {
      return null;
    }

    return trimmed.slice(start, end + 1);
  }

  private estimateHeuristic(input: AvailabilityEstimationInput): AvailabilityEstimation {
    const history = input.history;
    const nowHour = new Date().getHours();

    const sameHourValues = history
      .filter((item) => item.recordedAt.getHours() === nowHour)
      .map((item) => item.availabilityPercent);

    const recentValues = history.slice(0, 12).map((item) => item.availabilityPercent);

    const sameHourAvg = this.avg(sameHourValues);
    const recentAvg = this.avg(recentValues);

    const estimate = Math.round(
      input.currentAvailabilityPercent * 0.6 + sameHourAvg * 0.25 + recentAvg * 0.15,
    );

    const confidenceBase = Math.min(85, 40 + history.length * 2);

    return {
      estimatedAvailabilityPercent: this.clampPercent(estimate),
      confidencePercent: this.clampPercent(confidenceBase),
      explanation:
        'Estimación heurística calculada con disponibilidad actual y patrón histórico por hora.',
    };
  }

  private buildPrompt(input: AvailabilityEstimationInput): string {
    const historyForPrompt = input.history.slice(0, 24).map((item) => ({
      availabilityPercent: item.availabilityPercent,
      recordedAt: item.recordedAt.toISOString(),
    }));

    return JSON.stringify(
      {
        task: 'Estimar disponibilidad porcentual de un parqueadero para los próximos minutos',
        parking: {
          id: input.parking.id,
          name: input.parking.name,
          totalCapacity: input.parking.totalCapacity,
          pricePerHour: input.parking.pricePerHour,
        },
        destinationName: input.destinationName ?? null,
        currentAvailabilityPercent: input.currentAvailabilityPercent,
        history: historyForPrompt,
        outputFormat: {
          estimatedAvailabilityPercent: 'number 0-100',
          confidencePercent: 'number 0-100',
          explanation: 'string breve en español',
        },
      },
      null,
      2,
    );
  }

  private clampPercent(value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }

    return Math.max(0, Math.min(100, Math.round(value)));
  }

  private avg(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    const total = values.reduce((acc, current) => acc + current, 0);
    return total / values.length;
  }
}
