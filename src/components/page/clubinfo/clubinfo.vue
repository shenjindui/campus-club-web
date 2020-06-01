<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社团信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs>
                <el-tab-pane :label="`社团信息列表(${pageParms.total})`" name="first" v-show="true">
                    <!--//判断token是否过期合法的对话框-->
                    <el-dialog
                            title="提示"
                            :visible.sync="dialogVisible"
                            width="30%"
                    >
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog>
                    <template v-if="message === 'first'">
                        <div class="handle-box">
                            <el-select v-model="params.statusCd" placeholder="社团状态" class="handle-select mr10">
                                <el-option
                                v-for="item in statusCds"
                                :key="item.dctVal"
                                :label="item.dctValNm"
                                :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="社团编号" class="handle-input mr10" v-model="params.stCd"></el-input>
                            <el-input  placeholder="社团名称" class="handle-input mr10" v-model="params.stName"></el-input>
                            <el-date-picker
                                    v-model="params.paramsTime"
                                    type="datetimerange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                            <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset()">重置</el-button>
                        </div>
                        <div class="handle-box">
                           <!-- <el-button type="primary" icon="search" @click="add()" plain>新增</el-button>-->
                            <el-button type="success" icon="reset" @click="edit()" plain>修改</el-button>
                            <!--<el-button type="warning" icon="search" @click="deletes()" plain v-if="isStatus">失效</el-button>
                            <el-button type="warning" icon="search" @click="deletes()" plain v-else>生效</el-button>-->
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="stListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="社团UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="stCd" label="社团编号" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="stName" label="社团名称" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="statusCd" :formatter="common.formateClubStatus" label="社团状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="workflowCd" :formatter="common.workFlowStatus" label="流程状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="schoolNo" label="所属学校编码" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="collegeNo" label="所属学院编码" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="stChargeName" label="社团负责人" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="stChargePhone" label="负责人手机号"  width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="stChargeSno" label="负责人学号" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="stFounder" label="社团创建人"  width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="stDesc" label="社团描述" width="80" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="stNature" label="社团性质" width="80" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="115" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateFormate.dateformatUpdateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination">
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-sizes="[5, 10, 20, 50]"
                                    :page-size="100"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="pageParms.total">
                            </el-pagination>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script src="../../../style/js/clubinfo/clubinfo.js">
</script>
<style scoped>
    @import '../../../style/csss/clubinfo/clubinfo.css';
</style>

