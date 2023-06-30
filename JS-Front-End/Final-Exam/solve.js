// TODO:
function attachEvents() {
    const BASE_URL='http://localhost:3030/jsonstore/tasks/';
    const loadBtn=document.getElementById('load-board-btn');
    const addBtn=document.getElementById('create-task-btn');
    let titleInput= document.getElementById('title');
    let descriptionInput=document.getElementById('description');

    loadBtn.addEventListener('click', loadTasks);
    addBtn.addEventListener('click', addTask);

    const containers={
        todo: document.querySelector('#todo-section>ul'),
        progress: document.querySelector('#in-progress-section>ul'),
        review: document.querySelector('#code-review-section>ul'),
        done: document.querySelector('#done-section>ul'),
    }


    async function loadTasks(){
        // if(e){
        //     e.preventDefault();
        // }

        let res=await fetch(BASE_URL);
        let data=await res.json();

        Object.values(containers)
        .forEach((input) => {
            input.innerHTML = '';
        })

        for (const key in data) {
            let id=data[key]._id;
          let status=data[key].status;
          let title=data[key].title;
          let description=data[key].description;

          let li=createLocalElement('li','','',id,'class','task');
          createLocalElement('h3',title,li,);
          createLocalElement('p',description,li);
         
          if(status==='ToDo'){
            let todoBtn= createLocalElement('button','Move to In Progress',li);
            containers.todo.appendChild(li);
            todoBtn.addEventListener('click',moveToProgress);

          }
          else if( status==='In Progress'){
            let progressBtn = createLocalElement('button','Move to Code Review',li);
            progressBtn.addEventListener('click',moveToProgress);
            containers.progress.appendChild(li);
          }
          else if( status==='Code Review'){
            let progressBtn = createLocalElement('button','Move to Done',li);
            progressBtn.addEventListener('click',moveToProgress);
            containers.review.appendChild(li);
          }
          else if( status==='Done'){
            let deleteBtn = createLocalElement('button','Close',li);
            deleteBtn.addEventListener('click',deleteTaskFromData);
            containers.done.appendChild(li);
          }
        }
    }

    async function addTask(){
        if(titleInput.value===''||descriptionInput.value===''){
            return;
        }
       let obj={"title": titleInput.value,
       "description": descriptionInput.value,
       "status": "ToDo",}
       
       await fetch(BASE_URL,{
        method: 'POST',
        body: JSON.stringify(obj)
       })
       
       titleInput.value='';
       descriptionInput.value='';
       
       loadTasks();
    }

    async function moveToProgress(){
        let id=this.parentNode.id;
        let element=this.parentNode;
        let statusEl=element.querySelector('button');
        let status=statusEl.textContent;
        let title=element.querySelector('h3');
        let description=element.querySelector('p');
        let obj={};
        if(status==='Move to In Progress'){
            obj={"title": title.textContent,
            "description":description.textContent,
            "status": "In Progress"}
        }
        else if(status==='Move to Code Review'){
            obj={"title": title.textContent,
            "description":description.textContent,
            "status": "Code Review"}
        }
        else if(status==='Move to Done'){
            obj={"title": title.textContent,
            "description":description.textContent,
            "status": "Done"}
        }
        
        await fetch(`${BASE_URL}${id}`,{
            method: 'PATCH',
            body: JSON.stringify(obj)
           });

             
       loadTasks();
    }

    async function deleteTaskFromData(){
        let id=this.parentNode.id;
        await fetch(`${BASE_URL}${id}`,{
            method: 'DELETE',
           });
           loadTasks();
    }


    function createLocalElement(tag, content, parentNode, id, attribute, attributeValue) {
        const htmlElement = document.createElement(tag);

        if (content && tag !== 'input') {
            htmlElement.textContent = content;
        }

        if (content && tag === 'input') {
            htmlElement.value = content;
        }

        if (id) {
            htmlElement.id = id;
        }

        // { src: 'link', href: 'http' }
        if (attribute) {
            htmlElement.setAttribute(attribute, attributeValue)
        }

        if (parentNode) {
            parentNode.appendChild(htmlElement);
        }

        return htmlElement;
    }
}

attachEvents();