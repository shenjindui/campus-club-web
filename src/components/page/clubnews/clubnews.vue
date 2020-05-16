<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 新闻管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs @tab-click="handleClick"><!--v-model="menu">-->
                <el-tab-pane :label="`新闻列表(${pageParms.total})`" name="first" v-show="true">
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
                    <!--角色选择器-->
                    <el-popover
                            placement="top"
                            width="800"
                            trigger="manual"
                            title="角色选择"
                            transition="fade-in-linear"
                          v-model="visible">
                        <el-table :data="roleListData" ref="roleListTable">
                            <el-table-column type="selection" width="28" align="center" ></el-table-column>
                            <el-table-column width="150" property="roleCode" label="角色编号"></el-table-column>
                            <el-table-column width="100" property="roleName" label="角色名称"></el-table-column>
                            <el-table-column width="300" property="uuid" label="角色UUID"></el-table-column>
                            <el-table-column width="300" property="createTime" label="创建时间"></el-table-column>
                        </el-table>
                        <el-button type="primary" icon="search" @click="comfirm()">确定</el-button>
                        <el-button type="primary" icon="search" @click="visible=false">取消</el-button>
                    </el-popover>
                    <!--角色选择器-->
                    <template v-if="message === 'first'">
                        <div class="handle-box">
                           <!-- {{statusCds}}-->
                            <el-select v-model="params.newsStatus" placeholder="新闻状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="新闻编号" class="handle-input mr10" v-model="params.newsCd"></el-input>
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
                            <el-button type="primary" icon="search" @click="add()" plain v-show="isShow">新增</el-button>
                            <el-button type="success" icon="reset" @click="edit()" plain v-show="isShow">修改</el-button>
                            <el-button type="warning" icon="search" @click="deletes()" plain v-show="isShow">删除</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                            <el-button type="warning" icon="search" @click="setStatus('0')" plain v-if="isStatus" v-show="isShow">失效</el-button>
                            <el-button type="warning" icon="search" @click="setStatus('1')" plain v-else v-show="isShow">生效</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="newsListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="新闻UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="newsCd" label="新闻编号" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="newsStCd" label="新闻所属社团编号" width="150" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="newsTitle" label="新闻标题" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="newsDesc" label="新闻内容" width="200" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="newsStatus" :formatter="common.formateNewsStatus" label="新闻状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="publishTime" label="发布时间" width="130" align="center" :formatter="dateformat" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="publisher" label="发布人编号" width="100" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="trafficVolume" label="访问量" width="100" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="130" align="center" :show-overflow-tooltip="true"></el-table-column>
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
                       <!-- //添加新闻的对话框 begin-->
                        <el-dialog title="添加新闻" :visible.sync="dialogFormVisible" @close="AddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="32" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="公告所属社团：" :label-width="formLabelWidth">
                                            <el-select v-model="addForm.newsStCd" placeholder="请选择社团" required="required">
                                                <el-option
                                                        v-for="item in clubList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="新闻标题" :label-width="formLabelWidth"  prop="newsTitle">
                                            <el-input v-model.trim="addForm.newsTitle" placeholder="请输入新闻标题" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row  label-width="80px">
                                    <el-form-item label="请输入内容" :label-width="formLabelWidth"  prop="newsDesc">
                                    <el-input
                                            type="textarea"
                                            placeholder="请输入内容"
                                            v-model="addForm.newsDesc"
                                            maxlength="300"
                                            show-word-limit
                                    >
                                    </el-input>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="AddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="Add('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                        <!-- //添加新闻的对话框 end-->
                        <!-- //新闻详情的对话框 begin-->
                        <el-dialog title="新闻详情" :visible.sync="detailFormVisible" @close="DetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="新闻编号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.newsCd" placeholder="新闻编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="新闻UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="新闻UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="新闻标题" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.newsTitle" placeholder="新闻标题" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="发布时间" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.publishTime" placeholder="发布时间" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="发布人" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.publisher" placeholder="发布人" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="访问量" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.trafficVolume" :disabled="true" placeholder="访问量" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="创建时间" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.createTime" placeholder="创建时间" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="更新时间" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.updateTime" placeholder="更新时间" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="22">
                                        <el-form-item label="请输入内容" :label-width="formLabelWidth"  prop="newsDesc">
                                            <el-input
                                                    type="textarea"
                                                    placeholder="请输入内容"
                                                    v-model="detailForm.newsDesc"
                                                    maxlength="300"
                                                    show-word-limit :disabled="true"
                                            >
                                            </el-input>
                                        </el-form-item>
                                    </el-col>

                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="DetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>
                        <!-- //新闻详情的对话框 end-->
                        <!-- //修改新闻的对话框 begin-->
                        <el-dialog title="修改新闻" :visible.sync="updateFormVisible" @close="UpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="公告所属社团：" :label-width="formLabelWidth">
                                            <el-select v-model="updateForm.newsStCd" placeholder="请选择社团" required="required">
                                                <el-option
                                                        v-for="item in clubList"
                                                        :key="item.stCd"
                                                        :label="item.stName"
                                                        :value="item.stCd"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="请输入新闻标题" :label-width="formLabelWidth"  prop="newsTitle">
                                            <el-input v-model.trim="updateForm.newsTitle" placeholder="请输入新闻标题" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row  label-width="80px">
                                    <el-form-item label="请输入内容" :label-width="formLabelWidth"  prop="newsDesc">
                                        <el-input
                                                type="textarea"
                                                placeholder="请输入内容"
                                                v-model="updateForm.newsDesc"
                                                maxlength="300"
                                                show-word-limit
                                        >
                                        </el-input>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <input v-model.trim="updateForm.uuid"  :hidden="true"></input>
                                <el-button @click="UpdateCancle('updateForm')">取 消</el-button>
                                <el-button type="primary" @click="Update('updateForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                        <!-- //修改的对话框 end-->
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script src="../../../style/js/clubnews/clubnews.js">
</script>
<style scoped>
    @import '../../../style/csss/common/common.css';
</style>

