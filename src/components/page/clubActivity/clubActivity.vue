<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社团活动管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick">
                <el-tab-pane :label="`社团活动列表(${pageParms.total})`" name="first" v-show="true">
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
                            <el-input  placeholder="活动编号" class="handle-input mr10" v-model="params.activityId"></el-input>
                            <el-input  placeholder="活动名称" class="handle-input mr10" v-model="params.activityName"></el-input>
                            <el-date-picker
                                    v-model="params.paramsTime"
                                    type="datetimerange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束时间"
                                    :picker-options="pickerOptions">
                            </el-date-picker>
                            <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset()">重置</el-button>
                        </div>
                        <div class="handle-box">
                            <el-button type="primary" icon="search" @click="add()" plain>新增</el-button>
                            <el-button type="success" icon="reset" @click="edit()" plain>修改</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="activityListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="活动UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="activityId" label="活动编号" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="activityName" label="活动名称" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="statusCd" :formatter="common.formateActivityStatus" label="活动状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="activityType"  label="活动类型" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="associationAgree" :formatter="common.workFlowStatus" label="社联是否审批通过" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="youthLeagueAgree" :formatter="common.workFlowStatus" label="团委是否审批通过" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="proposaAgree" :formatter="common.workFlowStatus" label="活动策划是否通过"  width="150" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="hostStCd" label="主办社团编号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="activitySpace" label="活动地点"  width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="foundsNum" label="活动资金预算" width="120" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="activityDsc" label="活动内容" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="activityAssessor" label="活动考核人" width="110" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="activityScore" label="活动考核分数" width="110" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="startTime" :formatter="dateFormate.dateformatStartTime" label="预计活动开始时间" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="endTime" :formatter="dateFormate.dateformatEndTime" label="预计结束开始时间" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
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
<script src="../../../style/js/clubActivity/clubActivity.js">
</script>
<style scoped>
    @import '../../../style/csss/clubinfo/clubinfo.css';
</style>

