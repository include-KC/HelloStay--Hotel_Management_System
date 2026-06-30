# What Is the Use of `--save-dev`?

## Objective

`--save-dev` tells npm:

> “Install this package only for development work, not as part of the app’s runtime dependencies.”

It saves the package inside `devDependencies` in `package.json`.

---

## Example

```bash
npm install electron --save-dev
```

Or shorter:

```bash
npm install electron -D
```

Both commands do the same thing.

---

## What Happens in `package.json`

### Before

```json
{
  "dependencies": {},
  "devDependencies": {}
}
```

### After

```json
{
  "devDependencies": {
    "electron": "^42.0.0"
  }
}
```

---

## Difference Between `dependencies` and `devDependencies`

### `dependencies`

These are packages your app needs while running.

#### Example

```bash
npm install react react-dom
```

Saved as:

```json
"dependencies": {
  "react": "...",
  "react-dom": "..."
}
```

React is needed because your UI runs using React.

---

### `devDependencies`

These are packages needed only while building, testing, bundling, or developing.

#### Examples

```bash
npm install vite --save-dev
npm install @vitejs/plugin-react --save-dev
npm install electron --save-dev
```

These tools help you develop the app, but they are not usually imported directly by your React UI.

---

## For HelloStay

In the HelloStay frontend:

```bash
npm install electron --save-dev
```

This means:

Electron is installed as a development/build tool for creating the desktop shell, not as a normal frontend runtime library like React.

---

## Good Examples

### Good Examples for `devDependencies`

```bash
npm install vite -D
npm install @vitejs/plugin-react -D
npm install electron -D
```

### Good Examples for `dependencies`

```bash
npm install react react-dom
npm install axios
npm install react-router-dom
```

---

## Simple Rule to Remember

Use:

```bash
npm install package-name
```

When the app needs the package while running.

Use:

```bash
npm install package-name --save-dev
```

Or:

```bash
npm install package-name -D
```

When the package is only needed during development, building, testing, or tooling.

---

## Summary

`--save-dev` puts a package into `devDependencies`.

For example:

```bash
npm install electron --save-dev
```

This means Electron is needed for developing/running the desktop shell during development, not as a normal React UI dependency.
