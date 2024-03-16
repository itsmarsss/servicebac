# ServiceBac - Frontend

```bash
npm install
npm run build
```

Make sure to move everything in `/dist` to `../back-end/build`

> ```bash
> mv dist/* ../back-end/build/
> ```

Vite + React Plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
