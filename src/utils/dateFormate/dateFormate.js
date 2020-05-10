export default {
    /**
     * 对更新时间的翻译
     * @param row
     * @param column
     * @returns {string}
     */
    dateformatUpdateTime: function (row, column) {
        let date = new Date(row.updateTime).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    /**
     * 对创建时间的翻译
     * @param row
     * @param column
     * @returns {string}
     */
    dateformatCreateTime: function (row, column) {
        let date = new Date(row.createTime).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    /**
     * 对活动开始时间的翻译
     * @param row
     * @param column
     * @returns {string}
     */
    dateformatStartTime: function (row, column) {
        let date = new Date(row.startTime).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    /**
     * 对活动结束时间的翻译
     * @param row
     * @param column
     * @returns {string}
     */
    dateformatEndTime: function (row, column) {
        let date = new Date(row.endTime).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    /**
     * 对普通时间的翻译
     * @param dateString
     * @returns {string}
     */
    dateformat: function (dateString) {
        let date = new Date(dateString).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
}
