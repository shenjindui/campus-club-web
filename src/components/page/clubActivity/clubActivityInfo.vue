<template>
    <div>
        <div class="maintain">
            <div class="leftMain">
                <el-steps :active="active" direction="vertical" finish-status="success">
                    <el-step title="活动基本信息" icon="el-icon-edit"></el-step>
                    <el-step title="活动相关文件" icon="el-icon-upload"></el-step>
                    <el-step title="填写申请理由" icon="el-icon-edit"></el-step>
                </el-steps>
            </div>
            <div class="rightForm">
                <div class="baseInfoForm">
                    <el-form ref="baseInfoForm" :model="baseInfoForm" :rules="rules" label-width="100px" :disabled="true">
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="活动名称" prop="activityName">
                                    <el-input v-model="baseInfoForm.activityName" placeholder="活动名称" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="活动地点" prop="activitySpace">
                                    <el-input v-model="baseInfoForm.activitySpace" placeholder="活动地点" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="9">
                                <el-form-item label="活动类型" :label-width="formLabelWidth" prop="activityType">
                                    <el-select v-model="baseInfoForm.activityType" placeholder="活动类型">
                                        <el-option
                                                v-for="item in activityTypeList"
                                                :key="item.dctTpCd"
                                                :label="item.dctTpNm"
                                                :value="item.dctVal"/>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="9">
                                <el-form-item label="资金预算" prop="foundsNum">
                                    <el-input v-model="baseInfoForm.foundsNum" placeholder="资金预算" clearable></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="18">
                                <el-form-item label="活动时间" prop="activityTime">
                                    <el-date-picker
                                            v-model="baseInfoForm.activityTime"
                                            type="datetimerange"
                                            align="right"
                                            unlink-panels
                                            range-separator="至"
                                            start-placeholder="活动预计开始日期"
                                            end-placeholder="活动预计结束日期"
                                            :picker-options="pickerOptions">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20" type="flex">
                            <el-col :span="18">
                                <el-form-item label="活动内容" prop="activityDsc">
                                    <el-input type="textarea" :rows="2" placeholder="活动内容" v-model="baseInfoForm.activityDsc"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <input type="hidden" v-model="hideParms.uuid" v-if="hideParms.uuid!=null&&hideParms.uuid!=''"></input>
                    </el-form>
                    <div slot="footer" class="baseInfoButtonGrops">
                        <el-button type="primary" @click="back()" plain>返回</el-button>
                        <el-button type="primary" @click="next" plain>下一步</el-button>
                    </div>
                </div>
                <div class="fileForm">
                    <div slot="footer" class="fileGroups">
                        <div class="setpStyle">
                            <el-button type="primary" @click="back()" plain class="setpStyle">返回</el-button>
                            <el-button type="primary" @click="step" plain class="setpStyle">上一步</el-button>
                        </div>

                    </div>
                    <div class="fileListTable">
                        <el-table :data="fileTableData" border class="table" >
                            <el-table-column prop="uuid" label="文件UUID" width="150" align="center" :show-overflow-tooltip="true" ></el-table-column>
                            <el-table-column prop="fileId" label="文件编号" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileNm" label="文件名称" width="170" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileTpCd" label="文件后缀" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileSize" label="文件大小" width="100" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="fileRte" label="保存路径"  width="200" align="center":show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="createTime" :formatter="dateformat" label="创建时间" width="165" align="center" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="updateTime" :formatter="dateformat" label="更新时间" align="165" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column fixed="right" label="操作" width="120">
                                <template slot-scope="scope">
                                    <el-button @click.native.prevent="detailFile(scope.$index,fileTableData)" type="text" size="small">查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="opnionForm">
                        <el-form ref="baseInfoForm" :model="baseInfoForm" label-width="100px" :disabled="true">
                            <el-form-item label="申请理由" :label-width="formLabelWidth"  prop="opinion">
                                <el-input type="textarea" :rows="4" placeholder="请填写申请理由" v-model="baseInfoForm.createOpinion" maxlength="300" show-word-limit clearable>
                                </el-input>
                            </el-form-item>
                        </el-form>
                        <div class="submitStyle">
                            <el-button type="primary" @click="back()" plain class="submitStyle">返回</el-button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script src="../../../style/js/clubActivity/clubActivityInfo.js">
</script>
<style scoped>
    @import '../../../style/csss/clubApproval/clubApproval.css';
</style>
