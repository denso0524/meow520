const Y_AXIS = 1;
const X_AXIS = 2;
let canvas;
let fireworks = [];
let star = [];

function windowResized() {
    console.log(0)
  resizeCanvas(window.innerWidth, window.innerHeight);
  this.preStar();
}

function setup() {
  // キャンバスの設定
  // 畫布設置
  background(0);
  let canvas = document.getElementById('firework');
  let ctx = canvas.getContext('2d');
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.position(0, 0);
  canvas.style("z-index", "-1");
  colorMode(RGB);
  frameRate(60);
  this.preStar();
}

function draw() {
  // 背景色を設定
  // 設置背景顏色
  setGradient(0, 0, width, height, color(0, 0, 0), color(24, 32, 72), Y_AXIS);
  noStroke();

  // 星を描く
  //畫星星
  this.drawStar();

  // 花火を打ち上げる間隔を調整
  // 調整煙花發射間隔
  if (0 === frameCount % 100) {
    // 打ち上がるスピード
    // 發射速度
    let speed = random(10, 30);
    fireworks.push(new FireWork(random(width), height, 0, speed, 0.98));
  }

  for (let fw of fireworks) {
    // 打ち切った花火を処理対象から外す（配列から削除する）
    // 從處理目標中移除已停止的煙花（從數組中移除）
    if (2 === fw.getType || 30000 < fw.getFrame) {
      fireworks = fireworks.filter((n) => n !== fw);
      continue;
    }

    // 打ち上げアニメーションを呼び出す
    // 調用啟動動畫
    fw.fire();
  }
}

class FireWork {
  // 初期設定
  constructor(x, y, vx, vy, gv) {
    // フレームカウンター
    //幀計數器
    this.frame = 0;
    this.type = 0;
    this.next = 0;
    // 花火の色
    // 煙花顏色
    this.r = random(155) + 80;
    this.g = random(155) + 80;
    this.b = random(155) + 80;
    this.a = 255;

    // 初期位置
    this.x = x;
    this.y = y;

    // 玉の大きさ
    // 球大小
    this.w = random(10, 5);

    // 打ち上がる高さ
    // 發射高度
    this.maxHeight = random(height / 6, height / 2);
    this.fireHeight = height - this.maxHeight;

    // 重力
    this.vx = vx;
    this.vy = vy;
    this.gv = gv;

    // 残像表示用配列
    // 顯示殘像的數組
    this.afterImages = [];
    // 爆発用配列
    // 爆炸數組
    this.explosions = [];

    // 消えてから爆発までの遅延時間
    // 從消失到爆炸的延遲時間
    this.exDelay = random(10, 40);
    // 爆発の大きさ
    // 爆炸的大小
    this.large = random(5, 15);
    // 爆発の玉の数
    // 爆炸球個數
    this.ball = random(20, 100);
    // 爆発から消えるまでの長さ
    // 從爆炸到消失的長度
    this.exEnd = random(20, 40);
    // 爆発のブレーキ
    // 爆炸製動(停止)
    this.exStop = 0.96;
    
  }

  get getFrame() {
    return this.frame;
  }

  get getType() {
    return this.type;
  }

  // 処理コントロール
  fire() {
    // 0:打ち上げ（初期） 1:爆発
    // 0：發射（初始） 1：爆炸
    switch (this.type) {
      case 0:
        this.rising();
        break;
      case 1:
        this.explosion();
        break;
    }
  }

  // 打ち上げアニメーション
  // 啟動動畫
  rising() {
    
    // 頂点まで達したら消す
    // 當你到達頂部時擦除
    if (this.y * 0.8 < this.maxHeight) {
      this.a = this.a - 6;
    }

    // 指定の高さまで上昇する
    // 上升到指定高度
    this.x += this.vx;
    this.y -= this.vy * ((this.fireHeight - (height - this.y)) / this.fireHeight);

    // 残像を表示
    // 顯示殘像
    this.afterImages.push(new Afterimage(this.r, this.g, this.b, this.x, this.y, this.w, this.a));
    for (let ai of this.afterImages) {
      if (ai.getAlpha <= 0) {
        this.afterImages = this.afterImages.filter((n) => n !== ai);
        continue;
      }
      ai.rsImage();
    }

    // 打ち上げ表示
    // 啟動顯示
    this.update(this.x, this.y, this.w);

    // 全ての表示が消えたら処理の種類を変更する
    // 當所有顯示消失時改變處理類型
    if (0 == this.afterImages.length) {
      if (0 === this.next) {
        // 消えてから爆発まで遅延させる
        // 從消失到爆炸的延遲
        this.next = this.frame + Math.round(this.exDelay);
      } else if (this.next === this.frame) {
        function getRandom(min,max){
            return Math.floor(Math.random()*(max-min+1))+min;
        };
        let launch_sound = new Audio(`sound\\fireworks\\loundlaunch_and_explosion${getRandom(1,3)}.mp3`);
        launch_sound.volume = 0.1
        console.log("whistle");
        launch_sound.loop = false;
        launch_sound.play();
        // 花火の大きさ
        // 煙花的大小
        for (let i = 0; i < this.ball; i++) {
          // 爆発の角度
          let r = random(0, 360);
          // 花火の内側を作る（バラバラ）
          // 製作煙花的內部（不相交）
          let s = random(0.1, 0.9);
          let vx = Math.cos((r * Math.PI) / 180) * s * this.large;
          let vy = Math.sin((r * Math.PI) / 180) * s * this.large;
          this.explosions.push(new FireWork(this.x, this.y, vx, vy, this.exStop));
          // 花火の輪郭を作る（丸くなるようにする）
          // 畫出煙花的輪廓（讓它變圓）
          let cr = random(0, 360);
          let cs = random(0.9, 1);
          let cvx = Math.cos((cr * Math.PI) / 180) * cs * this.large;
          let cvy = Math.sin((cr * Math.PI) / 180) * cs * this.large;
          this.explosions.push(new FireWork(this.x, this.y, cvx, cvy, this.exStop));
        }
        this.a = 255;
        this.type = 1;
      }
    }
  }

  // 爆発アニメーション
  // 爆炸動畫
  explosion() {
    for (let ex of this.explosions) {
      
      
      
      ex.frame++;
      // 爆発し終わった花火を配列から除去する
      // 從數組中移除爆炸的煙花
      if (2 === ex.getType) {
        this.explosions = this.explosions.filter((n) => n !== ex);
        continue;
      }

      // 残像を描画
      // 繪製殘像
      if (0 === Math.round(random(0, 32))) {
        
        ex.afterImages.push(new Afterimage(this.r, this.g, this.b, ex.x, ex.y, ex.w, ex.a));
      }

      for (let ai of ex.afterImages) {
        if (ai.getAlpha < 0) {
          ex.afterImages = ex.afterImages.filter((n) => n !== ai);
          continue;
        }
        ai.exImage();
      }

      // 爆発を描画
      // 畫一個爆炸
      this.update(ex.x, ex.y, ex.w, ex.a);
      ex.x += ex.vx;
      ex.y += ex.vy;
      ex.vx = ex.vx * ex.gv;
      ex.vy = ex.vy * ex.gv;
      ex.vy = ex.vy + ex.gv / 30;
      if (this.exEnd < ex.frame) {
        ex.w -= 0.1;
        ex.a = ex.a - 4;
        if (ex.a < 0 && 0 === ex.afterImages.length) {
          ex.type = 2;
        }
      }
    }
  }

  // 花火を表示する
  // 顯示煙花
  update(x, y, w, a) {
    this.frame++;
    if (0 < this.a) {
      let c = color(this.r, this.g, this.b);
      c.setAlpha(a);
      fill(c);
      ellipse(x, y, w, w);
    }
  }
}

// 残像処理用クラス
// 餘像處理類
class Afterimage {
  constructor(r, g, b, x, y, w, a) {
    this.frame = 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.x = x;
    this.y = y;
    this.w = w;
    this.a = a;
    this.vx = random(-0.24, 0.24);
    this.vy = random(0.2, 0.8);
    this.vw = random(0.05, 0.2);
  }

  get getAlpha() {
    return this.a;
  }

  // 打ち上げ用
  // 用於啟動
  rsImage() {
    if (0 < this.a) {
      this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
      this.r += 4;
      this.g += 4;
      this.b += 4;
      this.x = this.x + this.vx;
      this.y = this.y + this.vy;
      if (0 < this.w) {
        this.w = this.w - this.vw;
      }
      this.a = this.a - 4;
    }
  }

  // 爆発用
  // 用於爆炸
  exImage() {
    if (0 < this.a) {
      this.update(this.r, this.g, this.b, this.x, this.y, this.w, this.a);
      this.r += 2.5;
      this.g += 2.5;
      this.b += 2.5;
      this.x = this.x + this.vx;
      this.y = this.y + this.vy;
      if (0 < this.w) {
        this.w = this.w - this.vw;
      }
      this.a = this.a - 1.5;
    }
  }

  update(r, g, b, x, y, w, a) {
    this.frame++;
    let c = color(r, g, b);
    c.setAlpha(a);
    fill(c);
    ellipse(x, y, w, w);
  }
}

// グラデーションを描画
// 繪製漸變
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}

// 星を作成
// 創建一個星星
function preStar() {
  star = [];
  for (let i = 0; i < 100; i++) {
    star.push([random(width), random(height / 2), random(1, 4)]);
  }
}

// 星を描画
//畫一個星星
function drawStar() {
  // 星を描く
  //畫一個星星
  for (let s of star) {
    let c = color(random(150, 255), random(150, 255), 255);
    c.setAlpha(random(150, 200));
    fill(c);
    ellipse(s[0], s[1], s[2], s[2]);
  }
}
