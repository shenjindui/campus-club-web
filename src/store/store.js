export default {

    saveIDlist(IDLIST_KEY,data){

        window.localStorage.setItem(IDLIST_KEY,JSON.stringify(data));

    },

    fetchIDlist(IDLIST_KEY) {
        if(IDLIST_KEY!=null){
            return JSON.parse(window.localStorage.getItem(IDLIST_KEY) || '[]');
        }
        return null;

    }
    ,
    clear(){
        window.localStorage.clear();
    },

    getMenuList(menuList){

        return begin+main+end;
    }

}
