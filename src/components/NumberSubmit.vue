<template>
    <input v-model="number" type="number" class="input" />
    <button @tap="addNumber">Add new number</button>
    <button @tap="jumpTodolist">jump todolist</button>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import Taro from '@tarojs/taro'
export default {
    setup() {
        const store = useStore()
        const number = ref(0)

        function addNumber() {
            store.dispatch('addNumber', Number(number.value) + 10)
        }
        function jumpTodolist() {
            Taro.navigateTo({
                url: '/pages/todolist/index',
            })
        }

        return {
            number,
            addNumber,
            jumpTodolist,
        }
    },
}
</script>

<style>
.input {
    border: 1px solid lightgray;
    margin: 10px;
}
</style>
