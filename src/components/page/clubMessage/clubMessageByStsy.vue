<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 我的反馈管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`我的反馈管理(${pageParms.total})`" name="first" v-show="true">
                    <!--//判断token是否过期合法的对话框-->
                    <el-dialog
                            title="提示"
                            :visible.sync="dialogVisible"
                            width="30%"
                            >
                           <!-- :before-close="handleClose()">-->
                        <span >{{errorMessage}}</span>
                        <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClose()">确 定</el-button>
                     </span>
                    </el-dialog>
                    <template v-if="message === 'first'">
                        <div class="handle-box">
                            <el-input  placeholder="反馈留言编号" class="handle-input mr10" v-model="params.messageCd"></el-input>
                           <!-- <el-input  placeholder="反馈留言所属社团编号" class="handle-input mr10" v-model="params.stCd"></el-input>-->
                            <el-select v-model="params.messageStCd" placeholder="所属社团编号" required="required" >
                                <el-option
                                        v-for="item in stList"
                                        :key="item.stCd"
                                        :label="item.stName"
                                        :value="item.stCd"/>
                            </el-select>
                            <el-select v-model="params.messagePsccd" placeholder="留言状态" required="required" >
                                <el-option
                                        v-for="item in messagePsccdList"
                                        :key="item.Cd"
                                        :label="item.Name"
                                        :value="item.Cd"/>
                            </el-select>
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
                            <el-button type="primary" icon="search" @click="add()" plain>新增</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="ListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange"  v-loading="loading">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="留言UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="messageCd" label="留言编号" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="messageSno" label="留言工号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="messageName" label="留言人名字" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="messageStCd" label="留言所属社团编号" width="160" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="messagePsccd" label="留言状态" :formatter="common.formateMessagePsccd"  width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="messageDesc"  label="留言内容" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="messagePscCode"  label="留言处理人编号" width="120" align="center"  :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="messagePscName"  label="留言处理人姓名" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="messagePscOpin"  label="留言处理意见" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="120" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="updateTime" :formatter="dateFormate.dateformatUpdateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
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
                        <el-dialog title="添加反馈留言" :visible.sync="dialogFormVisible" @close="AddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="所属社团编号" :label-width="formLabelWidth"  prop="messageStCd">
                                            <el-select v-model="addForm.messageStCd" placeholder="所属社团编号" required="required" >
                                                <el-option
                                                        v-for="item in stList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="请输入留言内容" :label-width="formLabelWidth" prop="messageDesc">
                                            <el-input type="textarea" :rows="2" placeholder="请输入留言内容" v-model="addForm.messageDesc"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="AddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="Add('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                        <el-dialog title="反馈留言信息详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="反馈留言UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="反馈留言UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="留言编号" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.messageCd" placeholder="留言编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="所属社团编号" :label-width="formLabelWidth">
                                            <el-select v-model="detailForm.messageStCd" placeholder="所属社团编号" required="required" :disabled="true">
                                                <el-option
                                                        v-for="item in stList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="留言工号" :label-width="formLabelWidth" >
                                            <el-input v-model.trim="detailForm.messageSno" placeholder="留言工号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="留言人名字" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.messageName" placeholder="留言人名字" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="留言状态" :label-width="formLabelWidth">
                                            <el-input v-model="detailForm.messagePsccdDdct" placeholder="留言状态" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                        <el-col :span="11">
                                            <el-form-item label="留言内容" :label-width="formLabelWidth">
                                                <el-input v-model.trim="detailForm.messageDesc" placeholder="留言内容" :disabled="true"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="11">
                                            <el-form-item label="留言处理人编号" :label-width="formLabelWidth">
                                                <el-input v-model.trim="detailForm.messagePscCode" placeholder="" :disabled="true"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                <el-row :gutter="16" type="flex">
                                        <el-col :span="11">
                                            <el-form-item label="留言处理人姓名" :label-width="formLabelWidth">
                                                <el-input v-model.trim="detailForm.messagePscName" placeholder="" :disabled="true"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="11">
                                            <el-form-item label="留言处理意见" :label-width="formLabelWidth">
                                                <el-input v-model.trim="detailForm.messagePscOpin" placeholder="" :disabled="true"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="创建时间" :label-width="formLabelWidth">
                                            <el-input v-model="detailForm.createTime" placeholder="创建时间" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="更新时间" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.updateTime" placeholder="更新时间" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="DetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>



</template>

<script src="../../../style/js/clubMessage/clubMessageStsy.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';/* 引入css文件*/
</style>

