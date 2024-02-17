import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 5001;
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Nest-Sandbox')
    .setDescription('The Nest-Sandbox API description')
    .setVersion('1.0.0')
    .addTag('A Tag')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  // a guard for ALL endpoints example:
  // app.useGlobalGuards(JwtAuthGuard);

  await app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`),
  );
}

bootstrap();
