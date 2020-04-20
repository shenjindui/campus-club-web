export default {
    dateformatUpdateTime: function (row, column) {
        let date = new Date(row.updateTime).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    dateformatCreateTime: function (row, column) {
        let date = new Date(row.createTime).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    dateformat: function (dateString) {
        let date = new Date(dateString).toJSON();
        return new Date(+new Date(date) + 8 * 3600 * 1000).toISOString().
        replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
}
