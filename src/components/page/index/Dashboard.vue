<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                       <!-- <img :src="userInfo.headPortrait" alt="headPortrait.fileNm" class="show-picture" />-->
                       <!-- {{userInfo.headPortrait}}-->
                        <img :src="userInfo.headPortrait" class="user-avator" alt="" v-if="userInfo.headPortrait!=null&&userInfo.headPortrait!=''"> <!--头像-->
                        <el-upload
                                class="avatar-uploader"
                                action="/api/updateFile"
                                :headers="token"
                                :data="{fileurpose: 4,userCode:userInfo.usercode,stCd:userInfo.usercode}"
                                :limit="1"
                                :show-file-list="false"
                                :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload" v-else>
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <el-button type="warning" icon="el-icon-edit" @click="checkUserInfo()" style="margin-left: 50px"
                           v-if="userInfo.jobNum==null||userInfo.jobNum==''">信息完善</el-button>

                        <div class="user-info-cont">
                            <div class="user-info-name">{{ userInfo.realname }}</div>
                            <!--<div >{{ userInfo.usercode }}</div>-->
                        </div>
                    </div>
                    <div class="user-info-list">登录时间：<span>{{ userInfo.lastLoginTime }}</span></div>
                    <div class="user-info-list">登录地点：<span>{{ userInfo.lastLoginAddress }}</span></div>
                </el-card>
                <el-dialog title="用户信息完善页面" :visible.sync="updateFormVisible" @close="UpdateCancle('updateForm')">
                    <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                        <el-row :gutter="16" type="flex">
                            <el-col :span="16">
                                <el-form-item label="用户工号" :label-width="formLabelWidth" prop="jobNum">
                                    <el-input v-model="updateForm.jobNum" placeholder="系统唯一性校验"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                                    <el-input v-model.trim="updateForm.email" placeholder="邮箱"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16" type="flex">
                            <el-col :span="16">
                                <el-form-item label="真实姓名" :label-width="formLabelWidth"  prop="realname">
                                    <el-input v-model.trim="updateForm.realname" placeholder="真实姓名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="手机号" :label-width="formLabelWidth"  prop="mobile">
                                    <el-input v-model.trim="updateForm.mobile" placeholder="手机号"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="16" type="flex">
                            <el-col :span="16">
                                <el-form-item label="QQ号" :label-width="formLabelWidth" prop="qq">
                                    <el-input v-model.trim="updateForm.qq" placeholder="QQ号" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="16">
                                <el-form-item label="微信号" :label-width="formLabelWidth" prop="wechat">
                                    <el-input v-model.trim="updateForm.wechat" placeholder="微信号" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="UpdateCancle('updateForm')">取 消</el-button>
                        <el-button type="primary" @click="Update('updateForm')" plain>确 定</el-button>
                    </div>
                </el-dialog>

                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>子系统详情</span>
                    </div>
                    现状管理
                    <el-progress button-type="terminateProcess"s :percentage="71.3" color="#42b983"></el-progress>
                    经营管理
                    <el-progress :percentage="24.1" color="#f1e05a"></el-progress>
                    土地巡查
                    <el-progress :percentage="3.7"></el-progress>
                    土地退出
                    <el-progress :percentage="0.9" color="#f56c6c"></el-progress>
                </el-card>
            </el-col>

            <el-col :span="16">
                <!--系统注册，但未加入社团展示的页面-->
                <el-row :gutter="20" class="mgb20" v-if="roleCode=='role-00007'">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.stLength==null?0:initResult.stLength}}</div>
                                    <div>系统社团数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubNoticeListLength==null?0:initResult.clubNoticeListLength}}</div>
                                    <div>社团公告数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubNewsListLength==null?0:initResult.clubNewsListLength}}</div>
                                    <div>社团新闻数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <!--社团社长展示的页面-->
                <el-row :gutter="20" class="mgb20" v-if="roleCode=='role-00005'">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubMemberListLength==null?0:initResult.clubMemberListLength}}</div>
                                    <div>社团成员数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubNoticeListByStCdLength==null?0:initResult.clubNoticeListByStCdLength}}</div>
                                    <div>社团公告数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubNewsListByStCdLength==null?0:initResult.clubNewsListByStCdLength}}</div>
                                    <div>社团新闻数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <!--社团社员展示的页面-->
                <el-row :gutter="20" class="mgb20" v-if="roleCode=='role-00003'">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubFundsLength==null?0:initResult.clubFundsLength}}</div>
                                    <div>我的代缴费用数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubActivityLength==null?0:initResult.clubActivityLength}}</div>
                                    <div>我的活动</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.messageListLength==null?0:initResult.messageListLength}}</div>
                                    <div>我的留言反馈</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <!--社团团委、社联展示的页面-->
                <el-row :gutter="20" class="mgb20" v-if="roleCode=='role-00002' || roleCode=='role-00004'">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.stLength==null?0:initResult.stLength}}</div>
                                    <div>系统社团数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.clubActivityLength==null?0:initResult.clubActivityLength}}</div>
                                    <div>社团活动数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ initResult.stLength==null?0:initResult.stLength}}</div> <!--//TODO-->
                                    <div>社团创建申请数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <!--superadmin展示的页面-->
                <el-row :gutter="20" class="mgb20" v-if="roleCode=='role-00001'">
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-lx-people grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">1234</div>
                                    <div>系统社团数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-lx-notice grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">321</div>
                                    <div>系统社团活动数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-lx-goods grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">5000</div>
                                    <div>系统用户数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <el-card shadow="hover" style="height:403px;">
                    <div slot="header" class="clearfix">
                        <span>待办事项</span>
                        <el-button style="float: right; padding: 3px 0" type="text">添加</el-button>
                    </div>
                    <el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">
                        <el-table-column width="40">
                            <template slot-scope="scope">
                                <el-checkbox v-model="scope.row.status"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column width="60">
                            <template slot-scope="scope">
                                <i class="el-icon-edit"></i>
                                <i class="el-icon-delete"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="bar" class="schart" canvasId="bar" :data="data" type="bar" :options="options"></schart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <schart ref="line" class="schart" canvasId="line" :data="data" type="line" :options="options2"></schart>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script src="../../../style/js/dashboard/dashboard.js">

</script>
<style scoped>
    @import '../../../style/csss/dashboard/dashboard.css';/* 引入css文件*/
</style>
