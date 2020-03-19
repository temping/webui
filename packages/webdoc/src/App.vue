<template>
  <div id="app">
    <div id="nav">
      <template v-for="(item, index) in menu">
        <span :key="`route-${index}-div`" v-if="index !== 0">&nbsp;|&nbsp;</span>
        <router-link :key="`route-${index}`" :to="item.path">
          {{ item.meta?.title || name }}
        </router-link>
      </template>
    </div>
    <router-view />
  </div>
</template>
<script>
import routes from '@/router/routes'
export default {
  setup() {
    const menu = routes.map(({ name, path, meta }) => ({ name, path, meta }));
    return {
      menu
    };
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
