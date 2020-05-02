<template>
    <div id="app">
        <router-view v-if="isRouterAlive"></router-view>
    </div>
</template>
<style>
    @import "./assets/css/main.css";
    /*@import "./assets/css/color-dark.css";*/     /*深色主题*/
    @import "./assets/css/theme-green/color-green.css";   /*浅绿色主题*/
</style>
<script>
    export default {
        name: 'App',
        provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
            return {
                reload: this.reload
            }
        },
        data() {
            return{
                isRouterAlive: true                    //控制视图是否显示的变量
            }
        },
        methods: {
            reload () {
                this.isRouterAlive = false;            //先关闭，
                this.$nextTick(function () {
                    this.isRouterAlive = true;         //再打开
                })
            }
        }
    }
</script>


<!--
<template>
    <div id="app">
       &lt;!&ndash; <v-header />&ndash;&gt;
        <router-view class="main" />
        &lt;!&ndash;<v-footer />&ndash;&gt;
    </div>
</template>
<script>
    import Vue from 'vue'

    import Header from "@/components/club-face/common/Header"
    import Footer from "@/components/club-face/common/Footer"
    import Home from "@/components/club-face/home/Home"


    export default {
        name: 'App',
        components: {
            "v-header": Header,
            "v-footer": Footer
        }

    }
</script>

<style scoped="scoped">
    .main {
        /* background-color: #E9EEF3; */
        color: #333;
        text-align: center;
        margin: 78px auto;
        min-height: 550px;
    }
    @media screen and (max-width: 600px){
        .main{
            width: 95%;
            padding: 3px;

            position: relative;
            top: 0;
            bottom: 0;
        }

    }
    @media screen and (min-width: 1196px){
        .main{
            width: 1024px;
        }
    }
</style>
-->
