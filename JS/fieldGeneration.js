//vertecke quitButton da er anfangs nicht benoetigt wird
document.getElementById("quitButton").style.display = "none"

const directions = {
    '1,1': [1, 1],   // bottom right
    '1,-1': [1, -1],  // right top
    '-1,1': [-1, 1],  // left bottom
    '-1,-1': [-1, -1],  // left top
    '1,0': [1, 0],    // right
    '-1,0': [-1, 0],  // left
    '0,1': [0, 1],    // bottom
    '0,-1': [0, -1]   // top
  };
const alternativeDirections = {
    '1,-1': [1, -1],  // right top
    '1,0': [1, 0],    // right
    '1,1': [1, 1],   // bottom right
    '0,1': [0, 1],    // bottom
    '-1,1': [-1, 1],  // left bottom
    '-1,0': [-1, 0],  // left
    '-1,-1': [-1, -1] , // left top
    '0,-1': [0, -1]   // top
  };


class Player{

    constructor(x, y) {
        this.posX = x
        this.posY = y
    }

    sprite = document.createElement("img")
    anzTurns = 0

    getX() {return this.posX}
    getY() {return this.posY}

    spawn(){
        this.sprite.setAttribute("src","img/Player.png")
        this.sprite.setAttribute("id", "playerImg")
        fieldArr[this.posX][this.posY].appendChild(this.sprite)
    }
    setTurns(turns){
        this.anzTurns = turns
    }
    advanceTurns(){
        return ++this.anzTurns
    }
    move(x,y){
        this.posX = x
        this.posY = y   
        this.spawn()
    }
    tryDirection(direction){

        if(this.posX + direction[0] > -1 && this.posX + direction[0] < 10 && this.posY + direction[1] > -1 && this.posY + direction[1] < 10){

            if(fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector(".obstacle")){
                return true
            } 
            else return false
            
        }
        else return true
    }  
}
class Enemy{

    sprite = document.createElement("img")

    constructor(posX, posY) {
        this.posX = posX
        this.posY = posY
    }

    getX() {return this.posX}
    getY() {return this.posY}



    move(x,y){
        this.posX = x
        this.posY = y   
        this.sprite.setAttribute("src","img/Enemy.png")
        this.sprite.setAttribute("id","enemy")
        fieldArr[this.posX][this.posY].firstChild.setAttribute("class", "EnemyWasThere")
        fieldArr[x][y].appendChild(this.sprite)
    }

    tryDirection(direction){

        if(this.posX + direction[0] > -1 && this.posX + direction[0] < 10 && this.posY + direction[1] > -1 && this.posY + direction[1] < 10){

            if(fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector(".obstacle") ||
               fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector(".EnemyWasThere")  ||
               fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector("#playerImg")){
                return true
            } 
            else return false 
        }
        else return true
    }

    catch(ally){


        if(this.getX() == ally.getX() && this.getY() == ally.getY()) return true
        
        var go = false

        //Berechnung der Richtung
        var dx = ally.getX() - this.posX
        var dy = ally.getY() - this.posY
        const directionX = Math.sign(dx);
        const directionY = Math.sign(dy);
        var direction = `${directionX},${directionY}`;

        var key = direction

        for(key in alternativeDirections){
            if(this.tryDirection(directions[direction])){
                
                direction = key
                go = false
            }
            else{
                go = true
                break
            }   
        } 
        if(go) this.move(this.posX + directions[direction][0], this.posY + directions[direction][1])
        else alert("Der Jaeger hat das Opfer verloren!\nHaette er nur mehr freie Sicht")
           
    }

}
class Ally{

    sprite = document.createElement("img")

    constructor(posX, posY) {
        this.posX = posX
        this.posY = posY
    }

    getX() {return this.posX}
    getY() {return this.posY}
    move(x,y){
        this.posX = x
        this.posY = y   
        this.sprite.setAttribute("src","img/Ally.png")
        this.sprite.setAttribute("id","ally")
        fieldArr[this.posX][this.posY].firstChild.setAttribute("class", "AllyWasThere")
        fieldArr[x][y].appendChild(this.sprite)
    }
    tryDirection(direction){
        if(this.posX + direction[0] > -1 && this.posX + direction[0] < 10 && this.posY + direction[1] > -1 && this.posY + direction[1] < 10){
            if(fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector(".obstacle") || 
               fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector(".AllyWasThere") || 
               fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector("#playerImg") || 
               fieldArr[this.posX + direction[0]][this.posY + direction[1]].querySelector("#enemy")){
                return true
            } 
            else return false
        }
        else return true
    }
    flee(enemy){

        if(this.getX() == enemy.getX() && this.getY() == enemy.getY()) return true

        var go = false

        //Berechne Richtung
        var dx = this.posX - enemy.getX()
        var dy = this.posY - enemy.getY()
        const directionX = Math.sign(dx);
        const directionY = Math.sign(dy);
        var direction = `${directionX},${directionY}`;

        var key = direction

        for(key in alternativeDirections){
            if(this.tryDirection(directions[direction])){
                
                direction = key
                go = false
            }
            else{
                go = true
                break  
            }   
        }
        if(go) this.move(this.posX + directions[direction][0], this.posY + directions[direction][1])
    }
}

//Globales 2D Array um von ueberall darauf zugreifen zu koennen
var fieldArr = new Array(10);
    for (let i = 0; i < fieldArr.length; i++) 
    {
        fieldArr[i] = new Array(10);
    }


function generateMap(){
    
    //Ueberpruefe fehlerhafte Eingabe der Hindernisse
    if(document.getElementById("name").value == 0){
        alert("Please enter our name")
        return false
    }
    var anzSteine = Number(document.getElementById("anzS").value)
    if(anzSteine < 0 || anzSteine > 40) return 0

    var anzBaum = Number(document.getElementById("anzB").value)
    if(anzBaum < 0 || anzBaum > 40) return 0

    

    var gameMap = document.createElement("div")
    gameMap.setAttribute("id", "gameMap")

    //Fuellen des Arrays mit leeren Feldern
    for(let i = 0; i < 10; i++){

        for(let j = 0; j < 10; j++){
            var cell = document.createElement("div")
            cell.setAttribute("id", i+" "+j)
            fieldArr[i][j] = cell
            gameMap.appendChild(cell)  
        }
    }

    //Fuelle leere Felder mit Sprites
    generateImg(anzSteine, anzBaum)

    document.getElementById("gameMapContainer").appendChild(gameMap)


    //Update UI nach click
    document.getElementById("startButton").style.display = "none"
    document.getElementById("quitButton").style.display = "inline-block"
    document.getElementById("nameField").innerHTML = document.getElementById("name").value


    //UI fuer debug checkbox
    var checkBDiv = document.createElement("div")
    var debugCheckbox = document.createElement("input")
    var debText = document.createTextNode("Debug Mode")
    debugCheckbox.setAttribute("id", "debug")
    debugCheckbox.setAttribute("type", "checkbox")
    debugCheckbox.setAttribute("value", "false")
    checkBDiv.appendChild(debText)
    checkBDiv.appendChild(debugCheckbox)
    document.getElementById("gameMapContainer").appendChild(checkBDiv)


    //Starte Spiel mit Timer
    startTurn(spawnPlayer(), spawnEnemy(), spawnAlly())
    
}
function generateImg(anzSteine, anzBaum)
{
    //3 verschiedene Sprites fuer begehbare Felder
    var picsFlat = ["img/43_Water+.png", "img/55_Water+.png", "img/56_Water+.png"]

    var anzFelder = (10*10)-(anzSteine+anzBaum)

    //Solange es freie Felder gibt wird ein zufaelliges Feld ausgewaehlt und gefuellt
    while(anzFelder)
    {
        var randomX = Math.floor(Math.random() * 10);
        var randomY = Math.floor(Math.random() * 10);

        //Pruefe ob genau dieses Feld bereits ein img (child) besitzt
        if(!fieldArr[randomX][randomY].firstChild)
        {
            var img = document.createElement("img")
            
            if(anzSteine != 0)
            {
                
                img.setAttribute("src", "img/46_Water+.png")
                img.setAttribute("class", "obstacle")
                fieldArr[randomX][randomY].appendChild(img)
                anzSteine--
        
            }
            else if(anzBaum != 0) 
            {
                img.setAttribute("src", "img/47_Water+.png")
                img.setAttribute("class", "obstacle")
                fieldArr[randomX][randomY].appendChild(img)
                anzBaum--
            }
            else
            {
                var picRandom = Math.floor(Math.random() * 3);
                img.setAttribute("src", picsFlat[picRandom])
                img.setAttribute("class", "flat")
                fieldArr[randomX][randomY].appendChild(img)                   
                anzFelder--
            }

            //img nimmt parent id (und damit position im Array) an
            img.setAttribute("id", img.parentElement.id)
        }
    }
}
function spawnPlayer(){
    
    var randomX = Math.floor(Math.random() * 10);
    var randomY = Math.floor(Math.random() * 10);

    var fieldCell = fieldArr[randomX][randomY].querySelector(".obstacle");


    //Solange im loop gefangen bis ein freies Feld gefunden wird
    while(fieldCell){

        randomX = Math.floor(Math.random() * 10);
        randomY = Math.floor(Math.random() * 10);

        fieldCell = fieldArr[randomX][randomY].querySelector(".obstacle");
    } 

    var player = new Player(randomX, randomY)
    player.move(randomX, randomY)
    return player
    
}
function spawnEnemy(){
    
    var randomX = Math.floor(Math.random() * 10);
    var randomY = Math.floor(Math.random() * 10);

    var fieldCell = fieldArr[randomX][randomY].querySelector(".obstacle");

    //Solange im loop gefangen bis ein freies Feld gefunden wird
    while(fieldCell){

        randomX = Math.floor(Math.random() * 10);
        randomY = Math.floor(Math.random() * 10);

        fieldCell = fieldArr[randomX][randomY].querySelector(".obstacle");
    }
        var enemy = new Enemy(randomX, randomY)
        enemy.move(randomX, randomY)
        return enemy
    
}
function spawnAlly(){
    
    var randomX = Math.floor(Math.random() * 10);
    var randomY = Math.floor(Math.random() * 10);

    var fieldCell = fieldArr[randomX][randomY].querySelector(".obstacle");

    //Solange im loop gefangen bis ein freies Feld gefunden wird
    while(fieldCell){

        randomX = Math.floor(Math.random() * 10);
        randomY = Math.floor(Math.random() * 10);

        fieldCell = fieldArr[randomX][randomY].querySelector(".obstacle");
    } 
    
    var ally = new Ally(randomX, randomY)
    ally.move(randomX, randomY)
    return ally
    
}

