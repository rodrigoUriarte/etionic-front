import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import TablaUsuarios from "../components/TablaUsuarios.vue";

Vue.use(VueRouter);

const routes = [

  {
    path: "/",
    name: "Home",
    component: Home,
  },

  {
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: "/usuarios",
    name: "Usuarios",
    component: TablaUsuarios,
    meta: {
      requiresAuth: true
    },
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {

  const loggedIn = localStorage.getItem("user");

  if (to.matched.some((record) => record.meta.requiresAuth) && !loggedIn) {
    next("/");
    return;
  }
  next();
  
});

export default router;
