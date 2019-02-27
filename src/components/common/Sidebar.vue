<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#fff"
            text-color="#333" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-calendar',
                        index: '1',
                        title: '知识元管理',
                        subs: [
                            {
                                index: 'elementManage',
                                title: '知识元管理'
                            },
                            {
                                index: 'elementCheck',
                                title: '知识元审核'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-news',
                        index: '2',
                        title: '体系结构管理',
                        subs: [
                            {
                                index: 'systemType',
                                title: '体系结构类型管理'
                            },
                            {
                                index: 'systemManage',
                                title: '体系结构管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-text',
                        index: '3',
                        title: '试题管理',
                        subs: [
                            {
                                index: 'testManage',
                                title: '试题管理'
                            },
                            {
                                index: 'form',
                                title: '试题审核'
                            }
                        ]
                    }
//                  {
//                      icon: 'el-icon-lx-home',
//                      index: '4',
//                      title: '系统管理',
//                      subs: [
//                          {
//                              index: 'dashboard',
//                              title: '角色管理'
//                          },
//                          {
//                              index: 'icon',
//                              title: '用户管理'
//                          },
//                          {
//                              index: 'editor',
//                              title: '菜单管理'
//                          },
//                          {
//                              index: 'markdown',
//                              title: '日志管理'
//                          }
//                      ]
//                  },
//                  {
//                      icon: 'el-icon-lx-cascades',
//                      index: 'table',
//                      title: '日志管理'
//                  },
//                  {
//                      icon: 'el-icon-lx-copy',
//                      index: 'tabs',
//                      title: '接口管理'
//                  }
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 250px;
    }
    .sidebar > ul {
        height:100%;
    }
    .sidebar span{
    	font-size: 16px;
    	/*color: #dcd9d9;*/
    }
    /*.sidebar .el-menu-item,.sidebar .el-submenu__title{
    	height: 62px !important;
    	line-height: 62px !important;
    }*/
    .el-menu-item i,.el-submenu__title i{
    	/*color: #dcd9d9;*/
    }
</style>
