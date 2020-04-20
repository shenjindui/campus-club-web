import { Loading } from 'element-ui';

let loading;
export default{
    //定义加载动画
      startLoading() {
        loading = Loading.service({
            lock:true,    //是否锁定
            text:"拼命加载中...",   //显示在加载图标下方的加载文案
            background:'rgba(0,0,0,.7)',   //遮罩背景色
        });
      },

//结束加载动画，调用该实例的 close 方法来关闭
      endLoading(){
        loading.close();
    }
}
