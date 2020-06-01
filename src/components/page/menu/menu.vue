
<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 菜单管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!--角色选择器-->
        <el-popover
                placement="top"
                width="1000"
                trigger="click"
                title="角色选择"
                transition="fade-in-linear"
                v-model="visible">
            <el-table :data="roleListData" ref="roleListTable">
                <el-table-column type="selection" width="28" align="center" ></el-table-column>
                <el-table-column width="170" property="roleCode" label="角色编号"></el-table-column>
                <el-table-column width="200" property="roleName" label="角色名称"></el-table-column>
                <el-table-column width="300" property="uuid" label="角色UUID"></el-table-column>
                <el-table-column width="300" property="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间"></el-table-column>
            </el-table>
            <el-button type="primary" icon="search" @click="comfirm()">确定</el-button>
            <el-button type="primary" icon="search" @click="visible=false">取消</el-button>
        </el-popover>
        <!--角色选择器-->
        <div class="container">
            <el-tabs @tab-click="handleClick">
                <el-tab-pane :label="`菜单列表(${pageParms.total})`" name="first" v-show="true">
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
                            <el-select v-model="params.statusCd" placeholder="菜单状态" class="handle-select mr10">
                                <el-option
                                        v-for="item in statusCds"
                                        :key="item.dctVal"
                                        :label="item.dctValNm"
                                        :value="item.dctVal"/>
                            </el-select>
                            <el-input  placeholder="菜单编号" class="handle-input mr10" v-model="params.menuCode"></el-input>
                            <el-input  placeholder="菜单名称" class="handle-input mr10" v-model="params.menuName"></el-input>
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
                            <el-button type="success" icon="reset" @click="edit()" plain>修改</el-button>
                            <el-button type="warning" icon="search" @click="deletes()" plain>删除</el-button>
                            <el-button type="info" icon="reset" @click="detail()" plain>查看</el-button>
                            <el-button type="info" icon="reset" @click="apportion()" slot="reference" plain>分配角色</el-button>
                        </div>
                        <p></p>
                        <div>
                            <el-table :data="menuListData" border class="table" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
                                <el-table-column type="selection" width="40" align="center"></el-table-column>
                                <el-table-column prop="uuid" label="菜单UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="menuCode" label="菜单编号" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="menuName" label="菜单名称" width="110" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="parentMenuCode" label="父菜单编号" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="statusCd" :formatter="common.formateStatus" label="菜单状态" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="url" label="菜单URL" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="leafFlagCd" label="是否叶子节点" :formatter="common.formateLeafFlagCd" width="120" align="center":show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="sort" label="排序码" width="80" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="remark" label="备注" width="80" align="center" :show-overflow-tooltip="true" ></el-table-column>
                                <el-table-column prop="createTime" :formatter="dateFormate.dateformatCreateTime" label="创建时间" width="115" align="center" :show-overflow-tooltip="true"></el-table-column>
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
                       <!-- //添加菜单的对话框 begin-->
                        <!--@blur="$v.user.Phone.$touch()"表示blur事件触发（失去焦点）时验证。
                        @input="$v.user.Phone.$touch()"表示input事件触发（输入内容发生变化）时验证-->
                        <el-dialog title="添加菜单" :visible.sync="dialogFormVisible" @close="menuAddCancle('addForm')">
                            <el-form :model="addForm" ref="addForm" :rules="rules">
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="菜单名称" :label-width="formLabelWidth"  prop="menuName">
                                            <el-input v-model.trim="addForm.menuName" placeholder="菜单名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="菜单URL" :label-width="formLabelWidth" prop="url">
                                            <el-input v-model.trim="addForm.url" placeholder="菜单URL" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="排序码" :label-width="formLabelWidth" prop="sort">
                                            <el-input v-model="addForm.sort" placeholder="排序码" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="是否叶子节点" :label-width="formLabelWidth" prop="leafFlagCd">
                                            <el-select v-model="addForm.leafFlagCd" placeholder="请选择"  :label-width="formLabelWidth" >
                                                <el-option v-for="item in yesOrNoCds" :key="item.value" :label="item.dctValNm" :value="item.value" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="父级菜单" :label-width="formLabelWidth"  prop="parentMenuCode" v-if="addForm.leafFlagCd==1">
                                            <el-select v-model="addForm.parentMenuCode" placeholder="请选择"  :label-width="formLabelWidth" @change="initParentList(1)">
                                                <el-option key="0" label="一级菜单" value="0"/>
                                                <el-option v-for="item in parentMenuCodes" :key="item.menuCode" :label="item.menuName" :value="item.menuCode"/>
                                                <el-pagination
                                                        @current-change="parentCurrentChange"
                                                        :page-sizes="[5, 10, 20, 50]"
                                                        :page-size="5"
                                                        layout="prev, pager, next"
                                                        :total="parentListTotal">
                                                </el-pagination>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="父级菜单" :label-width="formLabelWidth"  prop="parentMenuCode" v-else>
                                            <el-select v-model="addForm.parentMenuCode" placeholder="请选择"  :label-width="formLabelWidth">
                                                <el-option key="0" label="一级菜单" value="0"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth">
                                            <el-input v-model="addForm.remark" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="menuAddCancle('addForm')">取 消</el-button>
                                <el-button type="primary" @click="menuAdd('addForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                        <!-- //添加菜单的对话框 end-->
                        <!-- //菜单详情的对话框 begin-->
                        <el-dialog title="菜单详情" :visible.sync="detailFormVisible" @close="menuDetailCancle('detailForm')">
                            <el-form :model="detailForm" ref="detailForm" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="菜单编号" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.menuCode" placeholder="菜单编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="菜单UUID" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.uuid" placeholder="菜单UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="菜单名称" :label-width="formLabelWidth">
                                            <el-input v-model.trim="detailForm.menuName" placeholder="菜单名称" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="菜单URL" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.url" placeholder="菜单URL" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="排序码" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.sort" placeholder="排序码" :disabled="true" ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="是否叶子节点" :label-width="formLabelWidth">
                                            <el-select v-model="detailForm.leafFlagCd" placeholder="请选择"  :label-width="formLabelWidth" :disabled="true" >
                                                <el-option v-for="item in yesOrNoCds" :key="item.value" :label="item.dctValNm" :value="item.value" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="父菜单编号" :label-width="formLabelWidth" >
                                            <el-select v-model="detailForm.parentMenuCode" placeholder="请选择"  :label-width="formLabelWidth" @click="initParentList" :disabled="true">
                                                <el-option key="0" label="一级菜单" value="0"/>
                                                <el-option v-for="item in parentMenuCodes" :key="item.menuCode" :label="item.menuName" :value="item.menuCode"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth" >
                                            <el-input v-model="detailForm.remark" :disabled="true" ></el-input>
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
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="menuDetailCancle('detailForm')" plain>返回</el-button>
                            </div>
                        </el-dialog>
                        <!-- //菜单详情的对话框 end-->
                        <!-- //修改菜单的对话框 begin-->
                        <el-dialog title="修改菜单" :visible.sync="updateFormVisible" @close="menuUpdateCancle('updateForm')">
                            <el-form :model="updateForm" ref="updateForm" :rules="rules" >
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="菜单编号" :label-width="formLabelWidth" >
                                            <el-input v-model="updateForm.menuCode" placeholder="菜单编号" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="菜单UUID" :label-width="formLabelWidth" >
                                            <el-input v-model="updateForm.uuid" placeholder="菜单UUID" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="菜单名称" :label-width="formLabelWidth"  prop="menuName">
                                            <el-input v-model.trim="updateForm.menuName" placeholder="菜单名称" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="菜单URL" :label-width="formLabelWidth" prop="url">
                                            <el-input v-model.trim="updateForm.url" placeholder="菜单URL" clearable></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="排序码" :label-width="formLabelWidth" prop="sort">
                                            <el-input v-model.trim="updateForm.sort" placeholder="排序码" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="是否叶子节点" :label-width="formLabelWidth" prop="leafFlagCd">
                                            <el-select v-model.trim="updateForm.leafFlagCd" placeholder="请选择"  :label-width="formLabelWidth" >
                                                <el-option v-for="item in yesOrNoCds" :key="item.value" :label="item.dctValNm" :value="item.value" />
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="16" type="flex">
                                    <el-col :span="11">
                                        <el-form-item label="父级菜单" :label-width="formLabelWidth"  prop="parentMenuCode">
                                            <el-select v-model="updateForm.parentMenuCode" placeholder="请选择"  :label-width="formLabelWidth" @click="initParentList">
                                                <el-option key="0" label="一级菜单" value="0"/>
                                                <el-option v-for="item in parentMenuCodes" :key="item.menuCode" :label="item.menuName" :value="item.menuCode"/>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="11">
                                        <el-form-item label="备注" :label-width="formLabelWidth">
                                            <el-input v-model="updateForm.remark" clearable ></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="menuUpdateCancle('updateForm')">取 消</el-button>
                                <el-button type="primary" @click="menuUpdate('updateForm')" plain>确 定</el-button>
                            </div>
                        </el-dialog>
                        <!-- //修改菜单的对话框 end-->
                    </template>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script src="../../../style/js/menu/menu.js">
</script>
<style scoped>
    @import '../../../style/csss/menu/menu.css';
</style>

