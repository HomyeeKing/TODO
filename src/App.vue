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
       <input type="text" v-model="text" @keydown.enter="todoOp.add">
       <button @click="todoOp.add">add</button>
       <!-- <button @click="deleteMany">delete{{finished.length?`(${finished.length})`:''}}</button> -->
       <button @click="toggleSelect">toggle</button>
    </div>
    <ul style="list-style: none;" class="center-list">
            <li v-for="(todo,index) in todos" :key="todo.id" style="margin:10px;"> 
                <input type="checkbox" name="" class="checkbox" :id="`todo${todo.id}`"
                 @change="todoOp.finish(todo)"
                 :checked="todo.finish"
                 >   
                <label :for="`todo${todo.id}`" >
                   <span style="margin: 0 10px;" contenteditable :class="{finish:todo.finish}">{{todo.text}}</span>                 
                </label>
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
</style>