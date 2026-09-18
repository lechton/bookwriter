# NestJS Topics / Controlled Vocabulary

Every question in `questions.md` must use exactly one primary tag from this list.

## Core Architecture
- `#controllers` — `@Controller()`, routing paths, `@Get()`, `@Post()`, `@Body()`, `@Query()`, `@Param()`.
- `#providers` — `@Injectable()`, standard providers, services, dependency injection via constructor.
- `#modules` — `@Module()`, `imports`, `controllers`, `providers`, `exports`, module encapsulation.
- `#application_context` — `NestFactory.create()`, standalone applications and boot phase.

## Enhancers
- `#middleware` — `NestMiddleware`, `app.use()`, functional middleware, route configuration.
- `#exception_filters` — `@Catch()`, `ExceptionFilter`, `HttpException`, global vs controller-scoped filters.
- `#pipes` — `PipeTransform`, `@UsePipes()`, `ValidationPipe`, `ParseIntPipe`, transformation vs validation.
- `#guards` — `CanActivate`, `@UseGuards()`, role-based access control, execution context in guards.
- `#interceptors` — `NestInterceptor`, `CallHandler`, RxJS operators (`map`, `tap`, `catchError`), request/response mapping.
- `#custom_decorators` — `createParamDecorator()`, combining decorators (`applyDecorators()`).

## Fundamentals & DI
- `#execution_context` — `ExecutionContext`, `ArgumentsHost`, accessing Request/Response generically.
- `#di_scopes` — `Scope.DEFAULT`, `Scope.REQUEST`, `Scope.TRANSIENT`, performance implications of scopes.
- `#dynamic_modules` — `forRoot()`, `register()`, `DynamicModule` interface, configuration passing.
- `#circular_dependency` — `forwardRef()`, ModuleRef, resolving circular DI chains.
- `#lifecycle` — `OnModuleInit`, `OnApplicationBootstrap`, `OnModuleDestroy`, shutdown hooks.
- `#async_providers` — `useFactory`, `inject`, waiting for DB connection or external config.
- `#module_reference` — `ModuleRef`, dynamically retrieving providers.

## Ecosystem & Techniques
- `#validation` — `class-validator`, `class-transformer`, `ValidationPipe` payload stripping and typing.
- `#serialization` — `ClassSerializerInterceptor`, `@Exclude()`, `@Expose()`, manipulating output JSON.
- `#typeorm` — `@nestjs/typeorm`, `TypeOrmModule`, repositories, entities, transactions.
- `#mongoose` — `@nestjs/mongoose`, schemas, models, document injection.
- `#caching` — `CacheModule`, `CacheInterceptor`, in-memory cache vs Redis cache.
- `#queues` — `@nestjs/bull`, BullMQ, producers, consumers, job processing.
- `#task_scheduling` — `@nestjs/schedule`, `@Cron()`, `@Interval()`, `@Timeout()`.
- `#configuration` — `@nestjs/config`, `ConfigModule`, environment variables, validation.
- `#logger` — `Logger`, custom loggers, `ConsoleLogger`.
- `#file_upload` — `@nestjs/platform-express`, `FileInterceptor`, Multer integration.

## Security
- `#auth` — Authentication strategies, session vs token, `@nestjs/passport`.
- `#jwt` — `@nestjs/jwt`, `JwtModule`, signing and verifying tokens.
- `#rbac` — Authorization, Role-Based Access Control, custom `@Roles()` decorators with Guards.
- `#helmet` — Security headers, `helmet` integration.
- `#rate_limiting` — `@nestjs/throttler`, `ThrottlerModule`, limiting brute-force.

## GraphQL
- `#graphql_overview` — `@nestjs/graphql`, Apollo Server/Mercurius, schemas.
- `#graphql_code_first` — `@ObjectType()`, `@Field()`, generating schema from TS classes.
- `#graphql_schema_first` — `.graphql` files, generating TS typings from schema.
- `#resolvers` — `@Resolver()`, `@Query()`, `@Mutation()`, `@Args()`.
- `#graphql_subscriptions` — `@Subscription()`, PubSub, WebSockets in GQL.
- `#dataloader` — N+1 problem, batching and caching queries.

## Microservices
- `#microservices_overview` — `NestFactory.createMicroservice()`, `Transport` enum.
- `#message_pattern` — `@MessagePattern()`, Request-Response messaging, returning observables/promises.
- `#event_pattern` — `@EventPattern()`, Event-based messaging, fire-and-forget.
- `#redis_transport` — Redis microservice transport, Pub/Sub.
- `#kafka_transport` — Kafka, `@EventPattern()`, consumer groups, offsets.
- `#grpc_transport` — `@GrpcMethod()`, Protocol Buffers (`.proto`), gRPC clients.

## WebSockets
- `#websockets_gateways` — `@nestjs/websockets`, `@WebSocketGateway()`, `@SubscribeMessage()`.
- `#websockets_adapters` — socket.io vs ws, configuring WebSocket servers.

## Testing & Tooling
- `#testing_unit` — `Test.createTestingModule()`, `compile()`, mocking providers.
- `#testing_e2e` — Supertest, `app.getHttpServer()`, database setup/teardown.
- `#cli` — `nest generate`, `nest build`, `nest start`.
