import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
//  mode: "history",
    routes: [
        {
            path: '/',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { 
            	requireAuth: true, // 判断是否需要登录
            	title: '自述文件' 
            },
            children:[
//              {
//                  path: '/dashboard',
//                  component: resolve => require(['../components/page/BaseTable.vue'], resolve),
//                  meta: { title: '系统首页' }
//              },
                {
                    path: '/elementManage',
                    component: resolve => require(['../components/page/elementManage/ElementManage.vue'], resolve),
                    meta: { title: '知识元管理', keepAlive: true, isBack:false }
                },
                {
                    path: '/elementCheck',
                    component: resolve => require(['../components/page/elementManage/ElementCheck.vue'], resolve),
                    meta: { title: '知识元审核', keepAlive: true, isBack:false }
                },
                {
                    path: '/elementAdd',
                    name: 'elementAdd',
                    component: resolve => require(['../components/page/elementManage/ElementAdd.vue'], resolve),
                    meta: { title: '知识元新增', keepAlive: false, isBack:false }
                },
                {
                    path: '/elementUpdate',
                    component: resolve => require(['../components/page/elementManage/ElementUpdate.vue'], resolve),
                    meta: { title: '知识元修改', keepAlive: false, isBack:false }
                },
                {
                    path: '/elementDetails',
                    component: resolve => require(['../components/page/elementManage/ElementDetails.vue'], resolve),
                    meta: { title: '知识元查看', keepAlive: false, isBack:false }
                },
                {
                    path: '/systemManage',
                    component: resolve => require(['../components/page/systemManage/SystemManage.vue'], resolve),
                    meta: { title: '体系结构管理', keepAlive: true, isBack:false }
                },
                {
                    path: '/systemAdd',
                    name: 'systemAdd',
                    component: resolve => require(['../components/page/systemManage/SystemAdd.vue'], resolve),
                    meta: { title: '体系结构新增', keepAlive: false, isBack:false }
                },
                {
                    path: '/systemUpdate',
                    component: resolve => require(['../components/page/systemManage/SystemUpdate.vue'], resolve),
                    meta: { title: '体系结构修改', keepAlive: false, isBack:false }
                },
                {
                    path: '/systemDetails',
                    component: resolve => require(['../components/page/systemManage/SystemDetails.vue'], resolve),
                    meta: { title: '体系结构详情', keepAlive: false, isBack:false }
                },
                {
                    path: '/systemType',
                    component: resolve => require(['../components/page/systemManage/SystemType.vue'], resolve),
                    meta: { title: '体系结构类型管理', keepAlive: true, isBack:false }
                },
                {
                    path: '/testManage',
                    component: resolve => require(['../components/page/testManage/TestManage.vue'], resolve),
                    meta: { title: '试题管理', keepAlive: true, isBack:false }
                },
                {
                    path: '/testElement',
                    component: resolve => require(['../components/page/testManage/TestElement.vue'], resolve),
                    meta: { title: '知识元选题', keepAlive: true, isBack:false }
                },
                {
                    path: '/testSystem',
                    component: resolve => require(['../components/page/testManage/TestSystem.vue'], resolve),
                    meta: { title: '体系结构选题', keepAlive: true, isBack:false }
                },
                {
                    path: '/testDetails',
                    name: 'testDetails',
                    component: resolve => require(['../components/page/testManage/TestDetails.vue'], resolve),
                    meta: { title: '试题详情', keepAlive: false, isBack:false }
                },
                {
                    path: '/testUpdate',
                    component: resolve => require(['../components/page/testManage/TestUpdate.vue'], resolve),
                    meta: { title: '试题修改', keepAlive: false, isBack:false }
                },
                {
                    path: '/testBind',
                    component: resolve => require(['../components/page/testManage/TestBind.vue'], resolve),
                    meta: { title: '试题绑定知识元', keepAlive: false, isBack:false }
                },
                {
                    path: '/testAdd',
                    component: resolve => require(['../components/page/testManage/TestAdd.vue'], resolve),
                    meta: { title: '试题新增', keepAlive: false, isBack:false }
                },
                {
                    path: '/resourceError',
                    component: resolve => require(['../components/page/testResource/ResourceError.vue'], resolve),
                    meta: { title: '资源异常', keepAlive: false, isBack:false }
                },
                {
                    path: '/resourceType',
                    component: resolve => require(['../components/page/testResource/ResourceType.vue'], resolve),
                    meta: { title: '资源类型', keepAlive: true, isBack:false }
                },
                {
                    path: '/resourceErrorType',
                    component: resolve => require(['../components/page/testResource/ResourceErrorType.vue'], resolve),
                    meta: { title: '资源异常类型', keepAlive: false, isBack:false }
                },
                {
                    path: '/userInfo',
                    component: resolve => require(['../components/page/basicInfo/UserInfo.vue'], resolve),
                    meta: { title: '用户信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/roleInfo',
                    component: resolve => require(['../components/page/basicInfo/RoleInfo.vue'], resolve),
                    meta: { title: '角色信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/studyPeriodInfo',
                    component: resolve => require(['../components/page/basicInfo/StudyPeriodInfo.vue'], resolve),
                    meta: { title: '学段信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/courseInfo',
                    component: resolve => require(['../components/page/basicInfo/CourseInfo.vue'], resolve),
                    meta: { title: '学科信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/gradeInfo',
                    component: resolve => require(['../components/page/basicInfo/GradeInfo.vue'], resolve),
                    meta: { title: '年级信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/materialInfo',
                    component: resolve => require(['../components/page/basicInfo/MaterialInfo.vue'], resolve),
                    meta: { title: '教材信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/fascicleInfo',
                    component: resolve => require(['../components/page/basicInfo/FascicleInfo.vue'], resolve),
                    meta: { title: '分册信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/questionTypeInfo',
                    component: resolve => require(['../components/page/basicInfo/QuestionTypeInfo.vue'], resolve),
                    meta: { title: '题型信息', keepAlive: false, isBack:false }
                },
                {
                    path: '/difficultyInfo',
                    component: resolve => require(['../components/page/basicInfo/DifficultyInfo.vue'], resolve),
                    meta: { title: '难度系数', keepAlive: false, isBack:false }
                },
//              {
//                  path: '/table',
//                  component: resolve => require(['../components/page/BaseTable.vue'], resolve),
//                  meta: { title: '基础表格' }
//              },
//              {
//                  path: '/tabs',
//                  component: resolve => require(['../components/page/Tabs.vue'], resolve),
//                  meta: { title: 'tab选项卡' }
//              },
//              {
//                  path: '/form',
//                  component: resolve => require(['../components/page/BaseForm.vue'], resolve),
//                  meta: { title: '基本表单' }
//              },
//              {
//                  // 富文本编辑器组件
//                  path: '/editor',
//                  component: resolve => require(['../components/page/VueEditor.vue'], resolve),
//                  meta: { title: '富文本编辑器' }
//              },
//              {
//                  // markdown组件
//                  path: '/markdown',
//                  component: resolve => require(['../components/page/Markdown.vue'], resolve),
//                  meta: { title: 'markdown编辑器' }    
//              },
//              {
//                  // 图片上传组件
//                  path: '/upload',
//                  component: resolve => require(['../components/page/Upload.vue'], resolve),
//                  meta: { title: '文件上传' }   
//              },
//              {
//                  // vue-schart组件
//                  path: '/charts',
//                  component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
//                  meta: { title: 'schart图表' }
//              },
//              {
//                  // 拖拽列表组件
//                  path: '/drag',
//                  component: resolve => require(['../components/page/DragList.vue'], resolve),
//                  meta: { title: '拖拽列表' }
//              },
//              {
//                  // 拖拽Dialog组件
//                  path: '/dialog',
//                  component: resolve => require(['../components/page/DragDialog.vue'], resolve),
//                  meta: { title: '拖拽弹框' }
//              },
//              {
//                  // 权限页面
//                  path: '/permission',
//                  component: resolve => require(['../components/page/Permission.vue'], resolve),
//                  meta: { title: '权限测试', permission: true }
//              },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
