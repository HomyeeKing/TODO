<script lang='ts' setup>
import { reactive, ref, watch } from 'vue'
import Head from './Head.vue'
import { formatDate } from './utils'


interface Todo{
    id:number;
    text:string;
    finish:boolean;
    timestamp:number;
}

const KEY = 'HOMY_TODO'
const todoStorage = {
    id:1,
    save(todos:Todo[]){
        localStorage.setItem(KEY,JSON.stringify(todos))
    },
    fetchTodo(){
        return JSON.parse(localStorage.getItem(KEY) ?? '[]')
    }
}
const text = ref('')
const todos = reactive<Todo[]>(todoStorage.fetchTodo())
const finished = reactive<Todo[]>([])
const editTodo = ref()
const prevTodo = ref()


watch(todos,(val)=>{
    todoStorage.save(val)
},{
    deep:true
})


const todoOp = {
    add(){
        if(text.value === '')return
        todos.push({text:text.value,id:todoStorage.id++,finish:false,timestamp:Date.now()})
         text.value = ''
    },
    remove(index:number){
        todos.splice(index,1)
    },
    finish(todo:Todo){
        finished.push(todo)
        todo.finish = !todo.finish
    },
    startEdit(todo:Todo){
       
        editTodo.value = todo
        prevTodo.value = todo.text
    },
    doneEdit(todo:Todo){
        if(!editTodo.value)return
       
        editTodo.value = null
        
    },
    cancelEdit(todo:Todo){
        todo.text = prevTodo.value
    }
}



const showCreateTime = (todo:Todo)=>{
    prevTodo.value = todo.text
    console.log(prevTodo.value);
    todo.text = formatDate(todo.timestamp)

}

const toggleSelect = ()=>{
    const nodes = Array.from(document.querySelectorAll('.checkbox'))as any[]
    
    nodes.map(item=>item.checked = !item.checked)
}
</script>

<template>
<div>
    <Head></Head>
    <div class="center">
       <input type="text" v-model="text" @keyup.enter="todoOp.add" class="todo-input">
       <button @click="todoOp.add" style="width:100px;">ADD</button>
       <!-- <button @click="deleteMany">delete{{finished.length?`(${finished.length})`:''}}</button> -->
       <!-- <button @click="toggleSelect">toggle</button> -->
    </div>
    <ul  class="center-list">
            <li
             v-for="(todo,index) in todos" 
            :key="todo.id" style="margin:10px; 
            display: flex; align-items: center;"
            > 
                <input type="checkbox" name="" class="checkbox" 
                 @change="todoOp.finish(todo)"
                 :checked="todo.finish"
                 >   
                 <input 
                    class="edit-input"
                    :class="{finish:todo.finish}"
                    v-model="todo.text"
                    @keyup.enter="todoOp.doneEdit(todo)"
                    @focus="todoOp.startEdit(todo)"
                    @blur="todoOp.doneEdit(todo)"
                    @keyup.esc="todoOp.cancelEdit(todo)"
                    />    
                <span @click="todoOp.remove(index)">❌</span>
                <span style="margin-left:20px"
                 @mouseenter="showCreateTime(todo)"
                 @mouseleave="todo.text = prevTodo"
                 @touchstart="showCreateTime(todo)"
                 @touchend="todo.text = prevTodo"
                 >⏲</span>
                 
            </li>
       </ul>
</div>
   
</template>
<style>
*{
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    font-family: Georgia, 'Times New Roman', Times, serif;
}

.center{
    display: flex;
    justify-content: center;
}

.todo-input{
    width: 100%;
    height: 50px;
    font-size: 30px;
    padding: 10px;
}
.center-list{
    text-align: center;
    list-style: none;
    height: 600px;
    overflow-y: scroll;
}

.finish{
    text-decoration: line-through;
}

.edit-input{
    margin: 0 10px;
    border: none;
    width: 80%;
    height: 30px;
    font-size: 20px;
}
.edit-input:focus{
    user-select: none;
}
</style>