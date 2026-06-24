# Project "Social Network - app Social Media - Frontend" | Проєкт "Social Network - додаток Social Media - Frontend"

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.83-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-55.0-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Mobile_App-Android%20%7C%20iOS-3DDC84?style=for-the-badge&logo=android&logoColor=white" />
  <img src="https://img.shields.io/badge/Real--time_Chat-Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-FF8C00?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Architecture-FED-800080?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Module_Architecture-2ECC71?style=for-the-badge" />
  <img src="https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" />
</p>

---

## Навігація | Navigation on README:

- [Мета проєкту | Project Goal](#мета-проєкту--project-goal)
- [Склад команди | Team](#склад-команди--team)
- [Перелік технологій | Technologies](#перелік-технологій--technologies)
- [Стиль написання коду | Code writing style](#стиль-написання-коду--code-writing-style)
- [Деталі роботи у команді | Details of teamwork](#деталі-роботи-у-команді--details-of-teamwork)
- [Опис екранів | Screens description](#опис-екранів--screens-description)
- [Як встановити та запустити проєкт? | How to install and run the project?](#як-встановити-та-запустити-проєкт--how-to-install-and-run-the-project)
- [Висновок | Conclusion](#висновок--conclusion)

## Мета проєкту | Project Goal

Цей проєкт — навчальний повнофункціональний мобільний застосунок соціальної мережі. Він буде корисний початківцям, які хочуть на практиці вивчити розробку мобільних застосунків на **React Native + Expo**, роботу з **real-time** комунікацією через **Socket.IO**, модульну архітектуру **FED**, авторизацію через **JWT** та валідацію форм через **React Hook Form + Yup**.

---

This project is an educational, fully functional mobile social media application. It will be useful for beginners who want to practise mobile development with **React Native + Expo**, **real-time** communication via **Socket.IO**, modular **FED** architecture, **JWT** authentication, and form validation with **React Hook Form + Yup**.

## Склад команди | Team

- [Julia Ovcharenko](https://github.com/JuliaOvcharenko)
- [Oleksandr Voloshyn](https://github.com/SashaVolo)

---

## Перелік технологій | Technologies

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.83-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Expo-55.0-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.11-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Hook_Form-7.72-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" />
  <img src="https://img.shields.io/badge/Yup-1.7-FF4154?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Socket.IO-4.8-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-4.0-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/AsyncStorage-2.2-6DB33F?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo_Router-55.0-000020?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/Expo_Image_Picker-55.0-4A90D9?style=for-the-badge&logo=expo&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Native_Keyboard_Controller-1.20-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
</p>

---

## Стиль написання коду | Code writing style

1. Код розподіляється за логічними шарами модульної архітектури:

    ![app](<https://img.shields.io/badge/app_(routes)-informational>) ![components](https://img.shields.io/badge/components-yellow) ![hooks](https://img.shields.io/badge/hooks-ff69b4) ![shared](https://img.shields.io/badge/shared-brightgreen) ![assets](https://img.shields.io/badge/assets-orange)

- **app** — файлова маршрутизація через Expo Router (entry points).
- **components** — UI-компоненти для побудови екранів.
- **hooks** — кастомні хуки (socket, форми, авторизація тощо).
- **shared** — перевикористовувані типи, утиліти, константи.
- **assets** — статичні ресурси (зображення, шрифти, іконки).

2. Найменування файлів формується **через крапку** відповідно до призначення:
    - `screen.tsx`
    - `types.ts`

3. Для відступів використовується один **Tab (4 пробіли)**.

4. Компоненти — **функціональні**, з використанням хуків.

5. Стилізація через `StyleSheet.create()` від React Native.

---

1. Code is organized into logical layers of modular architecture:

- **app** — file-based routing via Expo Router (entry points).
- **components** — UI components used to build screens.
- **hooks** — custom hooks (socket, forms, auth, etc.).
- **shared** — reusable types, utilities, constants.
- **assets** — static resources (images, fonts, icons).

1. File names are formed **with a dot** according to their purpose:
    - `screen.tsx`
    - `types.ts`

2. Indentation uses one **Tab (4 spaces)**.

3. Components are **functional**, using hooks.

4. Styling via `StyleSheet.create()` from React Native.

---

## Деталі роботи у команді | Details of teamwork

Проєкт виконувався у складі команди. Співпраця будувалась на взаємодопомозі, регулярній комунікації та спільному пошуку рішень.

Ключові аспекти роботи:

1. Розподіл задач відбувався регулярно, відповідно до поточних потреб проєкту та взаємних домовленостей.
2. Ми спільно обговорювали архітектуру, планували реалізацію та узгоджували підходи до написання коду, щоб уникнути конфліктів та забезпечити цілісність проєкту.
3. Кожен учасник працював у власній **Git-гілці**, після чого зміни проходили перевірку та вливалися до основної гілки через **pull request**.
4. Підтримували регулярний звʼязок через повідомлення та дзвінки — узгоджували задачі, ділились прогресом та оперативно вирішували питання.

---

Ключові навички, застосовані в командній роботі:

1. Планування та декомпозиція задач.
2. Контроль версій (Git): робота у гілках, pull request-и, вирішення конфліктів.
3. Регулярна комунікація та взаємодія в парі.
4. Гнучкість та адаптація в умовах нестабільності.
5. Дотримання дедлайнів.

---

The project was carried out as a team. Our collaboration was built on mutual support, regular communication, and joint problem-solving.

Key aspects of the work:

1. Task distribution occurred naturally, according to the project's current needs and our mutual agreements.
2. We jointly discussed the architecture, planned the implementation, and agreed on coding approaches to avoid conflicts and ensure the project's integrity.
3. Each team member worked in their own **Git branch**, after which changes were reviewed and merged into the main branch via **pull requests**.
4. We maintained regular contact through messages and calls — aligning on tasks, sharing progress, and resolving questions promptly.

---

Key skills applied in teamwork:

1. Planning and task decomposition.
2. Version control (Git): branch workflow, pull requests, conflict resolution.
3. Regular communication and pair interaction.
4. Flexibility and adaptability under unstable conditions.
5. Meeting deadlines.

---

## Опис екранів | Screens description

<details>
    <summary><strong>Екран реєстрації | Registration Screen</strong></summary>

---

Екран реєстрації нового користувача. Користувач вводить електронну пошту та пароль. Після відправки форми на вказану пошту надсилається лист із **кодом підтвердження**. Користувач вводить код у відповідне поле — і лише після цього акаунт активується та видається **JWT**-токен. Валідація форми реалізована через **React Hook Form + Yup**.


---

New user registration screen. The user enters their email and password. After submitting the form, a **confirmation code** is sent to the provided email address. The user enters the code in the verification field — only after that is the account activated and a **JWT** token issued. Form validation is handled by **React Hook Form + Yup**.

</details>

---

<details>
    <summary><strong>Екран входу | Login Screen</strong></summary>

---

Екран авторизації користувача. Користувач вводить електронну пошту та пароль для входу в акаунт. Токен зберігається в **AsyncStorage** для підтримки сесії.

---

User authentication screen. The user enters their email and password to log in. The token is stored in **AsyncStorage** to maintain the session.

</details>

---

<details>
    <summary><strong>Головний екран (стрічка) | Home Screen (Feed)</strong></summary>

---

Головний екран застосунку зі стрічкою публікацій. Користувач бачить пости інших користувачів, може переглядати їх та взаємодіяти з контентом.

---

The main application screen with a post feed. The user sees posts from other users and can browse and interact with content.

</details>

---

<details>
    <summary><strong>Екран Публікацій (стрічка) | Publications Screen (Feed)</strong></summary>

---

Екран застосунку зі стрічкою публікацій лише поточного користувача, котрий може переглядати та взаємодіяти з контентом.

---

The application screen with a post feed. The user sees only his posts and can browse and interact with content.

</details>

---

<details>
    <summary><strong>Екран профілю | Profile Screen</strong></summary>

---

Екран власного профілю користувача. Тут відображаються аватар, імʼя та біографія. Є можливість редагувати особисті дані та завантажити нове фото через **Expo Image Picker**. Профіль містить вкладки **«Особиста інформація»** та **«Альбоми»**.

---

The current user's profile screen. It displays the avatar, name, bio. The user can edit their profile data and upload a new photo via **Expo Image Picker**. The profile includes **"Personal Info"** and **"Albums"** tabs.

</details>

---

<details>
    <summary><strong>Екран альбомів | Albums Screen</strong></summary>

---

Вкладка **«Альбоми»** в профілі містить два розділи:

- **Мої фото** — користувач може створювати власні альбоми у вигляді фотоколажів. Кожен альбом має назву і набір фотографій, які відображаються у сітці.
- **Аватарки** — автоматично зберігається вся **історія аватарів** профілю, щоб можна було переглянути або відновити попереднє фото.

---

The **"Albums"** tab on the profile page includes two sections:

- **My Photos** — the user can create custom albums displayed as photo collages. Each album has a title and a grid of images.
- **Avatar History** — automatically stores the full **history of profile pictures**, allowing the user to view or restore a previous avatar.

</details>

---

<details>
    <summary><strong>Екран сторінки іншого користувача | User Profile Page Screen</strong></summary>

---

Сторінка профілю іншого користувача. Відображаються його аватар, імʼя, лічильники (дописи, читачі, друзі), публікації у стрічці та альбоми. Залежно від статусу відносин між користувачами відображаються різні дії:

- **Надіслати запит у друзі** — якщо запит ще не відправлено.
- **Скасувати запит** — якщо запит вже відправлено й очікує підтвердження.
- **Прийняти / Відхилити** — якщо цей користувач надіслав вам запит.
- **Видалити з друзів** — якщо ви вже друзі.

Обмін особистими повідомленнями доступний лише між взаємними друзями.

---

The profile page of another user. Displays their avatar, name, counters (posts, followers, friends), feed posts, and albums. Depending on the relationship status between users, different actions are shown:

- **Send Friend Request** — if no request has been sent yet.
- **Cancel Request** — if a request has already been sent and is pending.
- **Accept / Decline** — if this user sent you a friend request.
- **Remove Friend** — if you are already friends.

Private messaging is only available between mutual friends.

</details>

---

<details>
    <summary><strong>Екран чату | Chat Screen</strong></summary>

---

Екран real-time чату між користувачами, доступний лише для друзів. Реалізований через **Socket.IO**. Підтримуються особисті та групові чати. Повідомлення відображаються в режимі реального часу без необхідності оновлення сторінки.

---

A real-time chat screen available only between friends, implemented via **Socket.IO**. Supports both private and group chats. Messages appear in real time without the need to refresh.

</details>

---

<details>
    <summary><strong>Екран Not Found | Not Found Screen</strong></summary>

---

Екран помилки навігації. Відображається, якщо користувач перейшов за неіснуючим маршрутом. Пропонується повернутися на головний екран.

---

Navigation error screen. Displayed if the user navigated to a non-existent route. The user is prompted to return to the home screen.

</details>

---

## Як встановити та запустити проєкт? | How to install and run the project?

<details>
  <summary><strong>For any OS</strong></summary>

1. Перед початком переконайтесь, що на вашому компʼютері встановлено:

- **Node.js** (рекомендовано LTS-версію) | Перевірка / Check:
    ```bash
    node -v
    ```
- **Git** | Перевірка / Check:
    ```bash
    git --version
    ```
- **Expo CLI**:
    ```bash
    npm install -g expo-cli
    ```
- На телефоні — застосунок **Expo Go** (Android / iOS) або налаштований емулятор.

---

Make sure you have installed on your computer:

- **Node.js** (LTS version recommended)
- **Git**
- **Expo CLI**
- **Expo Go** app on your phone (Android / iOS) or a configured emulator.

---

2. Склонуйте репозиторій з GitHub | Clone the repository from GitHub:

    ```bash
    git clone https://github.com/your-repo/socialmedia-frontend
    ```

3. Перейдіть в папку проєкту | Go to the project folder:

    ```bash
    cd socialmedia-frontend
    ```

4. Встановіть залежності | Install dependencies:

    ```bash
    npm install
    ```

5. Запустіть проєкт | Start the project:

    ```bash
    npx expo start
    ```

6. Відскануйте QR-код у застосунку **Expo Go** або запустіть на емуляторі:

    ```bash
    # Android
    npm run android

    # iOS
    npm run ios

    # Web
    npm run web
    ```

7. Вітаємо! Ви локально запустили проєкт!

---

Congratulations! You have successfully run the project locally.

</details>

---

## Висновок | Conclusion

Робота над цим проєктом стала цінним досвідом створення повнофункціонального мобільного застосунку на **React Native + Expo**. Команда успішно опанувала ключові технології: компонентний підхід, файлову навігацію через **Expo Router**, real-time комунікацію через **Socket.IO** та авторизацію на основі **JWT**.

Незважаючи на стислі терміни та перебої зі світлом і інтернетом, нам вдалося розробити повністю функціональний застосунок із чіткою модульною архітектурою. Робота у гілках, регулярна комунікація та взаємодопомога дозволили ефективно розподілити задачі та уникнути конфліктів у коді.

Проєкт можна розвивати далі:еалізувати стрічку рекомендацій або додати підтримку офлайн-режиму.

--- 

Working on this project was a valuable experience in building a fully functional mobile application with **React Native + Expo**. The team successfully mastered key technologies: the component-based approach, file-based navigation via **Expo Router**, real-time communication via **Socket.IO**, and **JWT**-based authentication.

Despite tight deadlines and power and internet outages, we managed to build a fully functional application with a clear modular architecture. Working in branches, maintaining regular communication, and supporting each other allowed us to distribute tasks effectively and avoid code conflicts.

The project can be developed further: implementing a recommendations feed, or adding offline mode support.

