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
        else
            this.velocity.y = 0;
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


const player = new Player();
const platforms = [new Platform({x: -1, y: 470, image: Platformimage}), new Platform({x: Platformimage.width - 3, y: 470, image: Platformimage})];

const GenericObjects = [new GenericObject({x: -1, y: -1, image: createImage('./images/background.png')}), new GenericObject({x:0, y:0, image: createImage('./images/hills.png')})];

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
};

let scrollOffset = 0;

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
        player.velocity.x = 5;
    }
    else if(keys.left.pressed && player.position.x >= 100){
        player.velocity.x = -5;
    }
    else{
        player.velocity.x = 0;
        if(keys.right.pressed){
            scrollOffset += 5;
            platforms.forEach(platform => {
                platform.position.x -= 5;
            });
            GenericObjects.forEach(genericObject => {
                genericObject.position.x -= 3;
            });
        } else if(keys.left.pressed){
            scrollOffset -= 5;
            platforms.forEach(platform => {
                platform.position.x += 5;
            });
            GenericObjects.forEach(genericObject => {
                genericObject.position.x += 3;
            });
        }
    }


    //PLATFORM PLAYER COLLISION
    platforms.forEach(platform => {
        if((player.position.y + player.height <= platform.position.y) && (player.position.y + player.height + player.velocity.y >= platform.position.y)&&(player.position.x + player.width >= platform.position.x) && (player.position.x <= platform.position.x + platform.width)){
            player.velocity.y = 0;
        }
    });

    if(scrollOffset >= 2000){
        console.log("YOU WIN");
    }

    requestAnimationFrame(animate);
}

addEventListener('keydown', ({keyCode}) => {
    // console.log(keyCode);

    switch(keyCode){
        case 87:
            player.velocity.y -= 20;
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
