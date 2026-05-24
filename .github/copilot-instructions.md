# Copilot Instructions — fe-zoopsy

## HeroUI (версія ^3.x)

Проект використовує **`@heroui/react` v3**. НЕ використовуй API з v2.

Ключові відмінності v3:

- `Textarea` (не `TextArea`)
- `Select` використовує `ListBox` + `ListBoxItem` замість `SelectItem`
- Немає `SelectItem` як окремого компонента — використовуй `ListBoxItem`
- Перевіряй існування компонента в коді проекту перед імпортом

Приклад правильного Select:

```tsx
import { Select, ListBox, ListBoxItem } from '@heroui/react';
```

## Уникай дублікації коду

- Спільні константи виносити в `src/constants/`
- Спільна логіка → хуки в `src/hooks/`
- Спільні утиліти → `src/utils/`
- Не визначай одну й ту ж константу/функцію в кількох файлах

## Структура компонентів

- Великі компоненти (>100 рядків) розбивай на менші
- Логіку запитів/мутацій виносити в `src/api/`
- Локальну логіку стану розбивай у хуки

## Стек

- React + TypeScript + Vite
- TanStack Router (`@tanstack/react-router`)
- TanStack Query для даних
- `@heroui/react` v3 для UI
- Tailwind CSS для стилів (є кастомні класи в src/index.css)
- Zustand для глобального стану (`src/stores/`)
- Axios (`src/lib/axios.ts`)
