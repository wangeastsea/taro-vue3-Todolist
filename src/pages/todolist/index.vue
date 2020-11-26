<template>
    <view class="container">
        <view class="header">
            <view class="header-title-wrap">
                <text class="title">todos</text>
            </view>
            <view class="filters">
                <text
                    @tap="setVisibility('all')"
                    :class="{
                        selected: visibility == 'all',
                        'filters-link': true,
                    }"
                    >All</text
                >
                <text
                    @tap="setVisibility('active')"
                    :class="{
                        selected: visibility == 'active',
                        'filters-link': true,
                    }"
                    >Active</text
                >
                <text
                    @tap="setVisibility('completed')"
                    :class="{
                        selected: visibility == 'completed',
                        'filters-link': true,
                    }"
                    >Completed</text
                >
            </view>
            <view class="textinput-wrap">
                <text
                    :class="{
                        'textinput-wrap-icon': true,
                        'icon-all-done': allDone && todos.length,
                    }"
                    @tap="allDone = !allDone"
                    >❯</text
                >
                <view class="textinput-wrap-input">
                    <input
                        class="new-todo"
                        placeholder="What needs to be done?"
                        v-model="newTodo"
                        @confirm="addTodo"
                    />
                </view>
            </view>
        </view>
        <view class="main" v-show="todos.length">
            <view class="todo-list">
                <view v-for="todo in filteredTodos" class="li" :key="todo.id">
                    <view
                        :class="{
                            completed: todo.completed,
                            editing: todo == editedTodo,
                        }"
                    >
                        <view class="edit" v-if="todo == editedTodo">
                            <input
                                class="edit-todo"
                                type="text"
                                v-model="todo.title"
                                v-todo-focus="todo == editedTodo"
                                @blur="doneEdit(todo)"
                                @confirm="doneEdit(todo)"
                            />
                        </view>
                        <view v-else class="toggle">
                            <text
                                :class="{
                                    label: true,
                                    checked: todo.completed,
                                }"
                                @tap="todo.completed = !todo.completed"
                            >
                            </text>
                            <todo-item :todo="todo" :edit="editTodo" />
                            <text
                                class="destroy"
                                @tap="removeTodo(todo)"
                            ></text>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        <view class="footer" v-show="todos.length">
            <text class="todo-count">
                <text class="strong">{{ remaining }}</text>
                {{ remaining }} left
            </text>
            <view
                class="clear-completed"
                @tap="removeCompleted"
                v-show="todos.length > remaining"
                type=""
            >
                Clear completed
            </view>
        </view>
        <view class="info">
            <view class="p">Double-click to edit a todo</view>
            <view class="p">Part of <text class="a">TodoMVC</text></view>
        </view>
    </view>
</template>
<script>
import { createApp, reactive, computed, toRefs, watch } from 'vue'
import Taro from '@tarojs/taro'
import './todolist.scss'
import TodoItem from './todo-item.vue'
export default {
    components: {
        'todo-item': TodoItem,
    },
    filters: {
        pluralize: function (n) {
            return n === 1 ? 'item' : 'items'
        },
    },
    directives: {
        'todo-focus': function (el, binding) {
            if (binding.value) {
                el.focus()
            }
        },
    },
    setup() {
        let STORAGE_KEY = 'todos-vuejs-3.0'
        const todoStorage = {
            fetch: function () {
                let todos = JSON.parse(Taro.getStorageSync(STORAGE_KEY) || '[]')
                todos.forEach(function (todo, index) {
                    todo.id = index
                })
                todoStorage.uid = todos.length
                return todos
            },
            save: function (todos) {
                Taro.setStorage(STORAGE_KEY, JSON.stringify(todos))
            },
        }
        let filters = {
            all: function (todos) {
                return todos
            },
            active: function (todos) {
                return todos.filter(function (todo) {
                    return !todo.completed
                })
            },
            completed: function (todos) {
                return todos.filter(function (todo) {
                    return todo.completed
                })
            },
        }
        // 基础的响应数据
        const state = reactive({
            todos: todoStorage.fetch(),
            newTodo: '',
            editedTodo: null,
            visibility: 'all',
            beforeEditCache: '',
        })
        function setVisibility(v) {
            this.visibility = v
        }
        // 添加
        function addTodo() {
            let value = state.newTodo && state.newTodo.trim()
            if (!value) {
                return
            }
            state.newTodo = ''
            state.todos.push({
                id: todoStorage.uid++,
                title: value,
                completed: false,
            })
            console.log('state.todos', state.todos)
            console.log('state.newTodo', state.newTodo)
        }
        // 删除
        function removeTodo(todo) {
            state.todos.splice(state.todos.indexOf(todo), 1)
        }
        // 编辑
        function editTodo(todo) {
            state.beforeEditCache = todo.title
            state.editedTodo = todo
        }
        // TODO 保存编辑
        function doneEdit(todo) {
            if (!state.editedTodo) {
                return
            }
            state.editedTodo = null
            todo.title = todo.title.trim()
            if (!todo.title) {
                removeTodo(todo)
            }
        }
        // 取消编辑
        function cancelEdit(todo) {
            state.editedTodo = null
            todo.title = state.beforeEditCache
        }
        // 移除已完成的任务
        function removeCompleted() {
            state.todos = filter.active(state.todos)
        }

        const filteredTodos = computed(() => {
            return filters[state.visibility](state.todos)
        })
        //  激活的数量
        let remaining = computed(() => {
            return filters.active(state.todos).length
        })

        let allDone = computed({
            get() {
                return remaining.value === 0
            },
            set(value) {
                state.todos.forEach(function (todo) {
                    todo.completed = value
                })
            },
        })
        return {
            ...toRefs(state),
            addTodo,
            removeTodo,
            editTodo,
            doneEdit,
            cancelEdit,
            removeCompleted,
            filteredTodos,
            remaining,
            allDone,
            setVisibility,
        }
    },
}
</script>
