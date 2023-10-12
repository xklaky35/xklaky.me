function startTurn(player, enemy, ally)
{
    var seconds = new Date().getTime()
    var minutes = 0

    player.setTurns(0)

    //Verarbeiten des clicks auf ein Feld
    window.onclick = click => {
        switch(click.target.id){
                
            case click.target.id.match(/ /)?.input:
                //Umwandeln der ID in Array Koordinaten
                var clickedCell = click.target.id.split(" ")
                break;  

            //Extra cases fuer ally und enemy da dessen ID nicht keine Koordinaten sind
            case "ally": 
                var clickedCell = [ally.getX(), ally.getY()]
                break;

            case "enemy":
                var clickedCell = [enemy.getX(), enemy.getY()]
                break;

            default:
                return 0
        }

        clickedX = parseInt(clickedCell[0])
        clickedY = parseInt(clickedCell[1])

        //Start eines Zuges
        if(playerTurn(player, clickedX, clickedY)){
            
            //Spieler Gewinnt
            if(fieldArr[player.getX()][player.getY()].querySelector("#enemy") || fieldArr[player.getX()][player.getY()].querySelector("#ally")){
                document.getElementById("EndScreen").innerHTML = "You Won"
                gameEnd()
                clearInterval(gameLoop)
                return true
            }
            //Zug 500ms nach Spieler
            setTimeout(function() {

                //Spieler verliert
                if(enemy.catch(ally)){
                    document.getElementById("EndScreen").innerHTML = "You Lost"
                    gameEnd()
                    clearInterval(gameLoop)
                    return true
                }

                //Spieler verliert
                if(ally.flee(enemy)){
                    document.getElementById("EndScreen").innerHTML = "You Lost"
                    gameEnd()
                    clearInterval(gameLoop)
                    return true
                }        
            }, 500);
    }
}
    //Update game time und check ob Debug Mode aktiviert ist
    var gameLoop = setInterval(function() {
        
        if(updateTimer(seconds) == 60){
            document.getElementById("minutes").innerHTML = ++minutes;      
            seconds = new Date().getTime()
        }
        displayDebugMode(player)
    }, 1); 
}
function updateTimer(seconds)
{
    var now = new Date().getTime();
    var time = Math.floor((now - seconds) / 1000);

    document.getElementById("seconds").innerHTML = time;          
    
    return time  
}
function displayDebugMode(player)
{
    if(document.getElementById("debug").checked)
    {
        //Durchlaufen und ueberpruefund jedes Umliegendes Feldes + markieren mit CSS
        for (var dir in directions){
            if(!player.tryDirection(directions[dir])){
                
                fieldArr[player.getX() + directions[dir][0]][player.getY() + directions[dir][1]].setAttribute("class", "debug")    
            }
        }

    }else{
        //Deaktivieren wenn checkbox unchecked
        for (var dir in directions){
            if(!player.tryDirection(directions[dir])){
                
                fieldArr[player.getX() + directions[dir][0]][player.getY() + directions[dir][1]].classList.remove("debug")
            }
        }
    }
}
function playerTurn(player , newX, newY){

    document.getElementById("debug").checked = true
    displayDebugMode(player)

    if(fieldArr[newX][newY].classList == "debug"){
        document.getElementById("debug").checked = false
        displayDebugMode(player)
        player.move(newX,newY)
        document.getElementById("turns").innerHTML = player.advanceTurns()
        return true

    }else{
        alert("Please select a reachable field")
        player.spawn()
        return false
    }
}
//End screen (Popup) controller
var modal = document.getElementById("gameEnd");
function gameEnd(){
    modal.style.display = "block";
}
function checkPw(){

    if(document.getElementById("uname").value == "max" &&
       document.getElementById("psw").value == "mustermann"){

            let download = document.createElement("a")
            download.setAttribute("href", "Download/Kaufmann_Leon.zip")
            download.setAttribute("download", "Kaufmann_Leon.zip")
            download.innerHTML = "Get files here"
            document.getElementById("pswPop").appendChild(download)
       }
    else{
        alert("Falsche Eingabe")
    }
}
