# FastAPI Core and Production Interview Questions

A unified, strictly dependency-ordered curriculum of **60 questions**: FastAPI Core (Q01–Q35) and Production Architecture, Security, and Scale (Q36–Q60). One continuous numbering scale, sections stacked one under the other, so any question can be cited by its number (e.g., "write the lecture for Q42").

## Format

Every question is a row with five columns:

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|

- **#**: Stable unique ID. Continuous 1–60. Cite any question by number.
- **Tier**: `❱ CORE` / `❱❱ MORE` / `❱❱❱ ADVANCED` for depth. Part Two uses the same three tiers with a `(Production)` suffix, e.g. `❱ CORE (Production)`.
- **Topic**: One hashtag from `topics.md` (controlled vocabulary). One primary tag per question.
- **Question**: Interview register. Becomes the `> INTERVIEW QUESTION | ...` callout line of the lecture.
- **Hook**: Pain-point framing anchored in The National Times reference world. Becomes the seed of the lecture's Opening Ladder.

## Pedagogical Philosophy and Curriculum Design

This curriculum is structured to serve two audiences simultaneously without compromise:
1. **The First-Time Learner (Zero-Gap Pedagogical Arc)**: The questions follow a strict topological dependency order. Concept $N$ never assumes concept $N+1$. Fundamentals that are often omitted in senior interview lists (such as raw ASGI protocol parsing, parameter disambiguation heuristics, and 422 error body anatomy) are explicitly elevated to foundational lessons so a newcomer builds an unbroken mental model from ground zero.
2. **The Senior Web Developer (Interview Defense and Depth)**: Even the simplest foundational topics are framed through an architectural interview lens. Instead of asking how to write basic syntax, every question investigates runtime cause, browser or client effects, memory layout, event-loop implications, and production failure boundaries.

### Reading Paths

- **First-Time Learner:** Read `❱ CORE` in order, both parts (Q01–Q35, then Q36–Q60). You will be able to design, implement, test, and ship a production-grade backend API.
- **Working Developer:** Finish `❱ CORE`, then dip into `❱❱ MORE` by topic as daily engineering tasks demand.
- **Senior Interview Preparation:** Skim `❱ CORE` to audit fundamentals, then drill `❱❱ MORE` and `❱❱❱ ADVANCED` to master threadpool mechanics, event-loop starvation, middleware traps, and proxy prefix routing.

---

# PART ONE: FASTAPI CORE (Q01–Q35)

## ❱ CORE: The Protocol and Runtime Bed (Q01–Q06)

The fundamental path establishing how network sockets reach Python code, why ASGI replaces WSGI, how the event loop schedules requests, and how the `FastAPI` application instance registers routes.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 1 | ❱ CORE | #asgi_runtime | What is FastAPI, and how does the ASGI specification differ from legacy WSGI servers? | A legacy Flask app at The National Times blocks an entire worker process on a 3-second database query, dropping incoming traffic during breaking news. FastAPI claims non-blocking concurrency. What physically changed in the server model? |
| 2 | ❱ CORE | #asgi_runtime | What role does Uvicorn play in the FastAPI stack, and how does the event loop schedule requests? | You wrote `app = FastAPI()`, but terminal commands tell you to run `uvicorn main:app`. What does Uvicorn do that FastAPI cannot do alone, and how do sockets reach your app? |
| 3 | ❱ CORE | #async_execution | What is the mechanical difference between `def` and `async def` route handlers in FastAPI? | An engineer puts `time.sleep(5)` inside an `async def` endpoint for story syndication and freezes every other reader on the site. Why did the asynchronous promise break? |
| 4 | ❱❱ MORE | #async_execution | How does FastAPI safely execute synchronous `def` endpoints without blocking the event loop? | Your endpoint calls a legacy synchronous database library to fetch print archives. If you declare it as normal `def`, how does FastAPI use the Starlette threadpool to save your server? |
| 5 | ❱ CORE | #project_scaffolding | How does the `FastAPI()` application instance initialize, and what happens when Uvicorn mounts it? | You instantiate `app = FastAPI()`. What internal routing tables, OpenAPI schema generators, and Starlette middleware stacks are allocated in memory before the first request lands? |
| 6 | ❱ CORE | #route_decorators | What does the `@app.get()` decorator actually do at Python import time? | The server has not received a single HTTP request yet, but FastAPI already knows every endpoint. How do decorators register route definitions before runtime begins? |

## ❱ CORE: Parameter Extraction and Validation (Q07–Q14)

Extracting data from HTTP requests: URL path segments, query strings, headers, and request bodies, driven by Python type hints.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 7 | ❱ CORE | #path_parameters | How do path parameters extract dynamic URL segments, and how does Python type hinting trigger parsing? | A reader requests `/articles/42`. How does FastAPI convert that URL string into Python integer `42` before your function body even starts? |
| 8 | ❱ CORE | #validation_errors | What happens when parameter validation fails, and what is the exact anatomy of a `422 Unprocessable Entity` response? | A visitor passes `/articles/breaking-news` to an integer article route. Instead of crashing Python with a `ValueError`, FastAPI sends a detailed JSON error. Who intercepted it and how? |
| 9 | ❱ CORE | #query_parameters | How does FastAPI distinguish query parameters from path parameters, and how do default values define optionality? | The National Times needs `/search?q=election&limit=10`. How does FastAPI parse query parameters without any special decorators in the function arguments? |
| 10 | ❱ CORE | #parameter_disambiguation | By what exact rules does FastAPI disambiguate between Path, Query, and Request Body parameters? | A junior developer writes a function with three arguments and no decorators. How does the engine decide which comes from the URL, which from the query string, and which from JSON? |
| 11 | ❱❱ MORE | #parameter_constraints | How do `Path()` and `Query()` enforce regex patterns, string lengths, and numeric boundaries? | An article slug must be lowercase alphanumeric with hyphens, and page numbers cannot be negative. How do parameter objects validate boundaries before business logic runs? |
| 12 | ❱ CORE | #request_body | How does FastAPI deserialize and validate an incoming JSON request body? | A POST request arrives with raw JSON bytes for a new press dispatch. How does FastAPI transform that byte stream into a structured object your editor recognizes? |
| 13 | ❱ CORE | #nested_models | How do nested Pydantic models validate complex hierarchical JSON payloads? | An article payload includes an author object and a list of tag objects. How does Pydantic traverse the tree and report errors on deeply nested keys? |
| 14 | ❱❱ MORE | #extra_data_types | How does FastAPI natively parse UUIDs, dates, datetimes, and Decimals from URL and JSON inputs? | Parsing ISO-8601 publication timestamps by hand in Python is error-prone. How do type hints automate date parsing and error handling out of the box? |

## ❱ CORE: Pydantic Core and Serialization (Q15–Q20)

Establishing data integrity in memory, cross-field validation, strict parsing modes, and preventing data leaks on response output.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 15 | ❱ CORE | #pydantic_core | What is Pydantic `BaseModel`, and why are unvalidated Python dictionaries an architectural liability in production? | A team passes raw dictionaries between functions; a missing key throws a `KeyError` at 3 AM in production. How does Pydantic provide schema guarantees in memory? |
| 16 | ❱ CORE | #field_validators | How do `@field_validator` and `@model_validator` enforce business rules across multiple fields? | A subscriber promo code expiration date cannot be earlier than its activation date. Where does that cross-field validation logic live before the request reaches the router? |
| 17 | ❱❱ MORE | #strict_mode | What is the difference between Pydantic's default type coercion and strict validation mode? | A client sends the string `"1"` for an integer edition count, or `"yes"` for a boolean. Pydantic silently coerces it by default. When does this cause silent data bugs, and how do you lock it down? |
| 18 | ❱ CORE | #response_model | Why is returning raw internal models a security defect, and how does `response_model` filter outputs? | An endpoint returns a user database record, accidentally leaking the `hashed_password` to the reader's browser. How does `response_model` act as an output firewall? |
| 19 | ❱❱ MORE | #serialization_filtering | How do `response_model_exclude_unset` and `response_model_exclude_none` optimize JSON payload sizes? | A story schema has fifty optional syndication fields; sending them all as `null` bloats payload size over mobile networks. How do you serialize only values the editor actually set? |
| 20 | ❱ CORE | #status_codes | How do you set HTTP status codes explicitly, and why is returning `200 OK` with error payloads an anti-pattern? | A submission endpoint publishes an article but returns `200 OK` instead of `201 Created`. Why do frontend caches and HTTP clients break when status codes are ignored? |

## ❱ CORE: Error Handling and Request Lifecycle (Q21–Q26)

Aborting requests safely, mapping domain errors to RFC standards, and processing non-JSON request types like forms and binary files.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 21 | ❱ CORE | #error_handling | What is `HTTPException`, and how does FastAPI convert Python exceptions into HTTP responses? | An article ID is missing from the database. Raising a standard Python exception produces an ugly 500 server crash. How does `HTTPException` safely abort the request? |
| 22 | ❱❱ MORE | #custom_exceptions | How do you register global exception handlers for domain-specific errors? | Your subscription service raises a custom `PaywallLocked` exception. How do you catch it globally and map it to a uniform RFC-7807 error format across the entire paper? |
| 23 | ❱ CORE | #headers_cookies | How do you read and validate incoming HTTP headers and cookies using type annotations? | An editorial client sends an `X-Staff-Token` header and a session cookie. How does FastAPI extract and validate them without manually parsing `request.headers`? |
| 24 | ❱ CORE | #form_data | When must you use `Form()` instead of JSON request bodies, and how does `python-multipart` parse form data? | An author login page posts URL-encoded form data. The endpoint expects JSON and fails with a 422 error. Why are form payloads treated differently from JSON payloads? |
| 25 | ❱ CORE | #file_uploads | What is the mechanical difference between reading file uploads as `bytes` versus `UploadFile`? | A photographer uploads a 2GB raw video file. Using `bytes` loads the entire file into RAM, crashing the server with an out-of-memory kill. How does `UploadFile` spool to disk safely? |
| 26 | ❱❱ MORE | #custom_responses | When and how do you use `StreamingResponse`, `FileResponse`, and `RedirectResponse`? | A subscriber downloads a 50MB PDF edition. Loading it into memory before sending causes high latency and memory spikes. How do you stream chunks directly to the network socket? |

## ❱ CORE: Dependency Injection and Core Engine (Q27–Q35)

FastAPI's signature architecture: composable dependencies, execution graphs, resource cleanup, lifespan management, and OpenAPI schemas.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 27 | ❱ CORE | #dependency_injection | What is Dependency Injection, and how does the `Depends()` primitive eliminate duplicated setup logic? | Ten different newsroom endpoints all need database access and pagination parameters. Copy-pasting that logic across all ten causes drift. How does `Depends` centralize it? |
| 28 | ❱ CORE | #sub_dependencies | How does FastAPI resolve hierarchical dependency graphs, and how does `use_cache=True` work? | Dependency B depends on Dependency A, and Dependency C also depends on Dependency A. How does FastAPI ensure Dependency A runs only once per request? |
| 29 | ❱ CORE | #dependencies_yield | How do dependencies with `yield` manage context setup and teardown phases? | You open a database transaction at the start of a story save. How does `yield` guarantee that the connection closes or rolls back even if an exception occurs mid-route? |
| 30 | ❱❱ MORE | #class_dependencies | How can Python classes be used as dependencies to maintain state and provide reusable parameter validation? | Multiple editorial search endpoints share sorting, filtering, and pagination parameters. How does a class-based dependency parse and group them into a single clean instance? |
| 31 | ❱❱ MORE | #security_dependencies | How does `OAuth2PasswordBearer` integrate with FastAPI's dependency injection system? | You see `OAuth2PasswordBearer(tokenUrl="token")` in tutorials. Does it validate tokens, or does it merely extract the header and tell Swagger UI where to log in? |
| 32 | ❱❱ MORE | #router_dependencies | How do you apply security dependencies globally or across an entire `APIRouter`? | An editorial admin router has 25 endpoints. Adding `Depends(verify_editor)` to all 25 handlers is fragile. How do you lock down the entire router at definition time? |
| 33 | ❱ CORE | #testing_dependencies | How does `app.dependency_overrides` enable clean unit and integration testing without database mocking hacks? | You want to test the paywall endpoint without writing to production Postgres. How does FastAPI allow test suites to swap out dependencies for in-memory fakes seamlessly? |
| 34 | ❱ CORE | #app_lifespan | Why were `@app.on_event("startup")` and `"shutdown"` deprecated, and how does the `@asynccontextmanager` lifespan protocol work? | A server boots up and needs to initialize a shared Redis connection pool, then close it cleanly on SIGTERM. How does the modern lifespan manager coordinate this? |
| 35 | ❱ CORE | #openapi_metadata | How does FastAPI generate the OpenAPI JSON schema, and how do docstrings, tags, and summaries populate Swagger UI? | The mobile app team needs API documentation. Without writing a single line of YAML, FastAPI serves `/docs`. Where did every title, description, and schema come from? |

---

# PART TWO: PRODUCTION ARCHITECTURE, PERSISTENCE, SECURITY, AND SCALE (Q36–Q60)

## ❱ CORE (Production): Modular Architecture and Persistence (Q36–Q44)

Structuring multi-module applications, uniting Pydantic with SQLAlchemy through SQLModel, managing database connections, and securing credentials.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 36 | ❱ CORE (Production) | #modular_architecture | How do large FastAPI projects structure code using `APIRouter` without hitting circular import traps? | The National Times backend grows to 4,000 lines in one file. The team tries splitting it into router files, only to hit Python circular import errors on startup. What is the clean architecture? |
| 37 | ❱ CORE (Production) | #configuration_settings | How does `pydantic-settings` load and validate environment variables at application startup? | A staging environment accidentally connects to production database credentials because an env var was misspelled. How does `BaseSettings` fail-fast at boot time? |
| 38 | ❱ CORE (Production) | #sqlmodel_core | What is SQLModel, and how does it bridge the gap between Pydantic validation schemas and SQLAlchemy database tables? | In standard stacks, you write a Pydantic schema for the API and an identical SQLAlchemy model for the DB. How does SQLModel eliminate that duplication without losing features? |
| 39 | ❱ CORE (Production) | #database_sessions | How do you manage database sessions in FastAPI using dependency injection with `yield`? | Under breaking-news load, the application exhausts the database connection pool because handlers leave sessions open. How does the session dependency guarantee release? |
| 40 | ❱❱ MORE (Production) | #async_database | What are the architectural differences and trade-offs between synchronous SQLAlchemy sessions and `AsyncSession`? | Moving to async database drivers promised 10x throughput, but caused complex session bugs and race conditions. When is async database I/O actually beneficial? |
| 41 | ❱❱ MORE (Production) | #database_migrations | How does Alembic integrate with FastAPI and SQLModel to manage incremental database schema migrations? | You add an `is_premium` column to a SQLModel article class, but the database throws column-not-found errors. How do automated migrations keep table schemas in sync with code? |
| 42 | ❱ CORE (Production) | #password_hashing | How should passwords be hashed using `bcrypt` or `argon2`, and why is raw hashing with SHA-256 an immediate failure? | A subscriber database leaks, and all user passwords are cracked in minutes because they were hashed with fast SHA-256. How do slow, salted adaptive hashing algorithms protect credentials? |
| 43 | ❱ CORE (Production) | #jwt_authentication | How do JSON Web Tokens (JWT) authenticate stateless API requests, and what are their validation mechanics? | The API server scales to 10 instances. How does a cryptographically signed JWT allow each instance to verify subscriber identity without querying a centralized session store? |
| 44 | ❱❱ MORE (Production) | #rbac_scopes | How do you implement Role-Based Access Control (RBAC) and OAuth2 scopes using dependency injection? | Free readers, journalists, and editors-in-chief hit the same endpoint, but editors get publishing controls. How do security dependencies enforce granular permissions cleanly? |

## ❱ CORE (Production): Concurrency, Middleware, Systems, and Deployment (Q45–Q60)

Real-time streaming, background tasks, middleware traps, rate limiting, Docker optimization, multi-worker scaling, and reverse proxy mechanics.

| # | Tier | Topic | Question | Hook |
|---|---|---|---|---|
| 45 | ❱ CORE (Production) | #background_tasks | What is the execution boundary of FastAPI's built-in `BackgroundTasks`, and when must you migrate to Celery or ARQ? | An endpoint sends a subscriber welcome email in a background task; during heavy traffic, worker processes crash and pending emails disappear forever. What are the limits of in-process tasks? |
| 46 | ❱ CORE (Production) | #cors_middleware | What does the browser do during a CORS preflight `OPTIONS` request, and how does `CORSMiddleware` configure access? | A React frontend on `news.nationaltimes.com` fetches from FastAPI on `api.nationaltimes.com` and the browser blocks the request with a CORS error. How do you configure origin policies safely? |
| 47 | ❱❱ MORE (Production) | #asgi_middleware | How does the ASGI middleware onion model process requests on the way in and responses on the way out? | You need to measure the response time of every request and attach a `X-Process-Time` header to monitor API latency. How does middleware wrap the application callable? |
| 48 | ❱❱❱ ADVANCED (Production) | #middleware_traps | What are the known pitfalls of Starlette's `BaseHTTPMiddleware` regarding request streaming and exception handling? | Adding a simple logging middleware causes streaming video responses to buffer completely into RAM and hides downstream exceptions. Why does `BaseHTTPMiddleware` have this issue? |
| 49 | ❱❱ MORE (Production) | #rate_limiting | How do you implement rate limiting in FastAPI to protect endpoints from brute force and denial of service? | A scraper hits the public search API 10,000 times a minute, exhausting database connections. How do you throttle requests per IP or user token? |
| 50 | ❱❱ MORE (Production) | #websockets_realtime | What are WebSockets in FastAPI, and how do they differ fundamentally from HTTP request-response cycles? | A live election-night ticker needs instant headline updates without the frontend polling the server every two seconds. How does FastAPI maintain persistent, bidirectional WebSocket sockets? |
| 51 | ❱❱ MORE (Production) | #server_sent_events | When should you choose Server-Sent Events (SSE) over WebSockets for one-way server streaming? | An AI headline assistant streams tokens to a journalist. WebSockets are bidirectional and complex; how does SSE stream plain HTTP text chunks with automatic reconnection? |
| 52 | ❱❱❱ ADVANCED (Production) | #event_loop_starvation | How do CPU-bound operations starve the `asyncio` event loop, and how do you offload them to process pools? | A route generates PDF front-page proofs using CPU-heavy rendering inside `async def`, causing all health checks to fail and load balancers to drop the server. What is the cure? |
| 53 | ❱ CORE (Production) | #testclient_testing | How does Starlette's `TestClient` execute synchronous end-to-end tests against ASGI apps without running a live server? | You want fast, deterministic tests in CI/CD. How does `TestClient` (backed by `httpx`) simulate network calls entirely in memory without opening local ports? |
| 54 | ❱❱ MORE (Production) | #async_testing | How do you write asynchronous tests with `pytest-asyncio` and `httpx.AsyncClient` for async endpoints and lifespans? | Your app uses async lifespan context managers and WebSockets, causing synchronous `TestClient` to miss lifecycle events. How do you test in a real async environment? |
| 55 | ❱ CORE (Production) | #docker_containerization | How do you write a production-ready `Dockerfile` for FastAPI, and why should you avoid installing dev dependencies? | A team deploys a 1.2GB Docker container that runs as root and takes 5 minutes to pull. How do multi-stage builds and non-root users create lean, secure images? |
| 56 | ❱ CORE (Production) | #process_workers | Why should you never run Uvicorn with `--reload` in production, and how do worker processes scale across CPU cores? | Python's Global Interpreter Lock (GIL) limits one core per process. How does Gunicorn or container clustering manage multiple Uvicorn worker processes? |
| 57 | ❱❱❱ ADVANCED (Production) | #reverse_proxies_root_path | How do reverse proxies (Nginx, Traefik) route traffic to FastAPI, and why does Swagger UI break behind subpaths? | The API is hosted behind `https://nationaltimes.com/api/v1/`. The endpoints work, but `/docs` displays a blank page because OpenAPI schemas fetch from the wrong path. What is `root_path`? |
| 58 | ❱❱ MORE (Production) | #sub_applications | How do you mount independent FastAPI sub-applications, and how do their OpenAPI docs and middleware isolate? | The newspaper has a public reader API and an internal editorial API with different auth rules. How does `app.mount()` keep their schemas and routing trees separate? |
| 59 | ❱❱❱ ADVANCED (Production) | #custom_request_route | When would you subclass `APIRoute` or `Request` to implement custom body parsing, telemetry, or request tracing? | You need distributed tracing with a unique trace ID attached to every log and database query across the entire system. How does a custom `APIRoute` intercept execution before parameter parsing? |
| 60 | ❱ CORE (Production) | #production_hardening | What steps are required to harden a FastAPI app for production before exposing it to the public internet? | Security audits flag exposed `/docs` in production, unhandled 500 error traces leaking stack details, and missing security headers. How do you lock down the app? |
