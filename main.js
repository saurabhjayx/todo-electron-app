const electron = require ('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow, addTodoWindow;

//Listen for app to be ready

app.on('ready',function(){
  //create new window
  mainWindow = new BrowserWindow({});
  //load html
  mainWindow.loadURL(url.format({
    pathname : path.join(__dirname,'main.html'),
    protocol : 'file:',
    slashes  : true
  }));

  //quit whole app on close

  mainWindow.on('closed',function(){
    app.quit();
  });

  //build menu from template
  const mainMenu = Menu.buildFromTemplate(menuTemplate);

  //Insert menu
  Menu.setApplicationMenu(mainMenu); 

});


//browser window for add todo

function addTodo(){
  //create new window
  addTodoWindow = new BrowserWindow({
    title:'Add Todo',
    width:300,
    height:200
  });
  //load add todo  html
  addTodoWindow.loadURL(url.format({
    pathname : path.join(__dirname,'addTodos.html'),
    protocol : 'file:',
    slashes  : true
  }));

  addTodoWindow.on('closed',function(){
    addTodoWindow = null;
  });

}

//catch data from add todo 

ipcMain.on('item:add', function(e, item){
  mainWindow.webContents.send('item:add', item);
  addTodoWindow.close();
});


//clear all Todo

function clearAllTodos(){
  mainWindow.webContents.send('item:clear');
}


// Our custom Menu template
const menuTemplate = [
  {
    label :'File',
    submenu:[
      {
        label: 'Add Todo',
        click(){
          addTodo();          
        }
      },
      {
        label: 'Clear All Todos',
        click(){
          clearAllTodos();
        }
      },
      {
        label :'Quit',
        accelerator: process.platform == 'darwin' ? 'Command+Q' : 'CTRL+Q',
        click(){
          app.quit();
        }
      }
    ] 
  }
];

//remove electron from menu on mac
if(process.platform == 'darwin'){
  menuTemplate.unshift({});
}