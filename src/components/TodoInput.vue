<script setup lang="ts">
    import {statuses} from '../const/statuses';
    // import { validate } from '../const/validate';
    import { validate } from '@/const/validate';
    import { ref, type Ref } from 'vue';
    import { errMsgs } from '@/const/errorMessage';
    const todoTitle: string = "タスク内容";
    const todoDate: string = "期限";
    const todoBtnTex: string = "登録";
    const inputText: Ref<string | string> = ref("");
    const inputDate: Ref<string | string> = ref("");
    const isErrMsg: Ref<string | string> = ref("");
    const isErrFlg: Ref<boolean | boolean> = ref(false);


    /**
     * 登録ボタンをクリックしたときの処理
     */
    function onSubmitForm(){
        // ValidateCheck
        if(!validate.checkInputValidation(inputText.value.toString(), inputDate.value.toString())){
            isErrFlg.value = true;
            isErrMsg.value = errMsgs.MSG_001;
            event?.preventDefault();
            return;
        }

        // ローカルストレージから取得し、JSON形式にして保管。
        let storageData = localStorage.getItem("items");
        const items = JSON.parse(storageData!) || [];

        // 入力した内容を「newItem」としてJSON形式で取得
        const  newItem = {
            id: items.length + 1,
            content: inputText.value,
            limit: inputDate.value,
            state: statuses.NOT_START,
            onEdit: false,
        }
        items.push(newItem);

        // ローカルストレージに保存
        localStorage.setItem("items", JSON.stringify(items));
    }
</script>
<template>
<div>
    <!-- 入力フォーム -->
    <p v-show="isErrFlg">{{ isErrMsg }}</p>
    <form @submit="onSubmitForm()">
        <label>{{todoTitle}}<input type="text" v-model="inputText"></label>
        <label>{{todoDate}}<input type="date" v-model="inputDate"></label>
        <input type="submit" v-bind:value="todoBtnTex">
    </form>
</div>
</template>


<style scoped></style>
