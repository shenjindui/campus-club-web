import store from "../../../store/store";

export default {
    //强制刷新
    inject:['reload'],
    data() {
        return {
            active: 0,
            /**
             * 基本信息
             */
            baseInfoForm: {
                schoolNo: '',
                collegeNo: '',
                stNature: '',
                stName:'',
                stDesc: '',
                remark: '',
                stChargeName:'',
                stChargePhone:'',
                stChargeSno:'',
                stCd:'',
                createOpinion:''
            },
            /**
             * 设置el-form-item 的长度
             */
            formLabelWidth: '100px',
            /**
             * 文件列表
             */
            fileTableData:[],
            /**
             * token
             */
            token: {token: store.fetchIDlist("token") },
            /**
             * 用户编码
             */
            userCode:store.fetchIDlist("userInfo").userCode,
        };
    },
    created () {
        this.init();
    },
    methods: {
        next() {
            if (this.active++ > 2) {
            }
        },
        step() {
            if (this.active-- <0) {
            }
        },
        onSubmit() {
        },
        /**
         * 文件列表
         */
        getFileList(){
            this.$axios
                .post("/api/fileList", {
                    currentPage: store.fetchIDlist("currentPage")==0?1:store.fetchIDlist("currentPage"),
                    pageSize:store.fetchIDlist("pageSize"),
                    filePurpose:1,
                    stCd:this.baseInfoForm.stCd,
                    userCode:store.fetchIDlist("userInfo").userCode,

                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.fileTableData=[];
                        this.fileTableData=successResponse.data.data.grid.list;
                        this.total='';
                        this.total=successResponse.data.data.grid.total;
                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                    }
                    if (successResponse.data.status === 500) { //后台异常时
                        this.errorMessage =successResponse.data.description;
                    }
                })
                .catch(failResponse => {});
        },
        /**
         * 文件详情
         * @param index
         * @param fileTableData
         */
        detailFile(index,fileTableData){
            alert(fileTableData[index].uuid);
        },
        /**
         * 页面加载初始化
         */
        init(){
            this.$axios
                .post("/api/clubdetail", {
                   uuid:this.$route.query.uuid,
                },{headers: {
                        'content-type': 'application/json',
                        "token":store.fetchIDlist("token")
                    }})
                .then(successResponse => {
                    if (successResponse.data.status === 200) {
                        this.baseInfoForm=successResponse.data.data;
                        this.getFileList();
                    }
                    if (successResponse.data.status === 400) {
                        let warnMessage = successResponse.data.description;
                        this.$message({
                            message: warnMessage,
                            type: 'warning'
                        })
                    }
                    if (successResponse.data.status === 500) { //后台异常时
                        this.errorMessage =successResponse.data.description;
                    }
                })
                .catch(failResponse => {});
        },
        /**
         * 返回按钮事件
         */
        back(){
            this.$router.push("/clubinfo");
        }
    }
}
