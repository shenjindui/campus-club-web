export default {
    /**
     * 状态的翻译
     * @param row
     * @param column
     * @returns {string}
     */
    formateStatus: function (row, column) {
        switch(row.statusCd){
            case 0 :
                return '失效';
                break;
            case 1 :
                return '生效';
                break;
            case '0' :
                return '失效';
                break;
            case '1' :
                return '生效';
                break;
            case "0" :
                return '失效';
                break;
            case "1":
                return '生效';
                break;
            default:
                return '未知错误';
        }
    },
    /**
     * 菜单叶子节点进行翻译
     * @param row
     * @param column
     * @returns {string}
     */
    formateLeafFlagCd: function (row, column) {
        switch(row.leafFlagCd){
            case '0':
                return '否';
                break;
            case '1':
                return '是';
                break;
            default:
                return '未知错误';
        }
    },
    /**
     * 是否选择器
     */
    yesOrNoCds:[
        {
            value: '1',
            dctValNm: '是'
        },
        {
            value: '0',
            dctValNm: '否'
        }
    ],
    /**
     * 性别选择器
     */
    sexCds:[
        {
            value: '1',
            dctValNm: '男'
        },
        {
            value: '0',
            dctValNm: '女'
        }
    ],
    /**
     * 对新闻的状态翻译
     * @param row
     * @param column
     * @returns {string}
     */
    formateNewsStatus: function (row, column) {
        switch(row.newsStatus){
            case '0':
                return '失效';
                break;
            case '1':
                return '生效';
                break;
            default:
                return '未知错误';
        }
    },
    /**
     * amountType
     * 金额操作类型
     */
    formateAmountType: function (row, column) {
        switch(row.amountType){
            case '+':
                return '收入';
                break;
            case '-':
                return '支出';
                break;
            default:
                return '未知错误';
        }
    },
    /**
     * 支付状态
     * @param row
     * @param column
     * @returns {string}
     */
    formateFundsPsccd: function (row, column) {
        switch(row.fundsPsccd){
            case '0':
                return '未支付';
                break;
            case '1':
                return '已支付';
                break;
            default:
                return '未知错误';
        }
    },

    /**
     * 对活动状态进行翻译
     * @param row
     * @param column
     * @returns {string}
     */
    formateActivityStatus: function (row, column) {
        switch(row.statusCd){
            case '0':
                return '未生效';
                break;
            case '1':
                return '生效';
                break;
            case '2':
                return '失效';
                break;
            default:
                return '未知错误';
        }
    },

    /**
     *  对活动审核状态进行翻译
     * @param row
     * @param column
     * @returns {string}
     */
    workFlowStatus:function(row, column){
        switch(row.associationAgree||row.youthLeagueAgree||row.proposaAgree){
            case '0':
                return '待审核';
                break;
            case '1':
                return '审核中';
                break;
            case '2':
                return '审核通过';
                break;
            case '3':
                return '审核不通过';
                break;
            default:
                return '未知错误';
        }
    },
}
