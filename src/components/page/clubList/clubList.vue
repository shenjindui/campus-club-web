<template>
    <div class="bodycontainer">
    <div class="crumbs">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社团列表</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
        <div class="container">
            <el-backtop target=".bodycontainer"></el-backtop>
            <el-row>
                <div class="time-warp2">
                    <el-input  placeholder="请输入社团编号" style="width: 200px" v-model="params.stCd"></el-input>&nbsp;
                    <el-button type="danger" icon="search" @click="search()">搜索</el-button>
                    <el-button type="danger" icon="reset" @click="reset()">重置</el-button>
                </div>
            </el-row>
            <el-row>
                <!--{{ stMembers }}-->
                <el-col :span="6" v-for="member in stMembers.length" :key="o"  class="elcol">
                    <!--{{stMember[member-1]}}-->
                    <el-card :body-style="{ padding: '0px' }" class="elcard">

                        <img :src="stMembers[member-1].fileRte" class="user-avator" alt="" >
                        <div class="infoInduce">【{{ stMembers[member-1].stName  }}】</div>
                        <!--<img :src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image">-->
                        <div >
                            <span></span>
                            &nbsp;&nbsp;&nbsp;&nbsp;社长:<span>{{ stMembers[member-1].stChargeName }}</span><p>
                            <hr/>
                            <span></span>
                            &nbsp;&nbsp;&nbsp;&nbsp;社团编号:<span>{{ stMembers[member-1].stCd }}</span><p>
                            <hr/>
                            &nbsp;&nbsp;&nbsp;&nbsp;成立时间：<p></p>
                            &nbsp;&nbsp;&nbsp;&nbsp;<time class="time">{{ dateformat(stMembers[member-1].createTime) }}</time>
                        </div>
                        <div class="stDesc">
                            <span style="color: red">社团简介:</span>{{ stMembers[member-1].stDesc }}
                            &nbsp;&nbsp;&nbsp;<el-button type="text" class="button" @click="info(stMembers[member-1].stCd)" >查看详情</el-button>
                            {{stMembers[member-1].pcsStCode}}
                            <el-button type="text" class="button" @click="alerts(stMembers[member-1].pcsStCode)" v-if="stMembers[member-1].pcsStCode=='1'">已申请,带社长审核</el-button>
                            <el-button type="text" class="button" @click="alerts(stMembers[member-1].pcsStCode)" v-else-if="stMembers[member-1].pcsStCode=='2'">已加入该社团</el-button>
                            <el-button type="text" class="button" @click="alerts(stMembers[member-1].pcsStCode)" v-else-if="stMembers[member-1].pcsStCode=='3'">已申请,未通过</el-button>
                            <el-button type="text" class="button" @click="join(stMembers[member-1].stCd)" v-else>申请加入</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <!--{{detailForm}}-->
            <el-dialog title="社团详情" :visible.sync="detailFormVisible" @close="menuDetailCancle('detailForm')">
                <el-form :model="detailForm" ref="detailForm" >
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="社团编号" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.stCd" placeholder="社团编号" :readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="社团UUID" :label-width="formLabelWidth">
                                <el-input v-model.trim="detailForm.uuid" placeholder="社团UUID" :readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="社团名称" :label-width="formLabelWidth">
                                <el-input v-model.trim="detailForm.stName" placeholder="社团名称" :readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="社团社长" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.stChargeName" placeholder="社团社长" :readonly="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="所属学校" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.schoolName" placeholder="所属学校" :readonly="true" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="所属学院" :label-width="formLabelWidth">
                                <el-input v-model="detailForm.collegeName" placeholder="所属学院" :readonly="true" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="11">
                            <el-form-item label="成立时间" :label-width="formLabelWidth">
                                <el-input v-model.trim="detailForm.createTime" placeholder="成立时间" :readonly="true" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="社团备注" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.remark" placeholder="社团备注" :readonly="true"  :autosize="{ minRows: 4, maxRows: 6}"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="16" type="flex">
                        <el-col :span="22">
                            <el-form-item label="社团描述" :label-width="formLabelWidth" >
                                <el-input v-model="detailForm.stDesc" :disabled="true" type="textarea"
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

<script src="../../../style/js/clubList/clubList.js">

</script>

<style scoped>
    @import '../../../style/csss/clubList/clubList.css';/* 引入css文件*/
</style>
