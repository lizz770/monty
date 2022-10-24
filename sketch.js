const doors=[] //массив дверей
let state="PICK"//отслеживание состояния выбора
let pickedDoor;
let revealedDoor;//открытая дверь
let switchButton, stayButton, playAgain;
let outcomeP;//сообщение о проигрыше или выигрыше

let resultsP;//результат

let totalSwitchPlays=0; //для общего кол-во игр
let totalStayPlays=0;//для общего кол-во переключений

let totalSwitchWins=0;
let totalStayWins=0;



//функция играть занаво
function startOver(){
    for (let door of doors){
        door.prize='🐐';
        door.html('');
        door.style('background-image','url(door1.png)')
    }
    const winner=random(doors);
    winner.prize='🚗';
    playAgain.hide();

    outcomeP.html('');
    state='PICK';
}

function setup(){
    noCanvas();
    for(let i=0;i<3;i++){
        doors[i]=createDiv("");
        doors[i].parent('#doors');
        //каждая дверь будет Div на веб странице
        doors[i].class('door');
        doors[i].index=i; 
        doors[i].mousePressed(pickDoor)//событие отвечающие за клик на дверь(вызов функции reveal)
    }
    switchButton=createButton('поменять')//поменять выбор(кнопка)
    switchButton.mousePressed(playerSwitch);
    switchButton.hide();

    stayButton =createButton('оставить')
    stayButton.mousePressed(playerStay);
    stayButton.hide();

    playAgain=createButton("играть снова")
    playAgain.mousePressed(startOver);
    playAgain.hide();

    resultsP = createP('');
    outcomeP =createP('');

    startOver();
}

function pickDoor(){
    if (state=='PICK'){
        state='REVEAL'
    pickedDoor=this;
    this.style('background-image','url(Activedoor.png)');//дверь которую мы открыли (подсветка)
    reveal();
    }
}

function reveal(){
    //после выбора открытие одной из двери
    const options=[];//массив
    for(let i=0;i<doors.length;i++){
        const door=doors[i];
        //пока это не та дверь которую выбрал игрок и не является призом машина
        //ее можно открыть
        if(i!=pickedDoor.index && door.prize !='🚗'){
            options.push(door);
        }
    }
    
    revealedDoor=random(options);
    revealedDoor.html(revealedDoor.prize);
    //показываем кнопки изменения
    switchButton.show();
    stayButton.show();
}
//переназначить выбранную дверь на дверь которая не была выбрана и не была открыта
 //функция о выборе
function playerSwitch(){
    totalSwitchPlays++;

    let newPick;
    for (let i=0;i<doors.length; i++){
        let door=doors[i];
        if (door!==pickedDoor& door!=revealedDoor){
            newPick=door;
            break;
        }
    }
    pickedDoor =newPick;
    //проверка выигрыша
    checkWin(true);
}

//увеличиваем общее кол-во игр
function playerStay(){
    totalStayPlays++;
    checkWin(false);
}


function checkWin(playerSwitch){

    switchButton.hide();
    stayButton.hide();
     //раскроем все двери
    for (let door of doors){
        door.html(door.prize)
        door.style('background-image','url(Activedoor.png)');
    }
    if (pickedDoor.prize=='🚗'){
        outcomeP.html("🎆Вы выйграли машину!🎆");
        outcomeP.style('color','green');
        outcomeP.style('text-align','center');
       

        pickedDoor.style('background-image','url(Activedoor.png)');

        if (playerSwitch){
            totalSwitchWins++;
        }else{
            totalStayWins++;
        }
    }
    else{
        outcomeP.html("Вы проиграли!")
        outcomeP.style('text-align','center');
        outcomeP.style('color','red');

        pickedDoor.style('background-color',"#FAA");

    }
     let switchRate = totalSwitchWins/totalSwitchPlays;
     let stayRate = totalStayWins/totalStayPlays;

     resultsP.html(
        `Всего изменить выбор: ${totalSwitchPlays}<br/>
    Победа при смене выбор: ${nf(100 * switchRate, 2, 2)} % <br/>
    Всего оставить выбор: ${totalStayPlays}<br/>
    Победа оставить выбор: ${nf(100 * stayRate, 2, 2)}% `
      );
    //кнопка играть снова
    playAgain.show();
    
}