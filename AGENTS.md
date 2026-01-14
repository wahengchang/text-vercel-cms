# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains the Next.js App Router entry points (`layout.tsx`, `page.tsx`) and global styles (`globals.css`).
- `public/` stores static assets served as-is (e.g., `public/next.svg`).
- Root config files include `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, and `tsconfig.json`.

## Build, Test, and Development Commands
- `npm run dev`: Start the local dev server at `http://localhost:3000`.
- `npm run build`: Create a production build.
- `npm run start`: Run the production server from the build output.
- `npm run lint`: Run ESLint checks.

## Coding Style & Naming Conventions
- Use TypeScript and React with the Next.js App Router.
- Indentation follows the project defaults (2 spaces in JSON, 2 spaces in JS/TS).
- Prefer clear component/file names in `PascalCase` for React components (e.g., `app/MyWidget.tsx`).
- Styling is via `app/globals.css` and Tailwind CSS (see `postcss.config.mjs`).
- Linting is handled by ESLint via `eslint.config.mjs`.

## Testing Guidelines
- There is no test framework configured yet.
- If you add tests, document the runner and add a script (for example, `npm run test`) in `package.json`.

## Commit & Pull Request Guidelines
- Existing commits use short, imperative messages (e.g., "install needed lib").
- Keep commits focused and describe the change in one line.
- PRs should include: a brief summary, how to verify, and any screenshots for UI changes.

## Security & Configuration Tips
- If you introduce secrets (e.g., auth keys), use environment variables and document required keys in `README.md`.
