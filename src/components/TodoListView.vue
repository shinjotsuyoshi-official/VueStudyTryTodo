<script setup lang="ts">
    import { errMsgs } from '@/const/errorMessage';
    import { statuses } from '@/const/statuses';
    import { validate } from '@/const/validate';
    import { ref, type Ref } from 'vue';

    // localStorage 取得
    const storageData: string | null = localStorage.getItem("items");
    const items = storageData ? ref(JSON.parse(storageData)) : ref([]);

    // 変数定義
    const headerTextList: string[]                              // ヘッダーの値 
        = ["ID","タスク内容","期限","ステータス","編集","削除","保存"];
    let deleteItemId: number        = 0;                        // 削除処理用ID保持変数
    let modalTextDeleteItem: string = "";                       // 削除処理用のモーダルテキスト

    // 常時監視変数
    const editCntent: Ref<string | string>      = ref("");      // 編集中のタスク内容の値
    const editLimit: Ref<string | string>       = ref("");      // 編集中の期限の値
    const editStatus: Ref<string | string>      = ref("");      // 編集中のステータス値
    const errorMsg: Ref<string | string>        = ref("");      // エラーメッセージ
    const isErrFlg: Ref<boolean | boolean>      = ref(false);   // エラーフラグ
    const itemEditFlg: Ref<boolean | boolean>   = ref(false);   // 編集中フラグ
    const isShowModalFlg: Ref<boolean | boolean>= ref(false);   // モーダル表示フラグ

    /**
     * タスク編集処理
     * @param id 
     */
    function onEdit(id: number){
        // 単一更新チェック 
        if(itemEditFlg.value){
            errorMsg.value = errMsgs.MSG_002;
            isErrFlg.value = true;
            return
        }
        // itemEditFlg を更新
        itemEditFlg.value = true;
        // 表示切替
        items.value[id - 1].onEdit = true;
        // もともとの値を代入する
        editCntent.value = items.value[id - 1].content;
        editLimit.value = items.value[id - 1].limit;
        editStatus.value = items.value[id - 1].state;
    }
    /**
     * 編集中タスク保存処理
     * @param id
     */
    function onUpdate(id: number){
        // 入力値チェック
        if(!validate.checkInputValidation(editCntent.value, editLimit.value)){
            errorMsg.value = errMsgs.MSG_001;
            isErrFlg.value = true;
            return;
        }

        try{
            // newItem作成
            const  newItem = {
                id: id,
                content: editCntent.value,
                limit: editLimit.value,
                state: editStatus.value,
                onEdit: false,
            }
            
            //対象のitemをnewItemに更新
            items.value.splice(id - 1, 1, newItem);
            
            // ローカルストレージに上書き保存
            localStorage.setItem("items", JSON.stringify(items.value));
        }
        catch(e){
            throw(`更新処理中にエラーが発生しました。${e}`);
        }
        finally{
            // itemEditFlg 更新
            itemEditFlg.value = false;
        }
            
    }
    /**
     * 削除ボタンを押したときに、確認モーダルを表示させる。
     * @param id
     */
    function showDeleteModal(id: number){
        // 単一更新チェック 
        if(itemEditFlg.value){
            errorMsg.value = errMsgs.MSG_003;
            isErrFlg.value = true;
            return
        }
        deleteItemId = id - 1;
        modalTextDeleteItem = `ID: ${id}\nタスク内容: ${items.value[id - 1].content}`;
        isShowModalFlg.value = true;
    }
    /**
     * 削除確認モーダルのOKボタン押下時の処理
     * @param id
     */
    function onDeleteItem(){
        // 対象のitemをnewItemに更新
        items.value.splice(deleteItemId, 1);

        // ID割り振り直し
        items.value = items.value.map((item: any, index: number) => ({
            id: index + 1,
            content: item.content,
            limit: item.limit,
            state: item.state,
            onEdit: item.onEdit
        }));
        
        // ローカルストレージに上書き保存
        localStorage.setItem("items", JSON.stringify(items.value));

        // 初期化
        deleteItemId = 0;
        isShowModalFlg.value = false;
    }
    /**
     * 削除モーダルのCancelボタン押下時の処理
     */
    function onHideModal(){
        isShowModalFlg.value = false;
    }
</script>

<template>
<div class="display">
    <!-- エラーメッセージ -->
    <p class="error-text" v-show="isErrFlg">{{errorMsg}}</p>
    <!-- タスク内容一覧テーブル -->
    <table class="table">
        <tr class="header">
            <th class="th th-id">{{headerTextList[0]}}</th>
            <th class="th th-value">{{headerTextList[1]}}</th>
            <th class="th th-limit">{{headerTextList[2]}}</th>
            <th class="th th-state">{{headerTextList[3]}}</th>
            <th class="th-edit"></th>
            <th class="th-delete"></th>
        </tr>
        <tr class="tr" v-for="item in items" :key="items.id">
            <td class="td td-id">{{item.id}}</td>
            <td class="td td-content">
                <span v-if="!item.onEdit">{{item.content}}</span>
                <input class="content-input" v-else type="text" v-model="editCntent"></input>
            </td>
            <td class="td td-limit">
                <span v-if="!item.onEdit">{{item.limit}}</span>
                <input class="limit-input" v-else type="date" v-model="editLimit"></input>
            </td>
            <td class="td td-status">
                <span v-if="!item.onEdit">{{item.state.value}}</span>
                <select v-else v-model="editStatus">
                    <option 
                        v-for="state in statuses"
                        :value="state"
                        :key="state.id"
                        :selected="state.id == item.state.id"
                    >
                    {{ state.value }}
                    </option>
                </select>
            </td>
            <td class="td-edit-btn">
                <button v-if="!item.onEdit" @click="onEdit(item.id)">{{headerTextList[4]}}</button>
                <button v-else @click="onUpdate(item.id)">{{headerTextList[6]}}</button>
            </td>
            <td class="td-delete-btn"><button @click="showDeleteModal(item.id)">{{headerTextList[5]}}</button></td>
        </tr>
    </table>
</div>
<!-- 削除モーダル -->
<div class="modal" v-show="isShowModalFlg">
    <div class="modal-content">
        <div class="texts">
            <p>このタスクを削除してもよろしいですか？</p>
            <p>※削除されたタスクは元に戻すことはできません。</p>
            <p>{{modalTextDeleteItem}}</p>
        </div>
        <div class="btns">
            <button class="ok" @click="onDeleteItem()">OK</button>
            <button class="cancel" @click="onHideModal()">Cancel</button>
        </div>
    </div>
</div>
</template>

<style scoped>
    .display{
        width: 80vw;
        height: 47vh;
        margin-bottom: 3vh;
        color: #333;
    }
    .table{
        width: 100%;
        border-collapse: collapse;
    }
    .tr{
        width: 100%;
    }
    .th, .td{
        border: 1px solid black;
        border-collapse: collapse;
    }
    .th{
        background-color:mediumseagreen;
    }
    .td{
        padding: 5px;
    }
    

    .td-edit-btn,
    .td-delete-btn{
        width: 7%;
    }
    .td-edit-btn button,
    .td-delete-btn button{
        width: 90%;
        padding: 1%;
        margin: 5%;
        border: 1px solid black;
        border-radius: 10%;
        color: white;
        font-size: small;
    }
    .td-edit-btn button{
        background-color:mediumblue;
    }
    .td-delete-btn button{
        background-color: maroon;
    }

    .td-id{
        width: 4%;
        text-align: center;
    }
    .td-content{
        width: 52%;
    }
    .td-limit{
        width: 15%;
        text-align: center;
    }
    .td-status{
        width: 15%;
        text-align: center;
    }

    .content-input,
    .limit-input,
    .td select{
        width: 100%;
        color: black;
    }
    .limit-input,
    .td select{
        text-align: center;
    }

    .error-text{
        color: maroon;
        font-weight: 600;
    }

    .modal{
        position: fixed;
        width: 100vw;
        height: 100vh;
        background-color: #333;
        opacity: 0.95;
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .modal-content{
        width: 40%;
        height: 20%;
        opacity: 1;
        background-color: white;
        display: flex;
        flex-direction: column;
        justify-content: end;
        align-items: center;
    }
    .modal-content .texts{
        width: 80%;
        height: 70%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    .modal-content .btns{
        width: 80%;
        height: 30%;
        display: flex;
        justify-content: end;
        align-items: center;
    }
    .modal-content .btns button{
        width: 80px;
        height: 30px;
        font-size: small;
        border: 1px solid black;
        color: white;
        margin: 1%;
    }
    .modal-content .btns .cancel{
        background-color:#333;
    }
    .modal-content .btns .ok{
        background-color: maroon;
    }
</style>