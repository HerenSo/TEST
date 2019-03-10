<template>
    <div id="app">
        <!--<router-view></router-view>-->
        <!-- 这里是需要keepalive的 -->
		<keep-alive>
		    <router-view v-if="$route.meta.keepAlive"></router-view>
		</keep-alive>
		
		<!-- 这里不会被keepalive -->
		<router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<style>
    /*@import "./assets/css/main.css";*/
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
</style>