const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
console.log(c);
canvas.width = 1024;
canvas.height = 576;


const gravity = 0.5;

//PLATFORM IMAGE
const platformSRC = './images/platform.png';
const Platformimage = new Image();
Platformimage.src = platformSRC;
console.log(Platformimage);

const platformSmallImage = createImage('./images/platformSmallTall.png');

const jumpAudio = new Audio('./audio/jump.mp3');
jumpAudio.volume = 0.05;

const lostAudio = new Audio('./audio/lost.wav');
lostAudio.volume = 0.5;

const winAudio = new Audio('./audio/win.wav');
winAudio.volume = 0.8;


function createImage(imageSRC){
    const image = new Image();
    image.src = imageSRC;
    return image;
}

class Player{
    constructor(){
        this.position = {
            x:100,
            y:100
        };
        this.velocity = {
            x: 0,
            y: 0
        };
        this.width = 30;
        this.height = 30;
        this.speed = 5;
    }
    draw(){
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update(){
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        this.draw();

        if(this.position.y + this.velocity.y + this.height <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform{
    constructor({x, y, image}){
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw(){
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class GenericObject{
    constructor({x, y, image}){
        this.position = {
            x,
            y
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw(){
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

let player = new Player();

let platforms = [];

let GenericObjects = [new GenericObject({x: -1, y: -1, image: createImage('./images/background.png')}), new GenericObject({x:0, y:0, image: createImage('./images/hills.png')})];

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};    
    
let scrollOffset = 0;
let score = document.getElementById('points');

function init(){

    player = new Player();
    platforms = [
        new Platform({x: Platformimage.width*5 + 300 - 2 - platformSmallImage.width, y: 270, image: platformSmallImage}),
        new Platform({x: -1, y: 470, image: Platformimage}), 
        new Platform({x: Platformimage.width - 3, y: 470, image: Platformimage}), 
        new Platform({x: Platformimage.width*2 + 100, y: 470, image: Platformimage}),
        new Platform({x: Platformimage.width*3 + 300, y: 470, image: Platformimage}),
        new Platform({x: Platformimage.width*4 + 300 - 2, y: 470, image: Platformimage}),
        new Platform({x: Platformimage.width*5 + 650 - 2, y: 470, image: Platformimage}),
        new Platform({x: Platformimage.width*6 + 650 - 3, y: 470, image: Platformimage}),
    ];

    GenericObjects = [new GenericObject({x: -1, y: -1, image: createImage('./images/background.png')}), new GenericObject({x:0, y:0, image: createImage('./images/hills.png')})];

    scrollOffset = 0;
    score.innerText = scrollOffset;
}

init();

animate();

function animate(){
    // c.clearRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'white';
    c.fillRect(0,0,canvas.width, canvas.height);
    
    GenericObjects.forEach(genericObject => {
        genericObject.draw();
    })

    platforms.forEach(platform => {
        platform.draw();
    });
    player.update();
    if(keys.right.pressed && player.position.x < 400){
        player.velocity.x = player.speed;
    }
    else if((keys.left.pressed && player.position.x >= 100) || (keys.left.pressed && scrollOffset == 0 && player.position.x > 0)){
        player.velocity.x = -player.speed;
    }
    else{
        player.velocity.x = 0;
        if(keys.right.pressed){
            scrollOffset += player.speed;
            platforms.forEach(platform => {
                platform.position.x -= player.speed;
            });
            GenericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed*0.66;
            });
        } else if(keys.left.pressed && scrollOffset > 0){
            scrollOffset -= player.speed;
            platforms.forEach(platform => {
                platform.position.x += player.speed;
            });
            GenericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed*0.66;
            });
        }
    }


    //PLATFORM PLAYER COLLISION
    platforms.forEach(platform => {
        if((player.position.y + player.height <= platform.position.y) && (player.position.y + player.height + player.velocity.y >= platform.position.y)&&(player.position.x + player.width >= platform.position.x) && (player.position.x <= platform.position.x + platform.width)){
            player.velocity.y = 0;
        }
    });

    //LOSE CONDITION
    if(player.position.y > canvas.height) {
        lostAudio.play();
        init();
    }

    if(scrollOffset < Platformimage.width*6 + 650 - 3)
        score.innerText = `Points : ${Math.floor(scrollOffset/100)}`;
    //WIN CONDITION
    else{
        winAudio.play();
        // score.style.margin = '1rem 1rem 1rem 1rem';
        score.style.position = 'relative';
        score.innerText = "YOU WIN!";
    }


    requestAnimationFrame(animate);
}

addEventListener('keydown', ({keyCode}) => {
    // console.log(keyCode);

    switch(keyCode){
        case 87:
            jumpAudio.play();
            player.velocity.y -= 15;
            break;
        case 65:
            keys.left.pressed = true;
            break;
        case 68:
            // player.velocity.x += 1;
            keys.right.pressed = true;
            break;
        case 83: //DOWN
            console.log('DOWN');
            break;
    }
});


addEventListener('keyup', ({keyCode}) => {
    // console.log(keyCode);

    switch(keyCode){
        case 87: //UP
            // player.velocity.y -= 20;
            break;
        case 65: //LEFT
            // player.velocity.x = 0;
            keys.left.pressed = false;
            break;
        case 68: //RIGHT
            // player.velocity.x = 0;
            keys.right.pressed = false;
            break;
        case 83: //DOWN
            console.log('DOWN');
            break;
    };
});
