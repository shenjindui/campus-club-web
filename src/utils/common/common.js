export default {
    /**
     * 状态的翻译
     * @param row
     * @param column
     * @returns {string}
     */
    formateStatus: function (row, column) {
        switch(row.statusCd){
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
}
