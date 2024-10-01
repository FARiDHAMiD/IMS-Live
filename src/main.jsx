import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import "react-toastify/ReactToastify.min.css";

import "./assets/css/style.css";
import "./assets/css/animate.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Format Date Library
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ar";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
dayjs.locale("ar");

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.updateLocale("ar", {
  relativeTime: {
    future: "فى خلال %s",
    past: "منذ %s",
    s: "ثوانٍ",
    m: " ق",
    mm: "%d دقيقة",
    h: " ساعة",
    hh: "%dh",
    d: " يوم",
    dd: "%d يوم",
    M: " شهر",
    MM: "%d شهر",
    y: "a year",
    yy: "%d years",
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
