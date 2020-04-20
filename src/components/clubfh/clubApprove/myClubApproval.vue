
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i>&nbsp;&nbsp;我的已办代办</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`代办事宜(${pageParms.total})`" name="first" v-show="firstVisiable">
                    <!--//判断token是否过期合法的对话框-->
                    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog>
                    <template v-if="message === 'first'">
                        <div class="handle-box">
                            <el-input  placeholder="工作流编号" class="handle-input mr10" v-model="params.workFlowCode"></el-input>
                            <el-input  placeholder="系统业务编号" class="handle-input mr10" v-model="params.businessCode"></el-input>
                            <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset()">重置</el-button>
                        </div>
                        <div class="handle-box">
                            <el-button type="primary" icon="search" @click="approver()" plain>审核</el-button>
                        <p></p>
                        <div>
                            <el-table :data="approvalListData" border class="table" ref="multipleTable"
                                      @selection-change="handleSelectionChange" v-loading="approvalListDataLoading">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="UUID" width="180" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="workFlowCode" label="工作流编号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="workFlowName" label="工作流主题" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="businessCode" label="系统业务编号" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="businessAssociationCode" label="业务关联编号" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="workFlowLinkName" label="上一环节名称" width="180" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="workFlowNodeCode" label="当前节点编号" width="130" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="remark" label="备注" width="100" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateformat" label="创建时间" width="115" align="center" :show-overflow-tooltip="true"></el-table-column>
                            </el-table>
                        </div>
                        <div class="pagination">
                            <!-- :current-page="currentPage4"-->
                            <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :page-sizes="[5, 10, 20, 50]"
                                    :page-size="100"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="pageParms.total">
                            </el-pagination>
                        </div>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`已办事宜(${pageParmsSecond.total})`" name="second" v-show="secondVisiable">
                    <!--//判断token是否过期合法的对话框-->
                    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog>
                    <template v-if="message === 'second'">
                        <div class="handle-box">
                            <el-button type="primary" icon="search" @click="info()" plain>查看</el-button>
                            <p></p>
                            <div>
                                <el-table :data="approvaledListData" border class="table" ref="multipleTable"
                                          @selection-change="handleSelectionChange" v-loading="approvaledListDataLoading">
                                    <el-table-column type="selection" width="40" align="center"></el-table-column>
                                    <el-table-column prop="uuid" label="UUID" width="180" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                    <el-table-column prop="workFlowCode" label="工作流编号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="workFlowName" label="工作流主题" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="pcsStCode" label="当前状态" :formatter="formateStatus" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="businessCode" label="系统业务编号" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="businessAssociationCode" label="业务关联编号" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="workFlowLinkName" label="上一环节名称" width="180" align="center" :show-overflow-tooltip="true"></el-table-column>
                                    <el-table-column prop="workFlowNodeCode" label="当前节点编号" width="130" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                    <el-table-column prop="remark" label="备注" width="100" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                    <el-table-column prop="createTime" :formatter="dateformat" label="创建时间" width="115" align="center" :show-overflow-tooltip="true"></el-table-column>
                                </el-table>
                            </div>
                            <div class="pagination">
                                <!-- :current-page="currentPage4"-->
                                <el-pagination
                                        @size-change="handleSizeChange"
                                        @current-change="handleCurrentChange"
                                        :page-sizes="[5, 10, 20, 50]"
                                        :page-size="100"
                                        layout="total, sizes, prev, pager, next, jumper"
                                        :total="pageParmsSecond.total">
                                </el-pagination>
                            </div>
                        </div>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script src="../../../style/js/clubfh/clubApproval/myClubApproval.js">
</script>
<style scoped>
    @import '../../../style/csss/myClubApproval/myClubApproval.css';/* 引入css文件*/
</style>

