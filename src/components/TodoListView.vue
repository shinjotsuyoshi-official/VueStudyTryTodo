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
        items.value[id].onEdit = true;
        // もともとの値を代入する
        editCntent.value = items.value[id].content;
        editLimit.value = items.value[id].limit;
        editStatus.value = items.value[id].state;
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
            items.value.splice(id, 1, newItem);
            
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
        deleteItemId = id;
        modalTextDeleteItem = `ID: ${id}\nタスク内容: ${items.value[id].content}`;
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
            id: index,
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
    /**
     * タスクの削除処理
     * @param id
     */
    function onDelete(id: number){
        //未実装
    }
</script>

<template>
<div>
    <!-- エラーメッセージ -->
    <p v-show="isErrFlg">{{errorMsg}}</p>
    <!-- タスク内容一覧テーブル -->
    <table>
        <tr>
            <th class="th-id">{{headerTextList[0]}}</th>
            <th class="th-value">{{headerTextList[1]}}</th>
            <th class="th-limit">{{headerTextList[2]}}</th>
            <th class="th-state">{{headerTextList[3]}}</th>
            <th class="th-edit">{{headerTextList[4]}}</th>
            <th class="th-delete">{{headerTextList[5]}}</th>
        </tr>
        <tr v-for="item in items" :key="items.id">
            <td>{{item.id}}</td>
            <td>
                <span v-if="!item.onEdit">{{item.content}}</span>
                <input v-else type="text" v-model="editCntent"></input>
            </td>
            <td>
                <span v-if="!item.onEdit">{{item.limit}}</span>
                <input v-else type="date" v-model="editLimit"></input>
            </td>
            <td>
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
            <td>
                <button v-if="!item.onEdit" @click="onEdit(item.id)">{{headerTextList[4]}}</button>
                <button v-else @click="onUpdate(item.id)">{{headerTextList[6]}}</button>
            </td>
            <td><button @click="showDeleteModal(item.id)">{{headerTextList[5]}}</button></td>
        </tr>
    </table>
</div>
<!-- 削除モーダル -->
<div class="modal" v-show="isShowModalFlg">
    <div class="modal-content">
        <p>このタスクを削除してもよろしいですか？</p>
        <p>※削除されたタスクは元に戻すことはできません。</p>
        <p>{{modalTextDeleteItem}}</p>
        <button @click="onDeleteItem()">OK</button>
        <button @click="onHideModal()">Cancel</button>
    </div>
</div>
</template>

<style scoped></style>