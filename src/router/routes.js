const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        name: "welcome",
        component: () => import("pages/welcome/WelcomePage.vue"),
      },
      {
        path: "/userprofil",
        name: "userprofil",
        component: () => import("pages/user/UserProfilPage.vue"),
      },
      {
        path: "/userportfolio",
        name: "userportfolio",
        component: () => import("pages/user/UserPortfolio.vue"),
      },
    ],
  },
  {
    path: "/auth",
    component: () => import("layouts/AuthLayout.vue"),
    children: [

      {
        path: "/login",
        name: "login",
        component: () => import("pages/auth/LoginPage.vue"),
      },
      {
        path: "/register",
        name: "register",
        component: () => import("pages/auth/RegistrationPage.vue"),
      },
      {
        path: "/emailverification",
        name: "emailverification",
        component: () => import("pages/auth/EmailVerificationPage.vue"),
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
];

export default routes;
