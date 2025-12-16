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
<div class="display">
    <!-- 入力フォーム -->
    <form class="form" @submit="onSubmitForm()">
        <p class="error-text" v-show="isErrFlg">{{ isErrMsg }}</p>
        <div class="form-content">
            <label class="task-label"><span>{{todoTitle}}</span><input class="input" type="text" v-model="inputText"></label>
            <label class="date-label"><span>{{todoDate}}</span><input class="input" type="date" v-model="inputDate"></label>
            <div class="submit-btn-container">
                <input class="submit-btn" type="submit" v-bind:value="todoBtnTex">
            </div>
        </div>
    </form>
</div>
</template>


<style scoped> 
    .display{
        width: 80vw;
        height: 45vh;
        margin-bottom: 5vh;
        border-bottom: 1px solid black;
    }
    .form{
        width: 100%;
        height: 100%;
        padding-top: 10%;
        display: flex;
        flex-direction: column;
        justify-content:center;
    }
    .form-content{
        width: 100%;
        /* height: 100%; */
        display: flex;
        justify-content:flex-start;
        align-items: center;
    }
    label{
        height: 60px;
        margin: 1%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    label span{
        background-color:mediumseagreen;
    }
    .task-label{
        width: 40%;
    }
    .date-label{
        width: 20%;
    }
    .input{
        height: 25px;
        border: 1px solid black;
        margin: 1px;
        padding: 3px;
        border-radius: 5%;
    }
    .submit-btn-container{
        width: 10%;
        height: 60px;
        margin: 1%;
        display: flex;
        align-items: end;
    }
    .submit-btn{
        margin: 1%;
        width: 100%;
        height: 30px;
        border: 1px solid black;
        border-radius: 5%;
        background-color: lightgreen;
    }
    
    .error-text{
        padding-left: 1%;
        color: brown;
        font-weight: 600;
    }
</style>
