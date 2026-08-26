import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('EasyArrival API')
    .setDescription(
      'API para planificar llegadas: consulta parqueaderos cercanos, distancias y disponibilidad actual o estimada por IA.',
    )
    .setVersion('1.0')
    .addTag(
      'parkings',
      'Consultas de parqueaderos, distancias y disponibilidad',
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'EasyArrival API | Swagger',
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
