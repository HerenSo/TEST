<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#fff"
            text-color="#333" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in data">
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
//              data: [],
                data: [ // 静态菜单
                    {
                        icon: 'el-icon-lx-copy',
                        index: 'element',
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
                                title: '体系结构管理'
                            },
                            {
                                index: 'systemManage',
                                title: '体系结构审核'
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
                                index: 'testElement',
                                title: '知识元选题'
                            },
                            {
                                index: 'testSystem',
                                title: '体系结构选题'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-cascades',
                        index: '4',
                        title: '基础信息',
                        subs: [
                            {
                                index: 'userInfo',
                                title: '用户信息'
                            },
                            {
                                index: 'roleInfo',
                                title: '角色信息'
                            },
                            {
                                index: 'studyPeriodInfo',
                                title: '学段信息'
                            },
                            {
                                index: 'courseInfo',
                                title: '学科信息'
                            },
                            {
                                index: 'gradeInfo',
                                title: '年级信息'
                            },
                            {
                                index: 'materialInfo',
                                title: '教材信息'
                            },
                            {
                                index: 'fascicleInfo',
                                title: '分册信息'
                            },
                            {
                                index: 'questionTypeInfo',
                                title: '题型信息'
                            },
                            {
                                index: 'difficultyInfo',
                                title: '难度系数'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-qrcode',
                        index: '5',
                        title: '资源管理',
                        subs: [
                            {
                                index: 'resourceError',
                                title: '资源异常'
                            },
                            {
                                index: 'resourceType',
                                title: '资源类型'
                            },
                            {
                                index: 'resourceErrorType',
                                title: '资源异常类型'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-lx-rank',
                        index: '6',
                        title: '能力管理',
                        subs: [
                            {
                                index: 'abilityMap',
                                title: '能力图谱'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-read',
                        index: '7',
                        title: '知识管理',
                        subs: [
                            {
                                index: 'knowledgeMap',
                                title: '知识图谱'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-lx-pic',
                        index: '8',
                        title: '素养管理',
                        subs: [
                            {
                                index: 'literacyMap',
                                title: '素养图谱'
                            }
                        ]
                    },
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
        beforeCreate() {
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        },
        mounted() {
//      	console.log(123)
			this.getMenu();
        },
        methods: {
        	getMenu() {
        		this.$axios.get("app/role/menus").then((res) => {
	            	if(res.status == 200 && res.data.code == '0000'){
	                    this.data = res.data.data;
	//                  console.log(this.data)
	                }
           		})
        	}
        },
        watch: {
			$route: {
				handler: function(val, oldVal){
			      	if( oldVal.fullPath == "/login"){
			      		console.log(oldVal)
			      		this.getMenu();
//			      		this.$router.go(0);
					}
			    },
			    // 深度观察监听
			    deep: true
			} 
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
        width: 210px;
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
    .el-submenu .el-menu{
    	background-color: #f5f7fa !important;
    }
    .el-submenu .el-menu-item{
    	background-color: #f5f7fa !important;
    }
</style>
