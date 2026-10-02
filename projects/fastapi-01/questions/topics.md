# Topic Vocabulary (controlled)

Every question carries exactly **one** primary Topic hashtag, drawn from this list. If a topic you need is not here, add it here first (with a one-line definition), then use it. No off-registry tags.

**Naming convention:** API name verbatim when one exists in lowercase snake_case (such as `response_model`, `background_tasks`), snake_case concept otherwise (`asgi_runtime`, `parameter_disambiguation`).

---

# FastAPI Tags (Q01–Q60)

## Protocol and ASGI Runtime
- `#asgi_runtime`: Protocol boundaries, Uvicorn, ASGI scope, and non-blocking asynchronous concurrency.
- `#async_execution`: Event loop scheduling, `def` versus `async def` mechanics, and threadpool delegation.
- `#project_scaffolding`: `FastAPI()` instance initialization, internal route tables, and OpenAPI generator setup.
- `#route_decorators`: Route registration decorators, HTTP method matching, and module import-time dispatch.

## Parameter Extraction and Validation
- `#path_parameters`: Dynamic URL path segments, type conversion, and parameter type hints.
- `#validation_errors`: Request validation failures, error interceptors, and 422 Unprocessable Entity anatomy.
- `#query_parameters`: Query string extraction, default values, and parameter optionality.
- `#parameter_disambiguation`: Resolution rules distinguishing Path, Query, Header, Cookie, and Request Body parameters.
- `#parameter_constraints`: `Path()` and `Query()` validation rules: regex patterns, string lengths, and numeric ranges.
- `#request_body`: Deserialization of incoming JSON payloads into structured Python models.
- `#nested_models`: Hierarchical JSON payload validation, nested schemas, and compound error paths.
- `#extra_data_types`: Native parsing of UUIDs, dates, datetimes, timedeltas, and Decimals.

## Pydantic Core and Serialization
- `#pydantic_core`: Pydantic `BaseModel` architecture, type validation, and runtime dictionary safety.
- `#field_validators`: `@field_validator` and `@model_validator` custom logic and cross-field invariants.
- `#strict_mode`: Pydantic type coercion versus strict validation modes and data integrity.
- `#response_model`: Output filtering, schema contracts, and internal database field leak prevention.
- `#serialization_filtering`: `response_model_exclude_unset`, exclude defaults, and payload optimization.
- `#status_codes`: Semantic HTTP status codes, status code configuration, and API contract reliability.

## Error Handling and Request Lifecycle
- `#error_handling`: `HTTPException` mechanics, exception bubbling, and aborting requests cleanly.
- `#custom_exceptions`: Global exception handlers, domain exceptions, and RFC-compliant error envelopes.
- `#headers_cookies`: Header and Cookie parameter annotations, extraction, and validation.
- `#form_data`: URL-encoded form submissions with `Form()`, OAuth2 login forms, and multipart requirements.
- `#file_uploads`: Binary file processing: in-memory `bytes` versus disk-spooled `UploadFile`.
- `#custom_responses`: Direct response rendering: `StreamingResponse`, `FileResponse`, and `RedirectResponse`.

## Dependency Injection and Core Engine
- `#dependency_injection`: The `Depends()` primitive, decoupling shared logic, and request parameter injection.
- `#sub_dependencies`: Multi-tier dependency trees, graph resolution, and `use_cache=True` caching.
- `#dependencies_yield`: Context management with `yield`: deterministic database session setup and teardown.
- `#class_dependencies`: Class-based dependencies with `__call__` or `__init__` for parameterized logic.
- `#security_dependencies`: `OAuth2PasswordBearer`, security schemes, and token extraction in OpenAPI.
- `#router_dependencies`: Applying dependencies globally to `FastAPI(dependencies=[...])` or `APIRouter`.
- `#testing_dependencies`: Swapping dependencies with `app.dependency_overrides` for isolated testing.
- `#app_lifespan`: Modern `@asynccontextmanager` lifespan protocol versus deprecated startup and shutdown events.
- `#openapi_metadata`: OpenAPI schema generation, docstrings, operation IDs, tags, and Swagger UI styling.

## Modular Architecture and Persistence
- `#modular_architecture`: Organizing applications with `APIRouter`, avoiding circular imports, and route mounting.
- `#configuration_settings`: Application configuration with `pydantic-settings`, `.env` loading, and fail-fast startup.
- `#sqlmodel_core`: Unifying Pydantic schemas and SQLAlchemy tables in SQLModel without field duplication.
- `#database_sessions`: Managing database sessions, scoped lifecycles, and connection pool exhaustion prevention.
- `#async_database`: Asynchronous database sessions with `AsyncSession` and async database engine trade-offs.
- `#database_migrations`: Managing table evolutions with Alembic, migration autogeneration, and schema revisions.
- `#password_hashing`: Password security: slow adaptive hashing (`bcrypt`, `argon2`) versus fast cryptographic hashes.
- `#jwt_authentication`: Stateless authentication with JSON Web Tokens, cryptographic signatures, and claims.
- `#rbac_scopes`: Role-Based Access Control and OAuth2 scopes using hierarchical security dependencies.

## Concurrency, Middleware, Systems and Deployment
- `#background_tasks`: Built-in `BackgroundTasks` lifecycle, post-response execution, and worker queue boundaries.
- `#cors_middleware`: Cross-Origin Resource Sharing, browser preflight `OPTIONS` requests, and `CORSMiddleware`.
- `#asgi_middleware`: The ASGI middleware onion model, intercepting requests and modifying response headers.
- `#middleware_traps`: Starlette `BaseHTTPMiddleware` streaming memory buffering and exception handling traps.
- `#rate_limiting`: Throttling client requests per IP and token to defend against denial of service.
- `#websockets_realtime`: Persistent bidirectional WebSocket connections, handshake protocols, and message dispatch.
- `#server_sent_events`: Unidirectional server streaming with Server-Sent Events over standard HTTP connections.
- `#event_loop_starvation`: Identifying CPU-bound blocking in `async def` and offloading to worker process pools.
- `#testclient_testing`: Fast in-memory API testing with Starlette `TestClient` and HTTPX.
- `#async_testing`: Asynchronous testing with `pytest-asyncio` and `httpx.AsyncClient` for lifespans and streaming.
- `#docker_containerization`: Writing lean, multi-stage production Dockerfiles without root permissions or dev bloat.
- `#process_workers`: Worker process scaling across CPU cores: Uvicorn workers managed by Gunicorn or containers.
- `#reverse_proxies_root_path`: Running behind Nginx or Traefik, prefix routing, and the `root_path` OpenAPI fix.
- `#sub_applications`: Mounting independent applications with `app.mount()`, isolated middleware, and distinct docs.
- `#custom_request_route`: Subclassing `APIRoute` and `Request` for custom serialization, timing, and distributed tracing.
- `#production_hardening`: Security audits, locking down public Swagger UI, masking error traces, and header hardening.
