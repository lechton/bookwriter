# Lecture 93: How One Table Component Keeps Each Row's Type

*(How can one table component show customers and products, and still check every field the caller reads?)*

> INTERVIEW QUESTION | ❱❱❱ ADVANCED | How do you type generic components and flexible data collections in React?

---

## VS | `rows: any[]` vs. `rows: T[]`: `any` forgets what a row is, `T` hands each caller its own row type back

> In plain JavaScript, a function parameter acts as a placeholder for incoming values. **A type parameter, written `<T>`, does the same for data types.** One component accepts rows of any shape, and each caller gets its own row type back. If you type rows with `any`, the compiler ignores what each row contains. A misspelled property passes without warning, and the user clicks a row only to see blank text on screen.

Start with a pattern you write every day in JavaScript. A function parameter is a placeholder name for a value that the caller supplies:

```ts title="A function parameter: the caller fills in the value"
function greet(~name~: string) { return 'Hello, ' + name; } // name is filled in at each call
greet('John'); // Hello, John
greet('Mary'); // Hello, Mary
```

You write the function once, and it accepts any name the caller passes. Now apply that same mechanism to data types. Instead of receiving a value, a function can accept a placeholder for a type. Consider a function that returns the first item from an array. It must handle a list of customer names and a list of product prices with equal safety. Here are two ways to write it:

```ts title="The first item of a list, written with any and with a type parameter"
function firstAny(items: ~any[]~): any { return items[0]; } // Any list, and the type of the item is forgotten
function first~<T>~(items: T[]): T { return items[0]; } // A list of T, and the same T comes back
```

Now imagine a caller introduces a typo when transforming the returned item:

```ts title="The same typo with both functions"
const names = ['John', 'Mary'];
firstAny(names).~toUpperCse~(); // The result is any, so the editor says nothing
first(names).~toUpperCse~(); // **WRONG:** the result is a string, so the editor refuses the typo
```

When using `firstAny`, the editor remains silent. The application crashes in the browser with a runtime error when the code executes. When using `first`, the editor immediately highlights the typo with a red underline:

```text title="The editor's message"
Property 'toUpperCse' does not exist on type 'string'. Did you mean 'toUpperCase'?
```

The editor displays these compiler errors while you write your code (Lesson 90).

Why does `first` know the returned item is a string? TypeScript inspects the incoming argument and automatically binds `T` to `string`. When you pass an array of numbers, TypeScript binds `T` to `number`. You do not write the type by hand. That automated type resolution is the core power of generics.

> [!DEFINITION]
> **What is a type parameter?** [NEW] A type parameter is a placeholder name for a type, written inside angle brackets after a function or component name, such as `T` in `function first<T>`.
> 1. It acts as a type variable that represents a type rather than a runtime value.
> 2. When a caller invokes the function or renders the component, TypeScript replaces `T` with the caller's specific type.
> 3. The letter `T` is a standard naming convention for type, but you can choose any descriptive name, such as `Row` (Lesson 93).

> [!DEFINITION]
> **What is `any`?** [REVIEW] `any` is a TypeScript escape hatch that disables compile-time type verification for a value.
> 1. It tells the compiler to treat all property reads, method calls, and assignments on that value as valid without checking.
> 2. Using `any` silences compiler warnings, but it discards all editor autocompletion and safety checks.
> 3. If your code misnames a property on an `any` value, JavaScript returns `undefined` at runtime and the compiler never warns you (Lesson 91).

### The Same Idea in a React Table

Every React component is fundamentally a function, which means the exact same generic mechanism applies to components. Imagine building an administrative dashboard for an online store. The dashboard displays multiple tables: one for customers and another for products. Rather than writing duplicate table markup, you build one reusable table component. Each section of the dashboard supplies its own dataset to that shared table. Both props definitions below describe a table that renders rows and triggers a callback when the user clicks a row:

```tsx title="Two props types for one shared table"
type DataTableProps = { rows: ~any[]~; onSelectRow: (row: any) => void }; // Rows of any shape, and the shape is forgotten
type DataTableProps<T> = { rows: ~T[]~; onSelectRow: (row: T) => void }; // Rows of one type T, and the same T comes back
```

Now consider a developer who renders the table for a list of customers. The variable `users` holds the customer data. When the user clicks a row, the callback extracts the customer email address and displays it in a status line. The property is named `email`, but the developer accidentally types `emial`:

```tsx title="The Customers table, with a misspelled field"
<DataTable rows={users} onSelectRow={user => setSelected(~user.emial~)} /> {/* The same tag under both props types */}
```

When the table uses `rows: any[]`, the editor accepts the typo without warning. When the table uses `rows: T[]`, the editor flags `emial` immediately:

```text title="The editor's message"
Property 'emial' does not exist on type 'User'. Did you mean 'email'?
```

Both props definitions appear similar on the surface:
1. Both accept arrays of different data structures, including customer records and product items.
2. Both render the exact same DOM elements in the browser, because the compiler strips all TypeScript types before runtime (Lesson 90).
3. Both appear to express the same intent: a reusable table that accepts diverse data collections.

**Although both approaches look identical, their compile-time behavior is completely different:**
- **With `any[]`, the component discards row type information.** The argument passed into `onSelectRow` is typed as `any`. TypeScript disables checks, allowing `user.emial` to compile without error.
- **With `T[]`, the component preserves row type information.** The argument in `onSelectRow` remains typed as `User`. The compiler rejects `user.emial` and suggests the correct property name.

> [!DEFINITION]
> **What is a generic component?** [NEW] A generic component is a React component declared with one or more type parameters, such as `function DataTable<T>`.
> 1. It allows a single component to receive props whose shapes vary depending on which parent component renders it.
> 2. The component binds `T` to the caller's specific row type, preserving that exact type across all callbacks and child elements.
> 3. React never executes `<T>` at runtime because the TypeScript compiler erases all type annotations during the build step (Lesson 93).

```tree caption="Two props types for one shared table: any forgets what a row is, while T remembers it and hands it back to the caller."
Two ways to type the rows of a shared table
- !With `any` [`row: any`] | The table **forgets** what a row is | The row in `onSelectRow` is **`any`**, so **`user.emial` passes**
- +With a type parameter [`row: T`] | The table **remembers** the caller's row type | The row in `onSelectRow` is **`User`**, so **`user.emial` is refused**
```

**Remember this core rule: a type parameter is a placeholder for a type, resolved at each location where the component is rendered.** The component states that incoming rows have type `T`, and the row returned on click has that exact same type `T`. TypeScript resolves `T` at each JSX tag directly from the dataset passed to `rows`.

### What goes wrong with `any`: `Selected:` with nothing after it

**Beware! Typing rows with `any[]` permits typos to pass compiler checks, causing the interface to display empty values when rows are clicked.** Here is the step-by-step breakdown of how this defect manifests:
1. The shared table declares its incoming data as `rows: any[]`.
2. A developer renders the table and writes `onSelectRow={user => setSelected(user.emial)}`.
3. Because the parameter is typed as `any`, the editor displays no warning.
4. The user clicks the customer row for Taylor in the browser.
5. In JavaScript, reading a missing property on an object evaluates to `undefined`.
6. React renders nothing for `undefined` values in JSX (Lesson 10).
7. The status line at the top displays `Selected:` followed by blank space.
8. The browser console produces zero runtime errors, leaving developers with no indication of why the UI is blank.

The interface fails to present the requested data, and no tooling flags the error. When you use `rows: T[]`, the compiler catches the misspelled property immediately during authoring, preventing the bug from ever reaching production.

### The Rule of Thumb: one table, rows of different types, one `T`

**When a single component displays collections of varying data structures, declare a generic type parameter. Use that same type parameter `T` for incoming items and returned callbacks, allowing TypeScript to resolve the type from the caller's data.**

Experienced engineers guard against five classic implementation pitfalls:
1. **Typing rows with `any[]`.** Every parent component loses compile-time verification and editor autocompletion.
2. **Typing rows with `object[]` to avoid `any`.** The compiler blocks all property access, forcing callers to write type assertions like `(user as User).email`. These assertions bypass type checking and permit invalid data shapes.
3. **Writing `<T>` on arrow functions in TSX files.** The JSX parser mistakes `<T>` for an unclosed JSX opening tag.
4. **Reading `row.id` inside the component with an unconstrained `T`.** The compiler rejects property access because an unconstrained type parameter guarantees no properties.
5. **Typing column keys as `string[]`.** The component requires `as any` to index row properties, and misspelled column names render the literal text `'undefined'` inside table cells.

The remainder of this lesson examines each pitfall within a complete administrative dashboard.

## SECTION | A Store Admin Page With Two Tables

Open the administrative dashboard of a small online store. It contains two separate tables constructed from one shared component:
1. At the top of the view, a status line displays `Selected:`, followed by details of whichever row the user clicked.
2. Under the heading Customers, a table displays columns for name and email, containing two records: Taylor and John.
3. Under the heading Products, a table displays columns for name and price, containing two records: a mug for twelve dollars and a shirt for twenty dollars.

```page caption="The store admin page when it opens: nothing is selected yet."
line: Selected:
section: Customers
line: name · email
line: Taylor · taylor@example.com
line: John · john@example.com
section: Products
line: name · price
line: Mug · 12
line: T-shirt · 20
console: quiet
```

When the user clicks the row for Taylor, the top status line updates to show her email:

```page caption="The same page after the user clicks Taylor's row."
line: Selected: taylor@example.com | good
section: Customers
line: name · email
line: Taylor · taylor@example.com
line: John · john@example.com
section: Products
line: name · price
line: Mug · 12
line: T-shirt · 20
console: quiet
```

When the user clicks the row for the mug, the top status line updates to show the product name and its price:

```page caption="The same page after the user clicks the Mug row."
line: Selected: Mug for $12 | good
section: Customers
line: name · email
line: Taylor · taylor@example.com
line: John · john@example.com
section: Products
line: name · price
line: Mug · 12
line: T-shirt · 20
console: quiet
```

Notice what each click handler reads. The click on Customers reads `email`, a property exclusive to customer records. The click on Products reads `price`, a property exclusive to product items. Each table instance must therefore return its own specific row type to the callback.

Developers typically choose among four strategies when typing a shared table like this one. Only the final two strategies belong in professional applications, and each solves a distinct architectural scenario:

```tree caption="Four ways to type a shared table, and when each one fits."
Four ways to type a shared table
- !1. Rows typed `any` [`row: any`] | Accepts every list | **Every check is gone** for every caller
- !2. Rows typed `object` with a type assertion [`user as User`] | Refuses every field read | Every caller writes an assertion that **also passes on the wrong rows**
- +3. One component per kind of row [`CustomersTable` `ProductsTable`] | Fits when the tables **really look different** | Two components to keep in step
- +4. One generic component [`DataTable<T>`] | Fits when one table shows **rows of different types** | Each caller **gets its own row type back**
```

Our two tables share the exact same visual structure while rendering different data records. We will therefore implement the fourth approach using a generic component. The project is a focused React application written in TypeScript:

```files title="store-admin: File Explorer" caption="Our project files: App.tsx holds the customers, the products, and the top line, and DataTable.tsx is the shared table."
index.html | entry | The HTML page with the empty root div where React mounts
tsconfig.json | settings | Tells TypeScript how to read the project
src/
  main.tsx | boundary | Imports `App` from `./App` and mounts it into `#root`
  App.tsx | parent | Holds `selected`, `users`, and `products`, and imports `DataTable`
  DataTable.tsx | generic component | Exports `DataTable` as default
```

**PRINCIPLES:** A generic component names the type of its rows once and returns that exact type to every caller. Four core principles guide the construction of our dashboard:
1. **Principle 1: `DataTable<T>` names the row type once.** Declare `<T>` after the component name, and use that same type parameter for the incoming rows array and the returned row argument.
2. **Principle 2: `rows={users}` fills in `T` as `User`.** The caller writes no manual type annotations. TypeScript infers `T` from the passed array, requiring `onSelectRow` to conform to that exact type.
3. **Principle 3: `T extends { id: number }` lets the table read `row.id`.** An unconstrained type parameter promises zero properties. A generic constraint guarantees that every row provides a numeric identifier for React keys.
4. **Principle 4: `Extract<keyof T, string>[]` lets callers name only real columns.** The compiler rejects misspelled column names, and wrapping dynamic values in `String()` converts cell contents into renderable text.

---

## PRINCIPLE | `DataTable<T>`: the rows go in as `T`, and the clicked row comes back as the same `T`

> [!PRINCIPLE]
> **Principle 1: Type Parameter: `DataTable<T>` Names the Row Type Once**
>
> *When one component shows rows of different types, write a type parameter after the component name, such as `function DataTable<T>`, and use the same `T` for the rows and for the row the component hands back.*
>
> With `rows: any[]`, the table forgets what a row is, so a misspelled field in a caller passes, and the user clicks a row and sees nothing selected. With `rows: object[]`, every caller must write a type assertion, and the assertion also passes on the wrong rows. A type parameter keeps the caller's row type: the rows go in as `T`, and the clicked row comes back as the same `T`. In a `.tsx` file, an arrow function writes `<T,>`, because `<T>` alone opens a JSX tag.
>
> **DO THIS:**
> ```tsx
> type DataTableProps<T> = { rows: T[]; onSelectRow: (row: T) => void };
> function DataTable~<T>~({ rows, onSelectRow }: DataTableProps<T>) { /* ... */ } // Each caller gets its own row type back
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> type DataTableProps = { rows: ~any[]~; onSelectRow: (row: any) => void }; // **WRONG:** user.emial passes, and the Selected line stays empty
> ```

In Lesson 92, you supplied explicit type arguments to hooks, writing expressions like `useState<User | null>(null)`. In that context, you acted as the consumer of an existing generic API. Now you step into the role of component author. You write the component function and establish a type parameter that your consumers satisfy.

Declare the type parameter inside angle brackets immediately following the function name:

```tsx title="A generic component and its props type"
type DataTableProps~<T>~ = { rows: T[]; onSelectRow: (row: T) => void }; // The props type takes a T too
function DataTable~<T>~({ rows, onSelectRow }: DataTableProps<T>) { /* ... */ } // Declares T for the whole function
```

The type parameter `T` is declared once on `DataTable` and passed forward to the props type definition. Inside the props type definition, `T` appears in two critical locations. It defines the incoming rows array and the argument delivered to `onSelectRow`. Reusing `T` in both positions forms the type contract: whatever row type enters the table is the exact type delivered back when a row is selected.

Some developers assume `<T>` represents a special React property. It does not. React never receives `<T>` at runtime. The TypeScript compiler erases all type parameters during the compilation step.

### The first table, typed with `any`

Here is an initial implementation of our reusable table, typed using `any`:

```tsx title="src/DataTable.tsx"
type DataTableProps = {
  rows: ~any[]~; // Any rows at all: the type of a row is forgotten
  onSelectRow: (row: any) => void;
};

export default function DataTable({ rows, onSelectRow }: DataTableProps) {
  return (
    <table>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} onClick={() => ~onSelectRow(row)~}> {/* Hands the clicked row to the caller */}
            <td>{row.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

The parent App component stores the customer list, manages the selection state, and renders the table:

```tsx title="src/App.tsx"
import { useState } from 'react';
import DataTable from './DataTable';

type User = { id: number; name: string; email: string };

const users: User[] = [
  { id: 1, name: 'Taylor', email: 'taylor@example.com' },
  { id: 2, name: 'John', email: 'john@example.com' },
];

export default function App() {
  const [selected, setSelected] = useState('');

  return (
    <>
      <p>Selected: {selected}</p>
      <h2>Customers</h2>
      <DataTable rows={users} onSelectRow={user => setSelected(~user.email~)} /> {/* user is any here: nothing checks this name */}
    </>
  );
}
```

When the user clicks the customer row for Taylor, the application responds:

```page caption="The first version of the page after the user clicks Taylor's row."
line: Selected: taylor@example.com | good
section: Customers
line: Taylor
line: John
console: quiet
```

The interface behaves as expected, but only because the author spelled `email` correctly. If the developer types `user.emial`, the editor remains silent and the interface fails silently.

### Giving the table a type parameter

Now refactor the table to declare a generic type parameter. Only the DataTable file changes:

```tsx title="src/DataTable.tsx"
type DataTableProps~<T>~ = { // T is the type of one row, filled in at each place the table is used
  rows: T[];
  onSelectRow: (row: T) => void;
};

export default function DataTable~<T>~({ rows, onSelectRow }: DataTableProps<T>) { // Passes its T on to the props type
  return (
    <table>
      <tbody>
        {rows.map(row => (
          <tr key={~row.id~} onClick={() => onSelectRow(row)}> {/* **WRONG:** Property 'id' does not exist on type 'T'. */}
            <td>{~row.name~}</td> {/* **WRONG:** Property 'name' does not exist on type 'T'. */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

The caller now benefits from strict type checking. In the App component, the parameter delivered to the callback is typed as `User`. The compiler permits reading `user.email`, while rejecting typos like `user.emial` with an immediate suggestion.

Inside the table body, the compiler displays two red underlines at `row.id` and `row.name`. These warnings do not break the runtime bundle because types are stripped before execution. Principle 3 resolves the identifier check, and Principle 4 introduces dynamic column rendering.

### Where did that `T` come from?

The symbol `T` appears in three distinct locations within the DataTable file:
1. Writing `<T>` after the function name declares `T` across the component scope, exactly as parameter lists declare variable names for the function body.
2. The props type definition declares `<T>`, allowing it to describe data collections of any shape.
3. In the component parameter signature, `DataTableProps<T>` forwards the component type parameter into the props type as a type argument (Lesson 90). The props type then applies `T` to the rows array and callback argument.

### VS | A function declaration vs. an arrow function with `<T,>`: the same component, and the comma stops a JSX tag

Many software teams prefer writing components as arrow function expressions. Here are both syntaxes side by side:

```tsx title="A generic component as a function declaration, and as an arrow function"
function DataTable~<T>~({ rows, onSelectRow }: DataTableProps<T>) { /* ... */ } // A function declaration
const DataTable = ~<T,>~({ rows, onSelectRow }: DataTableProps<T>) => { /* ... */ }; // An arrow function, with a comma after T
```

**Both syntaxes produce the exact same component and type contract.** Both declare `T` and forward it into `DataTableProps<T>`. The sole syntactic oddity is the trailing comma after `T` in the arrow function. Without that comma, the TypeScript parser interprets `<T>` as an opening JSX element. Here is why:
1. In a file with a `.tsx` extension, angle brackets at the start of an expression are assumed to be JSX syntax.
2. The parser encounters `<T>` and assumes the code is opening a JSX tag named `T`.
3. Because no matching closing tag exists, the compiler emits a syntax error:

```text title="The editor's message"
JSX element 'T' has no corresponding closing tag.
```

The trailing comma informs the parser that the angle brackets enclose a list of type parameters rather than a JSX tag. A generic constraint with the `extends` keyword also eliminates the ambiguity because JSX tags cannot contain constraints. Standard function declarations do not require the comma because a JSX element cannot immediately follow the `function` keyword.

### `object[]` and a type assertion in every caller

Engineering teams seeking to avoid `any` often reach for `object` instead. It sounds more rigorous, but it introduces severe maintenance hazards:

> [!DEFINITION]
> **What is a type assertion?** [NEW] A type assertion uses the `as` keyword to force TypeScript to treat a value as a specific type, such as `(user as User).email`.
> 1. It instructs the compiler to trust the assertion without performing runtime verification.
> 2. Developers often rely on assertions to bypass compiler errors when a type definition is overly broad.
> 3. If the runtime value fails to match the asserted type, TypeScript cannot protect you, allowing bugs into your application (Lesson 93).

**Beware! Typing rows with `object[]` forces consumers to write manual type assertions, which allow mismatched data to pass without warning.** Here is how that failure occurs:
1. A team defines a shared table with `rows: object[]` and `onSelectRow: (row: object) => void`.
2. When rendering the Customers table, the compiler blocks `user.email` because the general `object` type defines no named fields.
3. To silence the error, the developer writes `(user as User).email`, which passes compile checks.
4. Every consumer of the table is now burdened with manual type assertions.
5. A teammate duplicates the Customers JSX tag to create a Products table, changes the rows prop to `products`, but accidentally leaves `(user as User).email`.
6. The compiler permits the assertion because TypeScript allows asserting from `object` to `User`.
7. When a user clicks a product row, the item has no email property. The status line renders `Selected:` followed by blank space.

When using `rows: T[]`, type assertions are unnecessary. In the duplicated Products tag, `user` is typed as `Product`, so the compiler immediately catches the invalid property access.

---

## PRINCIPLE | `rows={users}`: TypeScript fills in `T` at each tag, so the caller writes no type

> [!PRINCIPLE]
> **Principle 2: Inferred Type Argument: `rows={users}` Fills In `T` as `User`**
>
> *Let the caller write no type argument: TypeScript fills in `T` from `rows` at each place the component is used, and every other prop that uses `T`, such as `onSelectRow`, must fit that same type.*
>
> A generic component gets a new `T` at every place it is used. The Customers tag gets `User`, and the Products tag gets `Product`, with no type written by the caller. Writing `<DataTable<User> ...>` gives the exact same result. When `rows` and the callback name two different types, the editor refuses the tag. Writing `(user: any)` on the callback throws away the type the table hands back.
>
> **DO THIS:**
> ```tsx
> <DataTable rows={users} onSelectRow={~user~ => setSelected(user.email)} /> {/* user is inferred as User */}
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> <DataTable rows={users} onSelectRow={(~user: any~) => setSelected(user.emial)} /> {/* **WRONG:** any turns off the check, and the Selected line stays empty */}
> ```

Recall how `first(names)` determined its return type earlier in this lesson. You never wrote the word `string`, yet TypeScript knew the result was a string. Generic components operate through the exact same inference mechanism, where each JSX tag acts as an independent invocation.

### Two tables, two row types

Our administrative dashboard requires a second table to display store products. When a user clicks Taylor, the status line must display her email address. When a user clicks the mug, the status line must display the product name and its price. Here are the two component tags rendering the shared table:

```tsx title="One component, two places of use"
<DataTable rows={~users~} onSelectRow={user => setSelected(user.email)} /> {/* Here T is User */}
<DataTable rows={~products~} onSelectRow={product => setSelected(product.name + ' for $' + product.price)} /> {/* Here T is Product */}
```

Neither tag requires manual type annotations. The Customers table passes the customer list, binding `T` to `User`. The Products table passes the product list, binding `T` to `Product`. One shared component handles two distinct data models with complete type safety.

Hovering over the `user` callback parameter in your editor confirms the inferred `User` type. Hovering over `product` confirms the inferred `Product` type (Lesson 91).

> [!DEFINITION]
> **What does inferring a type mean?** [REVIEW] Type inference is the automated process where TypeScript deduces data types from surrounding code without requiring explicit annotations.
> 1. When you initialize a variable with a string, the compiler automatically assigns the string type to that variable.
> 2. When you pass `rows={users}`, TypeScript inspects the incoming array and automatically sets `T` to `User` for that element.
> 3. This automated deduction gives you complete compile-time validation while keeping your JSX clean and readable (Lesson 91).

### Where the type of `user` comes from

Nobody annotated the callback parameter with `User`, yet reading `user.email` passes type checks. Here is the step-by-step resolution chain:
1. The App file declares `const users: User[]`.
2. The JSX tag provides `rows={users}`, matching the component definition of `rows: T[]`.
3. TypeScript inspects the `User[]` array, resolving `T` for that specific JSX tag.
4. The callback signature receives that resolved row type, delivering a typed `User` into the handler.

The table implementation refers to the value as `row`, while the parent component names it `user`. Both names point to the same runtime object. Each scope chooses the naming convention that best reflects its local context.

### VS | With `<User>` on the tag vs. without it: the same `T`, so most callers write nothing

A consuming component can also supply explicit type arguments directly within the JSX tag:

```tsx title="The type of T inferred, and written by hand"
<DataTable rows={users} onSelectRow={user => setSelected(user.email)} /> {/* TypeScript infers User from rows */}
<DataTable~<User>~ rows={users} onSelectRow={user => setSelected(user.email)} /> {/* Our code writes User by hand */}
```

**Both declarations produce identical compile-time results.** In both instances, `T` resolves to `User`. The callback receives that exact same type. This mirrors the choice between writing `useState(false)` and `useState<boolean>(false)` (Lesson 92). In idiomatic React applications, developers omit redundant annotations and let TypeScript infer the type.

### The page with two tables

Here is the updated App file containing both tables. The shared DataTable component remains unchanged:

```tsx title="src/App.tsx"
import { useState } from 'react';
import DataTable from './DataTable';

type User = { id: number; name: string; email: string };
type Product = { id: number; name: string; price: number };

const users: User[] = [
  { id: 1, name: 'Taylor', email: 'taylor@example.com' },
  { id: 2, name: 'John', email: 'john@example.com' },
];

const products: Product[] = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: 'T-shirt', price: 20 },
];

export default function App() {
  const [selected, setSelected] = useState('');

  return (
    <>
      <p>Selected: {selected}</p>
      <h2>Customers</h2>
      <DataTable rows={users} onSelectRow={user => setSelected(user.email)} />
      <h2>Products</h2>
      <DataTable rows={products} onSelectRow={product => setSelected(product.name + ' for $' + ~product.price~)} /> {/* product is a Product, so price exists */}
    </>
  );
}
```

When the user clicks the row for Taylor, the application displays her email:

```page caption="The page with two tables after the user clicks Taylor's row."
line: Selected: taylor@example.com | good
section: Customers
line: Taylor
line: John
section: Products
line: Mug
line: T-shirt
console: quiet
```

When the user clicks the row for the mug, the application displays the product summary:

```page caption="The same page after the user clicks the Mug row."
line: Selected: Mug for $12 | good
section: Customers
line: Taylor
line: John
section: Products
line: Mug
line: T-shirt
console: quiet
```

### When the rows and the callback disagree

Every property referencing `T` must agree on the underlying type. Suppose a developer duplicates the Customers tag, updates the callback to expect a product, but forgets to update the rows prop:

```tsx title="The Products tag with the customers' rows by mistake"
<DataTable rows={~users~} onSelectRow={(p: Product) => setSelected(p.name + ' for $' + p.price)} /> {/* **WRONG:** rows and the callback name two different types */}
```

The compiler rejects the component tag, placing the red underline on `rows` rather than the callback:
1. The callback explicitly declares its argument as a `Product`.
2. TypeScript uses that callback signature to resolve `T` as `Product`.
3. The component prop `rows` now demands an array of `Product[]`.
4. Because `users` is typed as `User[]`, the compiler flags the type mismatch:

```text title="The editor's two messages"
Type 'User[]' is not assignable to type 'Product[]'.
Property 'price' is missing in type 'User' but required in type 'Product'.
```

If the caller passes products into a table explicitly typed for `User`, the compiler rejects the mismatched array. In either case, incompatible props cannot compile.

### `(user: any)` turns the check off

**Beware! Explicitly annotating callback arguments with `any` disables type checking, negating the benefits of a generic component.** Here is how that mistake happens:
1. A developer distrusts automatic inference and annotates the callback with `(user: any) =>`.
2. The compiler accepts the assignment because a function accepting `any` satisfies the required callback signature.
3. Inside the callback body, the parameter is treated as `any`. Calling `setSelected(user.emial)` triggers no compiler warning.
4. The user clicks a row in the browser, and the status line displays blank text.

The generic component fulfilled its duty by supplying a typed `User`. Adding an explicit `any` annotation discarded that safety guarantee. Omit manual type annotations on callbacks and allow TypeScript to infer parameter types automatically.

---

## PRINCIPLE | `T extends { id: number }`: the table can read `row.id`, and rows without an `id` are refused

> [!PRINCIPLE]
> **Principle 3: Constraint: `T extends { id: number }` Lets the Table Read `row.id`**
>
> *Inside a generic component, a bare `T` has no known fields; add a constraint, such as `T extends { id: number }`, that asks for exactly the fields the component reads.*
>
> TypeScript checks the component once, for every `T` a caller could pass, so the editor refuses `row.id` on a bare `T`, even when every row on the page has an `id`. A constraint removes the types without an `id` from what `T` may be. Then `key={row.id}` passes, and a caller whose rows have no `id` is refused. Asking for more than the table reads, such as `Record<string, unknown>`, refuses rows typed with an `interface`.
>
> **DO THIS:**
> ```tsx
> function DataTable~<T extends { id: number }>~({ rows, onSelectRow }: DataTableProps<T>) { /* ... */ } // row.id is allowed for the key
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> function DataTable<T>({ rows, onSelectRow }: DataTableProps<T>) {
>   return <tbody>{rows.map(row => <tr key={~row.id~}></tr>)}</tbody>; // **WRONG:** Property 'id' does not exist on type 'T'.
> }
> ```

### The `key` every list needs is refused

Every collection rendered in React requires a unique `key` prop, and primary identifiers from database records serve as the ideal key (Lesson 18). Our shared table assigns `row.id` to each rendered table row:

```tsx title="The key of each row, inside DataTable<T>"
<tr key={~row.id~} onClick={() => onSelectRow(row)}> {/* **WRONG:** Property 'id' does not exist on type 'T'. */}
```

Both customer records and product items contain an `id` property. Despite this, the compiler rejects `row.id`. Omitting the key is not an option, because React emits a warning in the console when keys are missing (Lesson 18).

### Why a bare `T` has no `id`

The component implementation does not see our specific data arrays. It sees only the abstract type parameter `T`, and an unconstrained `T` guarantees zero properties:
1. TypeScript verifies the generic component implementation in isolation, independent of any specific caller.
2. During this verification, `T` could represent any conceivable type, including primitives like numbers or strings.
3. Because primitive values have no identifier, the compiler cannot guarantee that `row.id` exists on every possible `T`.
4. The compiler therefore rejects accessing `row.id`, and it rejects `row.name` for the exact same reason.

Recall the `greet(name: string)` example from earlier. Inside that function, calling `name.toUpperCase()` is permitted because the parameter is explicitly declared as a string. An unconstrained type parameter makes no structural promises, preventing property access.

### A constraint promises that every row has an `id`

To access `row.id`, the component must declare a minimum structural requirement for incoming records. This requirement is called a generic constraint, specified using the `extends` keyword:

```tsx title="src/DataTable.tsx" startLine="6"
export default function DataTable~<T extends { id: number }>~({ rows, onSelectRow }: DataTableProps<T>) { // Every T has at least a number id
```

> [!DEFINITION]
> **What is a constraint?** [NEW] A generic constraint uses the `extends` keyword after a type parameter, such as `T extends { id: number }`, to enforce structural requirements on incoming data.
> 1. It restricts `T` so that it must contain at least the specified properties and types.
> 2. It represents structural compatibility rather than object-oriented class inheritance.
> 3. Any object containing an `id` along with other properties satisfies `{ id: number }`, while objects missing an `id` are rejected (Lesson 93).

With the constraint in place, `key={row.id}` compiles without error. The constraint also protects the component boundary. If a developer attempts to pass objects without an identifier, the compiler blocks the invocation:

```tsx title="Rows without an id"
<DataTable rows={~[{ label: 'New' }]~} onSelectRow={row => setSelected(row.label)} /> {/* **WRONG:** these rows have no id */}
```

The editor underlines both the invalid data array and the callback property access:

```text title="The editor's two messages"
Object literal may only specify known properties, and 'label' does not exist in type '{ id: number; }'.
Property 'label' does not exist on type '{ id: number; }'.
```

Records lacking an identifier can no longer enter a component that depends on them for React list keys.

Here is the difference between an unconstrained parameter and a constrained parameter:

```tsx title="A bare type parameter, and a type parameter with a constraint"
function DataTable~<T>~(props: DataTableProps<T>) { /* ... */ } // T may be anything: row.id is refused, and every caller is accepted
function DataTable~<T extends { id: number }>~(props: DataTableProps<T>) { /* ... */ } // T has an id: row.id passes, and rows without an id are refused
```

**Both definitions generate identical runtime JavaScript, but their compile-time boundaries differ completely.** The constraint dictates what the component can safely read internally and what callers are permitted to pass externally.

The editor continues to highlight `row.name` inside table cells because our constraint only promises an `id`. Customer records have names, but other collections might not. Principle 4 replaces hardcoded cell rendering with dynamic columns.

### The same keys in two tables

Both the Customers table and the Products table utilize primary identifiers starting at `1` and `2`. This overlap causes no conflicts. React requires keys to be unique only among sibling elements within the same array (Lesson 18). Because each table instance manages its own independent array of rows, matching keys across different tables are completely valid.

### `Record<string, unknown>` refuses an `interface`

Developers looking for a generic constraint that represents an arbitrary object often choose `Record<string, unknown>`. That built-in utility type models an object with dynamic string keys and values of unknown type:

**Beware! Constraining a generic parameter with `Record<string, unknown>` rejects types declared with an `interface`, baffling developers.** Here is how that issue arises:
1. A developer writes the component constraint as `T extends Record<string, unknown>`.
2. A teammate defines customer records using an `interface Contact`, rather than a type alias.
3. When passing `Contact[]` to the table, the compiler rejects the prop with index signature errors:

```text title="The editor's two messages on the Contacts table"
Type 'Contact[]' is not assignable to type 'Record<string, unknown>[]'.
Index signature for type 'string' is missing in type 'Contact'.
```

The error points out that `Record<string, unknown>` requires an explicit or implicit string index signature. In TypeScript, object shapes defined with `type` can satisfy index signatures based on their known properties. However, definitions declared with `interface` do not receive implicit index signatures because interfaces remain open to declaration merging.

The robust solution is to constrain the type parameter only to the exact properties the component accesses, such as `{ id: number }`. Requiring the minimal necessary contract ensures compatibility with both type aliases and interfaces.

---

## PRINCIPLE | `Extract<keyof T, string>[]`: callers can name only the real fields of their rows

> [!PRINCIPLE]
> **Principle 4: `keyof`: `keyof T` Lets Callers Name Only Real Columns**
>
> *Type the column names with the field names of `T`, as `Extract<keyof T, string>[]`, and show each cell with `String(row[column])`.*
>
> `keyof T` turns the fields of the row type into the list of names a caller may write, so the editor refuses a misspelled column and suggests the right one. Inside the table, `T` is still unknown, and its field names may be strings, numbers, or symbols, so the editor refuses `key={column}` and `{column}`. The utility type `Extract` keeps only the string names. A field of an unknown `T` may hold anything, so `String()` turns each cell into text. With `columns: string[]` and `as any`, a misspelled column shows `undefined` in every cell.
>
> **DO THIS:**
> ```tsx
> type DataTableProps<T> = { rows: T[]; columns: ~Extract<keyof T, string>~[]; onSelectRow: (row: T) => void }; // 'emial' is refused at the caller
> ```
>
> **DO NOT DO THIS:**
> ```tsx
> type DataTableProps<T> = { rows: T[]; columns: ~string[]~; onSelectRow: (row: T) => void }; // **WRONG:** 'emial' passes, and every cell shows undefined
> ```

Our shared table currently renders only `row.name`. A truly flexible table lets each caller declare which columns to display. The Customers table needs name and email, while the Products table needs name and price. We introduce a `columns` prop to accept this list, typed to prevent invalid column names like `'emial'`.

### `keyof` gives the field names of a type

TypeScript provides the `keyof` operator to query the property keys of any data type:

```tsx title="keyof on its own"
type User = { id: number; name: string; email: string };
type UserField = ~keyof User~; // The same as 'id' | 'name' | 'email'
```

**Applying `keyof User` produces a union literal of all property names defined on `User`:** `'id' | 'name' | 'email'`.

This operator provides the exact type safety needed for table columns. The caller specifies which fields to render, and the compiler prevents referencing nonexistent properties:

```tsx title="The Customers tag with a misspelled column"
<DataTable rows={users} columns={['name', ~'emial'~]} onSelectRow={user => setSelected(user.email)} /> {/* **WRONG:** emial is not a field of User */}
```

```text title="The editor's message"
Type '"emial"' is not assignable to type 'keyof User'. Did you mean '"email"'?
```

Compare the two approaches for typing the `columns` prop:

```tsx title="Column names as any string, and as field names of T"
columns: ~string[]~; // Accepts 'emial'
columns: ~(keyof T)[]~; // Refuses 'emial' and suggests 'email'
```

Both declarations accept string arrays at runtime, but only `(keyof T)[]` enforces valid property names during authoring. Because `T` resolves to `User` on the Customers table, the allowed column names are strictly constrained to the keys of that type.

### Inside the table, `key={column}` is refused

Suppose our table types columns as `columns: (keyof T)[]`. The component uses these keys to render table headers and cell values:

```tsx title="src/DataTable.tsx"
      <thead>
        <tr>{columns.map(column => <th key={~column~}>{column}</th>)}</tr> {/* **WRONG:** key refuses a column of type keyof T */}
      </thead>
```

Even though every column name in our application is a plain string, the compiler rejects `column` in both the `key` prop and between JSX tags:

```text title="The editor's two messages"
Type 'string | number | symbol' is not assignable to type 'Key | null | undefined'.
Type 'string | number | symbol' is not assignable to type 'ReactNode'.
```

**Because `T` is an abstract type parameter, its property keys can include strings, numbers, and symbols.** Here is why that triggers compiler errors:
1. JavaScript property names can be strings or symbols, and TypeScript also recognizes numeric keys.
2. For an arbitrary type `T`, the `keyof` operator produces the broad union of string, number, and symbol.
3. React accepts strings, numbers, or bigints for `key` props, but explicitly disallows symbols.
4. Furthermore, the `ReactNode` union type representing renderable JSX elements does not permit symbols (Lesson 90).
5. The compiler therefore blocks rendering `column` directly in JSX.

At the caller site, no error occurs because `T` resolves to `User`, whose property keys are all plain strings. The compiler error exists only within the generic component implementation.

### `Extract<keyof T, string>` keeps only the string names

The solution is to filter `keyof T` so that only string keys are retained:

```tsx title="src/DataTable.tsx" startLine="1"
type DataTableProps<T> = {
  rows: T[];
  columns: ~Extract<keyof T, string>~[]; // Only the field names that are strings
  onSelectRow: (row: T) => void;
};
```

> [!DEFINITION]
> **What is `Extract`?** [NEW] `Extract` is a built-in TypeScript utility type that extracts members from a union that match a given condition, written `Extract<Union, Condition>`.
> 1. It evaluates each member of `Union` and retains only those that extend `Condition`.
> 2. `Extract<keyof T, string>` filters out numeric and symbol keys, leaving only string property names.
> 3. This guarantees that column identifiers can be safely rendered as text and assigned to React keys (Lesson 93).

With `Extract` applied, `column` is guaranteed to be a string. It satisfies both the `key` prop and JSX child requirements. The caller still receives full autocompletion for all string properties on the record.

Some developers write this type using an intersection instead:

```tsx title="Two ways to keep only the string field names"
columns: ~Extract<keyof T, string>~[]; // Keeps the members of keyof T that fit string
columns: ~(keyof T & string)~[]; // Keeps the part of keyof T that is also a string
```

Both forms produce the exact same type union and pass compiler checks with equal safety.

### `String(row[column])` turns every cell into text

Each table row maps over `columns` to render corresponding data cells. In JavaScript, `row[column]` accesses an object property dynamically using bracket notation. When you write this in a generic component, the compiler flags the expression:

```tsx title="One cell per column, inside each row"
{columns.map(column => <td key={column}>{~row[column]~}</td>)} {/* **WRONG:** a field of an unknown T may hold anything */}
```

The editor emits a type error:

```text title="The editor's message"
Type 'T[Extract<keyof T, string>]' is not assignable to type 'ReactNode'.
```

The underlying issue mirrors the `row.id` problem: the compiler does not know what data types exist on the properties of `T`. A property could hold a function, an object, or a symbol, none of which React can render directly in JSX.

The standard JavaScript `String()` function converts any value into a text representation. Wrapping the dynamic property access resolves the issue:

```tsx title="One cell per column, as text"
{columns.map(column => <td key={column}>{~String(row[column])~}</td>)} {/* Always text, so 12 shows as 12 */}
```

At runtime, numbers and strings render identically whether wrapped in `String()` or rendered raw. For the compiler, however, `String()` guarantees that the expression always yields a primitive string that JSX can safely display.

### The table with its columns

Here is the complete DataTable file with generic constraints and column rendering in place:

```tsx title="src/DataTable.tsx"
type DataTableProps<T> = {
  rows: T[];
  columns: ~Extract<keyof T, string>~[]; // Callers may name only string fields of their own rows
  onSelectRow: (row: T) => void;
};

export default function DataTable<T extends { id: number }>({ rows, columns, onSelectRow }: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} onClick={() => onSelectRow(row)}>
            {columns.map(column => <td key={column}>{~String(row[column])~}</td>)} {/* Every cell becomes text */}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

The App component supplies specific column configurations to each table instance:

```tsx title="src/App.tsx" startLine="24"
      <DataTable rows={users} ~columns={['name', 'email']}~ onSelectRow={user => setSelected(user.email)} /> {/* Only name, email, or id are allowed here */}
      <h2>Products</h2>
      <DataTable rows={products} ~columns={['name', 'price']}~ onSelectRow={product => setSelected(product.name + ' for $' + product.price)} /> {/* Only name, price, or id are allowed here */}
```

The dashboard now renders both tables complete with table headers, displaying prices as readable numbers:

```page caption="The finished admin page after the user clicks the Mug row."
line: Selected: Mug for $12 | good
section: Customers
line: name · email
line: Taylor · taylor@example.com
line: John · john@example.com
section: Products
line: name · price
line: Mug · 12
line: T-shirt · 20
console: quiet
```

Inspecting the rendered markup in your browser shows standard HTML elements:

```dom caption="The Customers table in the Elements panel: one header cell and one data cell per column."
<table>
  <thead>
+   <tr><th>name</th><th>email</th></tr> | note: One th per column in columns
  </thead>
  <tbody>
+   <tr><td>Taylor</td><td>taylor@example.com</td></tr> | note: One td per column, as text
    <tr><td>John</td><td>john@example.com</td></tr>
  </tbody>
</table>
```

### `columns: string[]` and `as any`

**Beware! Typing columns as `string[]` allows typos to pass compile checks, resulting in table cells that render the literal text `'undefined'`.** Here is how that defect occurs:
1. A developer declares the prop as `columns: string[]`.
2. Inside the component, indexing `row[column]` triggers a compiler error because a generic string cannot index the record.
3. The developer silences the error with an assertion: `String((row as any)[column])`.
4. A consumer renders the table with a misspelled column: `columns={['name', 'emial']}`.
5. In JavaScript, reading `row['emial']` evaluates to `undefined`.
6. Converting `undefined` with the `String` function creates the text word undefined.
7. The browser renders the word `'undefined'` across every cell in that column:

```text title="The editor's message on row[column] in step 2"
Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ id: number; }'.
```

```page caption="The admin page when columns is typed string[] and the Customers tag asks for emial."
line: Selected:
section: Customers
line: name · emial
line: Taylor · undefined | bad
line: John · undefined | bad
section: Products
line: name · price
line: Mug · 12
line: T-shirt · 20
console: quiet
```

Using `Extract<keyof T, string>[]` prevents this flaw entirely. The compiler rejects invalid column names during authoring, and the component implementation requires zero unsafe type assertions.

---

## All 4 Principles Together

### The complete project

Here is the finished shared table implementation. It declares its row type parameter, accesses `row.id` through a structural constraint, and restricts column inputs to valid string keys:

```tsx title="src/DataTable.tsx"
type DataTableProps~<T>~ = { // Principle 1: one T for the rows and for the clicked row
  rows: T[];
  columns: ~Extract<keyof T, string>~[]; // Principle 4: only real string field names
  onSelectRow: (row: T) => void;
};

export default function DataTable~<T extends { id: number }>~({ rows, columns, onSelectRow }: DataTableProps<T>) { // Principle 3: every row has an id
  return (
    <table>
      <thead>
        <tr>{columns.map(column => <th key={column}>{column}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={row.id} onClick={() => onSelectRow(row)}>
            {columns.map(column => <td key={column}>{String(row[column])}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

Here is the App file rendering both tables, relying entirely on type inference without manual type arguments:

```tsx title="src/App.tsx"
import { useState } from 'react';
import DataTable from './DataTable';

type User = { id: number; name: string; email: string };
type Product = { id: number; name: string; price: number };

const users: User[] = [
  { id: 1, name: 'Taylor', email: 'taylor@example.com' },
  { id: 2, name: 'John', email: 'john@example.com' },
];

const products: Product[] = [
  { id: 1, name: 'Mug', price: 12 },
  { id: 2, name: 'T-shirt', price: 20 },
];

export default function App() {
  const [selected, setSelected] = useState('');

  return (
    <>
      <p>Selected: {selected}</p>
      <h2>Customers</h2>
      <DataTable rows={~users~} columns={['name', 'email']} onSelectRow={user => setSelected(user.email)} /> {/* Principle 2: T is User */}
      <h2>Products</h2>
      <DataTable rows={~products~} columns={['name', 'price']} onSelectRow={product => setSelected(product.name + ' for $' + product.price)} /> {/* Principle 2: T is Product */}
    </>
  );
}
```

### The order in which React calls the components

When the page loads, React executes the App component. The App component returns the top status line, two headings, and two DataTable JSX tags. React then renders DataTable twice, once for each tag. The TypeScript compiler resolved `T` for both invocations before bundling, so the browser executes pure JavaScript. When the user clicks a row, the component triggers `onSelectRow`, updating the selection state in App and causing React to re-render the view:

```tree caption="The order of the calls: App, then DataTable for the customers, then DataTable for the products, and then the callback on a click."
`App` [1. React calls it when the page loads] | Returns the **top line** and **two `DataTable` tags**
- +`DataTable` for Customers [2. Here `T` is `User`] | Returns a table with **name and email** | Keys **1 and 2**
- +`DataTable` for Products [3. Here `T` is `Product`] | Returns a table with **name and price** | Keys **1 and 2** again, in **another array**
- +`onSelectRow` [4. The user clicks the Mug row] | Receives a **`Product`** | `App` sets **`Mug for $12`** and React renders again
```

| What the code writes | Where | What the editor checks | What it prevents |
| :--- | :--- | :--- | :--- |
| **`DataTable<T>` with `rows: T[]` and `onSelectRow: (row: T) => void`** | `DataTable.tsx` | Each caller's callback against its own row type | An empty `Selected:` line after a misspelled field |
| **No type on the tag, `rows={users}`** | `App.tsx` | `T` is `User` at one tag and `Product` at the other | A type assertion in every caller |
| **`T extends { id: number }`** | `DataTable.tsx` | `row.id` inside the table, and rows without an `id` at the caller | Rows with no `id` for their keys |
| **`columns: Extract<keyof T, string>[]`** | `DataTable.tsx` | Every column name against the real fields of the rows | A column of `undefined` cells |
| **`String(row[column])`** | `DataTable.tsx` | Every cell is text JSX can show | A cell that JSX cannot show, such as an object |

**Remember the central takeaway of this chapter. A type parameter acts as a placeholder for a type, resolved at each location where the component is rendered.** One table component accepts rows of any shape, and each caller gets its own exact row type back.

---

## For the Interview

> **The Interview Question:** How do you type generic components and flexible data collections in React?

### How to Answer Clearly in 30 Seconds

"I declare a generic type parameter on the component function, such as `function DataTable<T>`. I apply it across the props interface: `rows: T[]` and `onSelectRow: (row: T) => void`. The incoming data is typed as `T`, and the clicked row returns as that exact same `T`, ensuring callers never require manual type assertions. Four essential practices ensure safety:
1. **Type Inference**: Callers omit manual type arguments. TypeScript infers `T` directly from the array passed to `rows`, binding `T` to `User` in one table and `Product` in another.
2. **Generic Constraints**: Inside the component, an unconstrained `T` has no known properties. I add a constraint like `T extends { id: number }` to guarantee access to `row.id` for list keys while rejecting collections without IDs.
3. **Key Safety with `Extract`**: I type column keys as `Extract<keyof T, string>[]` to prevent misspelled column names and exclude symbols that JSX cannot render, displaying cell values safely using `String()`.
4. **TSX Arrow Functions**: In `.tsx` files, I write `<T,>` with a trailing comma to prevent the parser from confusing the type parameter with an opening JSX element.

Using `any[]` disables all type verification, while `object[]` forces callers into unsafe type assertions. Generics preserve strict type contracts while allowing complete UI flexibility."

### Three Classic Follow-Up Questions Interviewers Ask

1. **"Which other utility types do you use with props and data?"**
   Each utility type ships with TypeScript and transforms existing type definitions into new shapes. `Pick<T, K>` constructs a type by selecting a specific subset of properties from `T`. `Omit<T, K>` constructs a type by removing chosen keys, such as `Omit<User, 'id'>` for creation forms where the server assigns the identifier later. `Partial<T>` marks all properties optional, ideal for search filters where users fill in arbitrary subsets of fields. `Record<K, V>` constructs a dictionary type mapping specified keys to values, such as `Record<'name' | 'email', string>` to ensure header labels exist for every column.
2. **"How would you let the caller render a custom cell, and keep it typed?"**
   I pass a render prop typed with `T`, identical to the `renderItem` pattern (Lesson 89): `renderCell?: (row: T) => React.ReactNode`. The parent component receives a strictly typed row inside its JSX return block, ensuring that typos like `user.emial` are rejected immediately. To configure renderers per column, I combine `keyof T` with indexed access types: `render?: (value: T[K]) => React.ReactNode` where `K extends keyof T`. This guarantees that an email renderer receives a string while a price renderer receives a number.
3. **"What happens when a caller passes an empty array?"**
   When passing `rows={[]}`, TypeScript has no sample records from which to deduce `T`, causing inference to fall back to `never[]` (Lesson 92). Any callback attempting to access properties on `never` triggers a compiler error stating that the property does not exist. Callers resolve this in two ways. They can provide a typed variable like `const users: User[] = []`. Alternatively, they can provide an explicit type argument on the tag, such as `<DataTable<User> rows={[]} ...>`.

```tree caption="Interview summary: one type parameter, resolved at each tag, restricted by a constraint, and mapped to column names."
How a generic table keeps each row's type
- +Type parameter [`DataTable<T>`] | **One `T`** for rows and the clicked row | Each caller **receives its own row type back**
- +Inference [`rows={users}`] | TypeScript **resolves `T`** at each tag | Callers write **no type annotations or casts**
- +Constraint [`T extends { id: number }`] | Guarantees the fields the component **reads** | `row.id` passes, rows **without an id are rejected**
- +Field names [`Extract<keyof T, string>`] | Columns are **real string property names** | Misspelled columns are **rejected with helpful suggestions**
```
