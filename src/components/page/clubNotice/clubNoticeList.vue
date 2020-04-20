<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 社团公告管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick">
                <el-tab-pane :label="`社团公告信息列表(${pageParms.total})`" name="first" v-show="true">
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
                            <el-select v-model="params.noticeStatus" placeholder="公告状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="公告编号" class="handle-input mr10" v-model="params.noticeCd"></el-input>
                            <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                            <el-button type="primary" icon="reset" @click="reset()">重置</el-button>
                        </div>
                        <div class="handle-box">
                            <el-button type="primary" icon="search" @click="add()" plain>新增</el-button>
                            <el-button type="success" icon="reset" @click="edit()" plain>修改</el-button>
                            <el-button type="warning" icon="search" @click="deletes()" plain >删除</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                            <el-button type="warning" icon="search" @click="setStatus('0')" plain v-if="isStatus">失效</el-button>
                            <el-button type="warning" icon="search" @click="setStatus('1')" plain v-else>生效</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="ListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="公告UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="noticeCd" label="公告编号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="noticeDesc" label="公告内容" width="200" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="noticeStatus" :formatter="formateNoticeStatus" label="公告状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="noticeStCd" label="公告所属社团编号" width="140" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="publisher" label="发布人" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="releaseTime" :formatter="dateformat" label="发布时间" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="trafficVolume" label="公告访问量"  width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateformat" label="创建时间" width="115" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateformat" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
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

<script src="../../../style/js/clubNoticeList/clubNoticeList.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';
</style>

