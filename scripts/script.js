const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

class Rectangle {
    constructor(w, h, x, y){
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
    }

    drawRect(){
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

const body = document.querySelector('body');

// Animation 1 - Circle
const circle = {
    x: canvas.width/2,
    y: canvas.height/2,
    size: 10,
    dx: 1.5,
    dy: 1.5,
}

//Animation 2 - Player 
const player = new Rectangle(100, 25, canvas.width / 2 - 50, canvas.height - 50);

const mouse = {
    x: canvas.width / 2 - 50,
    offsetX: (body.clientWidth / 2 - canvas.width / 2) + 50
}

const bricks = [[], [], [], [], []];

for (let i = 0; i < 5; i++){
    for(let j = 0; j < 10; j++){
        bricks[i][j] = (new Rectangle(90, 25, ((j * 100) + 5), ((i * 40) + 10)));
    }
};

canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x;
})

player.drawRect();

function drawCircle(){
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    player.x = mouse.x - mouse.offsetX;
    player.drawRect();
    
    for (let i = 0; i < bricks.length; i++){
        for (let j = 0; j < bricks[i].length; j++){
            bricks[i][j].drawRect(); 
        }
    }
    

    drawCircle();

   

        // detect collision with boundary
        // the circle is literally being drawn at a new position each frame. When that position "hits" the sides it'll bounce back
    if((circle.x + circle.size) > canvas.width || (circle.x - circle.size) < 0){
        circle.dx *= -1;
    } else if((circle.y - circle.size) < 0) {
        circle.dy *= -1;
    }

    if ((circle.x + circle.size) > player.x && //circle right should be greater than the left of the player
        (circle.x - circle.size) < (player.x + player.w) && //circle left should be less than the right of the player
        (circle.y + circle.size) > player.y && //circle bottom should be greater than the player top
        (circle.y - circle.size) < (player.y + player.h)) //circle top should be less than the bottom  
        {
        circle.dy *= -1;
    } else if ((circle.y + circle.size) > canvas.height){
        console.log("The player missed the ball!")
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        circle.x = canvas.width / 2;
        circle.y = canvas.height / 2;
        drawCircle();
        player.x = mouse.x - mouse.offsetX;
        player.drawRect();
    }
     // change position
     circle.x += circle.dx;
     circle.y += circle.dy;

     for (let i = 0; i < bricks.length; i++){
        for (let j = 0; j < bricks[i].length; j++){
                if ((circle.x + circle.size) > bricks[i][j].x && //circle right should be greater than the left of the player
            (circle.x - circle.size) < (bricks[i][j].x + bricks[i][j].w) && //circle left should be less than the right of the player
            (circle.y + circle.size) > bricks[i][j].y && //circle bottom should be greater than the player top
            (circle.y - circle.size) < (bricks[i][j].y + bricks[i][j].h)) //circle top should be less than the bottom  
            {
                circle.dy *= -1;
                bricks[i].splice(j, 1); 
            };
            

        }
    }
        

    requestAnimationFrame(update);
}

update();
