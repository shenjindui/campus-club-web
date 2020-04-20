<template>
    <div class="bodycontainer">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社团人员管理</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="container">
            <el-backtop target=".bodycontainer"></el-backtop>
            <el-row>
                <div class="time-warp2">
                    <el-input  placeholder="请输入学号" style="width: 200px" v-model="params.memberSno"></el-input>&nbsp;
                    <el-button type="danger" icon="search" @click="search()">搜索</el-button>
                    <el-button type="danger" icon="reset" @click="reset()">重置</el-button>
                </div>
            </el-row>
            <el-row>
               <!-- {{ stMembers }}-->
                <el-col :span="6" v-for="member in stMembers.length" :key="o"  class="elcol">
                    <!--{{stMember[member-1]}}-->
                    <el-card :body-style="{ padding: '0px' }" class="elcard">

                        <img :src="stMembers[member-1].fileRte" class="user-avator" alt="" >
                        <div class="infoInduce"><!--个人介绍:-->{{ stMembers[member-1].remark  }}</div>
                        <!--<img :src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">-->
                        <div >
                            <span></span>
                            &nbsp;&nbsp;&nbsp;&nbsp;姓名:<span>{{ stMembers[member-1].memberName }}</span><p>
                            <hr/>
                            &nbsp;&nbsp;&nbsp;&nbsp;学号:<span>{{ stMembers[member-1].memberSno }}</span><p></p>
                            <hr/>
                            &nbsp;&nbsp;&nbsp;&nbsp;加入时间：<p></p>
                            &nbsp;&nbsp;&nbsp;&nbsp;<time class="time">{{ dateformat(stMembers[member-1].createTime) }}</time>

                            <div class="bottom">
                                <el-button type="text" class="button" @click="info(stMembers[member-1].memberCd)">查看详情</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <el-dialog title="成员详情" :visible.sync="detailFormVisible" @close="menuDetailCancle('detailForm')">
                <el-form :model="detailForm" ref="detailForm" >
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="成员编号" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.memberCd" placeholder="成员编号" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="成员UUID" :label-width="formLabelWidth">
                                <el-input v-model.trim="detailForm.uuid" placeholder="成员UUID" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="成员姓名" :label-width="formLabelWidth">
                                <el-input v-model.trim="detailForm.memberName" placeholder="成员姓名" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="成员工号" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.memberSno" placeholder="成员工号" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="专业班级" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.major" placeholder="专业班级" :disabled="true" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="所属社团编号" :label-width="formLabelWidth">
                                <el-input v-model="detailForm.stCd" placeholder="所属社团编号" :disabled="true" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="加入时间" :label-width="formLabelWidth">
                                <el-input v-model.trim="detailForm.createTime" placeholder="加入时间" :disabled="true" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="更新时间" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.updateTime" placeholder="更新时间" :disabled="true" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="座右铭" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.remark" :disabled="true" type="textarea"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="menuDetailCancle('detailForm')" plain>返回</el-button>
                </div>
            </el-dialog>
        </div>
    </div>

</template>

<script src="../../../style/js/clubMember/clubMember.js">

</script>

<style scoped>
    @import '../../../style/csss/clubMember/clubMember.css';/* 引入css文件*/
</style>
