<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advanced Todo List</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-database.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js"></script>
</head>
<body>
    <div class="container">
        <h1>Advanced Todo List</h1>
        
        <div class="list-container">
            <div id="todo-list" class="dropzone">
                <div class="box-title">任务初建</div>
                <ul id="todo-tasks" class="task-list"></ul>
            </div>
            <div id="in-progress-list" class="dropzone">
                <div class="box-title">任务进行中</div>
                <ul id="in-progress-tasks" class="task-list"></ul>
            </div>
            <div id="completed-list" class="dropzone">
                <div class="box-title">任务完成</div>
                <ul id="completed-tasks" class="task-list"></ul>
            </div>
        </div>

        <div class="controls">
            <div class="input-container">
                <input id="todo-title-input" type="text" placeholder="任务标题">
                <textarea id="todo-content-input" placeholder="任务内容"></textarea>
            </div>
            <div class="button-container">
                <button id="high-priority-button" class="high-priority-button">高优先级</button>
                <button id="add-button">添加任务</button>
                <button id="select-all-button">全选</button>
                <button id="clear-selected-button">清除选定</button>
                <button id="delete-button" class="delete-button">删除</button>
            </div>
        </div>
    </div>

    <!-- Firebase 初始化 -->
    <script>
        const firebaseConfig = {
            apiKey: "AIzaSyDbVooTJqSk0uoFJnuS0kq8TyMWKXHeygE",
            authDomain: "nika-7a413.firebaseapp.com",
            projectId: "nika-7a413",
            storageBucket: "nika-7a413.appspot.com",
            messagingSenderId: "1011317445864",
            appId: "1:1011317445864:web:836ac64bfe7f4fb403655d"
        };

        firebase.initializeApp(firebaseConfig);
    </script>

    <script src="script.js"></script>
</body>
</html>
