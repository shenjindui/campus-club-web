import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

export default new Router({
    routes: [
        {
            name: 'login',
            path: '/',
            component:resolve => require(['@/components/page/login/Login'],resolve)
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                //系统组件说明
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/index/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/icon',
                    component: resolve => require(['../components/page/Icon.vue'], resolve),
                    meta: { title: '自定义图标' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                   /* meta: { title: 'tab选项卡' }*/
                    meta: { title: '消息列表' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../components/page/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../components/page/Upload.vue'], resolve),
                    meta: { title: '文件上传' }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../components/page/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                    meta: { title: '拖拽弹框' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../components/page/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                ///////系统管理下的菜单管理
                {
                    path: '/menu',
                    component: resolve => require(['../components/page/menu/menu.vue'], resolve),
                    meta: { title: '菜单管理' },
                },
                {
                    path: '/sysLoginLog',
                    component: resolve => require(['../components/page/sysLoginLog/sysLoginLog.vue'], resolve),
                    meta: { title: '系统登陆日志管理' },
                },
                {
                    path: '/clubFunds',
                    component: resolve => require(['../components/page/clubFunds/clubFunds.vue'], resolve),
                    meta: { title: '社团财务管理' },
                },
                {
                    path: '/sysOperationLog',
                    component: resolve => require(['../components/page/sysOperationLog/sysOperationLog.vue'], resolve),
                    meta: { title: '系统操作日志管理' },
                },
                {
                    path: '/user',
                    component: resolve => require(['../components/page/user/user.vue'], resolve),
                    meta: { title: '用户管理' },
                },
                {
                    path: '/clubApproval',
                    component: resolve => require(['../components/page/clubApproval/clubApproval.vue'], resolve),
                    meta: { title: '社团创建' },
                },
                {
                    path: '/clubApprovalInfo',
                    component: resolve => require(['../components/page/clubApproval/clubApprovalInfo.vue'], resolve),
                    meta: { title: '社团详情' },
                },
                {
                    path: '/clubApprovalUpdate',
                    component: resolve => require(['../components/page/clubApproval/clubApprovalUpdate.vue'], resolve),
                    meta: { title: '社团修改' },
                },
                {
                    path: '/role',
                    component: resolve => require(['../components/page/role/role.vue'], resolve),
                    meta: { title: '角色管理' },
                },
                {
                    path: '/ddct',
                    component: resolve => require(['../components/page/ddct/ddct.vue'], resolve),
                    meta: { title: '数据字典管理' },
                },

                {
                    path: '/ueditor',
                    component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                    meta: { title: '测试' },
                },
                {
                    path: '/clubinfo',
                    component: resolve => require(['../components/page/clubinfo/clubinfo.vue'], resolve),
                    meta: { title: '社团信息管理' },
                },
                {
                    path: '/clubisusered',
                    component: resolve => require(['../components/page/clubisusered/clubList.vue'], resolve),
                    meta: { title: '社团停启用管理' },
                },
                {
                    path: '/clubnoticeList',
                    component: resolve => require(['../components/page/clubNotice/clubNoticeList.vue'], resolve),
                    meta: { title: '社团公告管理' },
                },
                {
                    path: '/clubnoticeAdd',
                    component: resolve => require(['../components/page/clubNotice/clubNoticeAdd.vue'], resolve),
                    meta: { title: '社团公告管理' },
                },
                {
                    path: '/clubnoticeinfo',
                    component: resolve => require(['../components/page/clubNotice/clubNoticeInfo.vue'], resolve),
                    meta: { title: '社团公告管理' },
                },
                {
                    path: '/stsyClubNoticeinfo',
                    component: resolve => require(['../components/page/clubNotice/stsy/clubNoticeInfo.vue'], resolve),
                    meta: { title: '社团公告管理' },
                },
                {
                    path: '/clubNoticeUpdate',
                    component: resolve => require(['../components/page/clubNotice/clubNoticeUpdate.vue'], resolve),
                    meta: { title: '社团公告管理' },
                },
                //经办
                {
                    path: '/clubjb/myclubApprove',
                    component: resolve => require(['../components/clubjb/clubApprove/myClubApproval.vue'], resolve),
                    meta: { title: '我的已办代办' },
                },
                {
                    path: '/clubjb/clubActivityApprove',
                    component: resolve => require(['../components/clubjb/clubActivityApprove/clubActivityApproval.vue'], resolve),
                    meta: { title: '社团活动申请' },
                },
                {
                    path: '/clubjb/clubActivityInfo',
                    component: resolve => require(['../components/clubjb/clubActivityApprove/clubActivityInfo.vue'], resolve),
                    meta: { title: '社团活动申请(经办)' },
                },
                {
                    path: '/clubjb/clubApproveInfo',
                    component: resolve => require(['../components/clubjb/clubApprove/clubApprovalInfo.vue'], resolve),
                    meta: { title: '代办详情' },
                },
                //复核
                {
                    path: '/clubfh/myclubApprove',
                    component: resolve => require(['../components/clubfh/clubApprove/myClubApproval.vue'], resolve),
                    meta: { title: '我的已办代办' },
                },
                {
                    path: '/clubfh/clubApproveInfo',
                    component: resolve => require(['../components/clubfh/clubApprove/clubApprovalInfo.vue'], resolve),
                    meta: { title: '代办详情' },
                },
                {
                    path: '/clubfh/clubActivityApprove',
                    component: resolve => require(['../components/clubfh/clubActivityApprove/clubActivityApproval.vue'], resolve),
                    meta: { title: '社团活动申请(复审)' },
                },
                {
                    path: '/clubfh/clubActivityInfo',
                    component: resolve => require(['../components/clubfh/clubActivityApprove/clubActivityInfo.vue'], resolve),
                    meta: { title: '社团活动申请(复审)' },
                },

                //社团活动管理路径
                {
                    path: '/clubActivity',
                    component: resolve => require(['../components/page/clubActivity/clubActivity.vue'], resolve),
                    meta: { title: '社团活动管理' },
                },
                {
                    path: '/clubActivityInfo',
                    component: resolve => require(['../components/page/clubActivity/clubActivityInfo.vue'], resolve),
                    meta: { title: '社团活动管理' },
                },
                {
                    path: '/clubActivityAdd',
                    component: resolve => require(['../components/page/clubActivity/clubActivityAdd.vue'], resolve),
                    meta: { title: '社团活动管理' },
                },
                {
                    path: '/clubActivityUpdate',
                    component: resolve => require(['../components/page/clubActivity/clubActivityUpdate.vue'], resolve),
                    meta: { title: '社团活动管理' },
                },
                {
                    path: '/clubMember',
                    component: resolve => require(['../components/page/clubMember/clubMember.vue'], resolve),
                    meta: { title: '社团人员管理' },
                },
                {
                    path: '/clubList',
                    component: resolve => require(['../components/page/clubList/clubList.vue'], resolve),
                    meta: { title: '社团列表管理' },
                },
                //社团社长
                {
                    path: '/stmanager/myclubApprove',
                    component: resolve => require(['../components/stmanager/clubApprove/myClubApproval.vue'], resolve),
                    meta: { title: '我的已办代办' },
                },
                {
                    path: '/stmanager/clubApproveInfo',
                    component: resolve => require(['../components/stmanager/clubApprove/clubApprovalInfo.vue'], resolve),
                    meta: { title: '代办详情' },
                },
                {
                    path: '/clubnews',
                    component: resolve => require(['../components/page/clubnews/clubnews.vue'], resolve),
                    meta: { title: '社团新闻管理' },
                },
                {
                    path: '/myClubNews',
                    component: resolve => require(['../components/page/clubnews/stsy/clubnews.vue'], resolve),
                    meta: { title: '我的社团新闻' },
                },
                {
                    path: '/chatroom',
                    component: resolve => require(['../components/page/chatRoom/chatRoom.vue'], resolve),
                    meta: { title: '系统聊天室' },
                },
                {
                    path: '/myFunds',
                    component: resolve => require(['../components/page/clubFunds/myFunds.vue'], resolve),
                    meta: { title: '我的财务管理' },
                },
                {
                    path: '/clubMessages',
                    component: resolve => require(['../components/page/clubMessage/clubMessage.vue'], resolve),
                    meta: { title: '社团反馈管理' },
                },
                {
                    path: '/myMessages',
                    component: resolve => require(['../components/page/clubMessage/clubMessageByStsy.vue'], resolve),
                    meta: { title: '我的反馈管理' },
                },
                {
                    path: '/clubScoreByStsy',
                    component: resolve => require(['../components/page/clubScore/clubScoreByStsy.vue'], resolve),
                    meta: { title: '社员评分管理' },
                },
                {
                    path: '/myClubScore',
                    component: resolve => require(['../components/page/clubScore/myClubScore.vue'], resolve),
                    meta: { title: '我的评分管理' },
                },
                {
                    path: '/clubScoreByStsl',
                    component: resolve => require(['../components/page/clubScore/clubScoreByStsl.vue'], resolve),
                    meta: { title: '社团评分管理' },
                },
                {
                    path: '/clubScoreBySttw',
                    component: resolve => require(['../components/page/clubScore/clubScoreBySttw.vue'], resolve),
                    meta: { title: '社团评分管理' },
                },
                {
                    path: '/clubScore',
                    component: resolve => require(['../components/page/clubScore/clubScore.vue'], resolve),
                    meta: { title: '我的社团评分管理' },
                },
                {
                    path: '/clubWorkFlow',
                    component: resolve => require(['../components/page/clubWorkFlow/clubWorkFlow.vue'], resolve),
                    meta: { title: '系统工作流管理' },
                },
                {
                    path: '/clubWorkFlowNode',
                    component: resolve => require(['../components/page/clubWorkFlow/clubWorkFlowNode.vue'], resolve),
                    meta: { title: '系统工作流节点管理' },
                },
                {
                    path: '/clubUserInfo',
                    component: resolve => require(['../components/page/sysUser/sysUser.vue'], resolve),
                    meta: { title: '用户基本信息' },
                },
                //我的社团列表
                {
                    path: '/myClubList',
                    component: resolve => require(['../components/page/myClubList/myClubList.vue'], resolve),
                    meta: { title: '我的社团列表' },
                },
                //我的公告列表
                {
                    path: '/myClubnoticeList',
                    component: resolve => require(['../components/page/clubNotice/stsy/clubNoticeList.vue'], resolve),
                    meta: { title: '社团公告管理' },
                },
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/login/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ],
    /*router = new Router({
        mode: "history",
        routes: routes
    })*/
   // mode: "history"//去掉地址栏里边的#号键


})


