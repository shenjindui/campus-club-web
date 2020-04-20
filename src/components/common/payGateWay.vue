<template>
    <div v-html = "payGateWay">{{payGateWay}}</div>
</template>
<script>
    export default {
        name: 'payGateWay',
        data(){
            return {
                payGateWay:''
            }
        } ,
        mounted () {
            let form = this.$route.query.htmlData
            this.payGateWay = form
            this.$nextTick(()=> {
                document.getElementById('paymentSubmit').submit()
            })
        }
    }
</script>
