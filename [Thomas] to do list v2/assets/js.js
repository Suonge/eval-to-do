
// DECLARATION DES VARIABLES ET LIAISONS DOCUMENT
var bouton = document.querySelector("button");
var textarea = document.querySelectorAll("textarea");
var todo = document.querySelector(".todo");
var done = document.querySelector(".done");
var valider = document.querySelector(".valider");
var div2 = document.querySelectorAll("div");
var couleur = document.querySelector("input");

var liste = [];


// RECUPERATION DES COOKIES DANS LE LOCALSTORAGE !!!
var recup = localStorage.getItem("memo");
transformRecup = JSON.parse(recup);

// VERIFICARION QUE LES COOKIES NE SONT PAS NUL 
if (transformRecup != null){
    liste = transformRecup;
// AFFICHAGE DES ANCIENS MEMO !!!!!!! ----------------------
    for (i = 0; i < liste.length; i++){
        let creation = creationNote();
    
        // ATTRIBUTION DES VALEURS DES MEMOS
        creation["titre"].textContent = liste[i]["nom"];
        creation["contient"].textContent = liste[i]["contenue"];
        creation["div"].id = liste[i]["id"];
        creation["div"].draggable = true;
        creation["div"].setAttribute('ondragstart', 'drag(event)');
        creation["div"].classList.add(liste[i]["tab"]);
        creation["div"].style.backgroundColor = liste[i]["couleur"];
        creation["dateH"].textContent = liste[i]["date"];
    
        // DISTRIBUTION DES MEMOS SELON LEUR SECTIONS
        if (liste[i]["tab"] == 1){
            todo.append(creation["div"]);
        } else if (liste[i]["tab"] == 2){
            done.append(creation["div"]);
        } else if (liste[i]["tab"] == 3){
            valider.append(creation["div"]);
        }
    
        // AFFICHAGE DU MEMO
        appendNote(creation["div"],creation["titre"],creation["contient"],creation["dateH"]);
    }
}

// BOUTON DE CREATION DE MEMO
bouton.addEventListener("click",function(){
    // CREATION DES ELEMENTS
    let creation = creationNote();
    
    // ATTRIBUTION DES VALEURS
    creation["titre"].textContent = textarea[0].value;
    creation["contient"].textContent = textarea[1].value;

    let numberDiv = document.querySelectorAll("div");
    creation["div"].id = numberDiv.length;
    creation["div"].draggable = true;
    creation["div"].setAttribute('ondragstart', 'drag(event)');
    creation["div"].classList.add("tab1");
    creation["div"].style.backgroundColor = couleur.value;

    // CREATION DE LA DATE ET DE L'HEURE ---------
    let cejour = new Date();
    let options = {weekday: "long", year: "numeric", month: "long", day: "2-digit"};
    let date = cejour.toLocaleDateString("fr-FR", options);
    let heure = ("0" + cejour.getHours()).slice(-2) + ":" + ("0" + cejour.getMinutes()).slice(-2);
    let dateheure = date + ", " + heure;
    creation["dateH"].textContent = dateheure;

    // AFFICHAGE DU MEMO
    todo.append(creation["div"]);
    appendNote(creation["div"],creation["titre"],creation["contient"],creation["dateH"]);

    // SAUVEGARDE DU MEMO DANS LA LISTE POUR LES COOKIES
    let memo = {"nom":textarea[0].value,"contenue":textarea[1].value,"tab":1,"id":div.id,"couleur":couleur.value,"date":dateheure};
    liste.push(memo);

    // VIDAGE DES CHAMPS
    textarea[0].value = null;
    textarea[1].value = null;

    sauvegarde(liste);
});


// FONCTIONNEMENT DU DRAG AND DROP
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    
    // PASSAGE DANS LA CATEGORIE TO DO !!!
    if (ev.target.parentElement.parentElement.id == "todo" || ev.target.parentElement.id == "todo" || ev.target.id == "todo"){
        let data = ev.dataTransfer.getData("text");
        affectationTAB("todo","tab1","tab2","tab3",1, data);
    }

    // PASSAGE DANS LA CATEGORIE DONE !!!
    if (ev.target.parentElement.parentElement.id == "done" || ev.target.parentElement.id == "done" || ev.target.id == "done"){
        let data = ev.dataTransfer.getData("text");
        affectationTAB("done","tab2","tab1","tab3",2, data);
    }

    // PASSAGE DANS LA CATEGORIE VALIDER !!!
    if (ev.target.parentElement.parentElement.id == "valider" || ev.target.parentElement.id == "valider" || ev.target.id == "valider"){
        let data = ev.dataTransfer.getData("text");
        affectationTAB("valider","tab3","tab1","tab2",3, data);
    }

    // SUPPRESSION DU MEMO
    if (ev.target.parentElement.id == "poubelle" || ev.target.id == "poubelle"){
        var data = ev.dataTransfer.getData("text");
        let test = document.getElementById(data);

        // SELECTION DU MEMO A SUPPRIMER
        for (i = 0; i < liste.length; i++){
            if (liste[i]["id"] == test.id){
                liste.splice(i,1);
            };
            
        }
        // REATRIBUTION DES ID POUR LES AUTRES MEMOS
        for (i = 0; i < liste.length; i++){
            if (liste[i]["id"] > test.id){
                liste[i]["id"] = `${liste[i]["id"]-1}`;
            }
        }
        // SUPPRESSION ET SAUVEGARDE DE LA MODIF DANS LE LOCAL STORAGE
        test.remove();
        sauvegarde(liste);
    }
    
}

// CHANGEMENT DE CATEGORIE DANS LE LOCALE STORAGE !!!
function changementTab(div, tab){
    liste.forEach((element) => {
        if (element["id"] == div.id){
            element["tab"] = tab;
        };
    });
    let myJson = JSON.stringify(liste);
    localStorage.setItem("memo", myJson);
    console.log(liste);
};

// AFFECTION DU TAB LORS DU DROP
function affectationTAB(colone,bValeur,mValeur1,mValeur2,tab,data){
    let valider = document.querySelector(`#${colone}`);
    valider.appendChild(document.getElementById(data));
    let div = (document.getElementById(data));
    div.classList.add(`${bValeur}`);
    div.classList.remove(`${mValeur1}`,`${mValeur2}`);
    changementTab(div, tab);
};

// STOCKAGE DU MEMO DANS LE LOCALE STORAGE SOUS FORME DE STRING
function sauvegarde(liste){
    let myJson = JSON.stringify(liste);
    localStorage.setItem("memo", myJson);
};

// CREATION DES ELEMENTS DES MEMOS
function creationNote(){
    let div = document.createElement("div");
    let titre = document.createElement("h3");
    let contient = document.createElement("p");
    let dateH = document.createElement("p");
    let tableau = {"div":div,"titre":titre,"contient":contient,"dateH":dateH};
    return tableau;
};

// APPEND DES ELEMENTS
function appendNote(div,titre,contient,dateH){
    div.append(titre);
    div.append(contient);
    div.append(dateH);
}