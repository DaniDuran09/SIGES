# SIGES
This is a space and equipment management system designed for a university, built primarily with React. It follows best practices and makes use of modern libraries and design patterns to ensure scalability, maintainability, and clean architecture.

```bash
npm i
npm run dev
```

```txt
src/
│
├── app/
│   ├── store/
│   ├── router/
│   ├── providers/
│   └── config.ts
│
├── layouts/
│   ├── AppLayout/
│   │   └── Sidebar.jsx
│   └── Sidebar.jsx
│
├── features/
│   ├── auth/
│   │   ├── screens/
│   │   ├── hooks/
│   │   ├── services.ts // pendiente de explicar
│   │   └── types.ts
│   │
│   └── notifications/
│
├── shared/     //Cosas reutilizables
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── styles/
│
├── assets/
│   ├── images/
│   └── fonts/
│
├── services/       //Servicios globales (API, storage)
│   ├── api.ts
│   ├── storage.ts
│   └── analytics.ts
│
├── types/
│
├── App.tsx
└── main.tsx
```