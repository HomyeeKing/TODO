<script lang='ts' setup>
import { reactive, ref, watch } from 'vue'

interface Todo{
    id:number;
    text:string;
    finish:boolean;
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
    console.log(val);
},{
    deep:true
})


const todoOp = {
    add(){
        if(text.value === '')return
        todos.push({text:text.value,id:todoStorage.id++,finish:false})
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
        
    },
    cancelEdit(todo:Todo){
        todo.text = prevTodo.value
    }
}





const toggleSelect = ()=>{
    const nodes = Array.from(document.querySelectorAll('.checkbox'))as any[]
    
    nodes.map(item=>item.checked = !item.checked)
}
</script>

<template>
<div>
    <div class="center">
       <input type="text" v-model="text" @keyup="todoOp.add">
       <button @click="todoOp.add">add</button>
       <!-- <button @click="deleteMany">delete{{finished.length?`(${finished.length})`:''}}</button> -->
       <button @click="toggleSelect">toggle</button>
    </div>
    <ul style="list-style: none;" class="center-list">
            <li v-for="(todo,index) in todos" :key="todo.id" style="margin:10px;"> 
                <input type="checkbox" name="" class="checkbox" 
                 @change="todoOp.finish(todo)"
                 :checked="todo.finish"
                 >   
                 <input 
                    class="edit"
                    contenteditable
                     :class="{finish:todo.finish}"
                    v-model="todo.text"
                    @keyup.enter="todoOp.doneEdit(todo)"
                    @blur="todoOp.doneEdit(todo)"
                    @keyup.esc="todoOp.cancelEdit(todo)"
                    />    
                <button @click="todoOp.remove(index)">❌</button>
                 
            </li>
       </ul>
</div>
   
</template>
<style>
.center{
    display: flex;
    justify-content: center;
}

.center-list{
    text-align: center;
}

.finish{
    text-decoration: line-through;
}

.edit{
    margin: 0 10px;
    border: none;
}
</style>