enchant();
window.onload = function() {
  var game = new Game(320, 320);
  game.fps = 32;
  var tile = 32;//タイルサイズ
  var point_num = 3;//得点アイテムの数
  var enemy_num = 5;   //敵の数
  var enemy_spd = 1;   //敵の初期スピード
  game.preload('map0.gif', 'chara5.gif','chara7.gif','pad.png','icon.gif','bgm08.wav','se2.wav');
    game.onload = function() {

     var score = 5000;      //点数の初期化
       var state = new Label();
        state.text = "Life:5000";
        state.color = "#000000";
        state.x = 200;
        state.y = 305;
        game.rootScene.addChild(state);
 
        state.addEventListener('enterframe', function(e) {
          state.text = "Life:" + score;
          
        });

        var m_data  = new Array();  //表示用マップ領域
        var m_hit   = new Array();  //衝突判定用マップ領域
        //マップの初期化
        for (i = 0; i < 19; i++){
            m_data[i] = new Array();
            m_hit[i] = new Array();
            for (ii = 0; ii < 19; ii++){
                var flag=4;  //壁のタイル
                if(i>0 && i<18 && ii>0 && ii<18){
                    if(i%2 || ii%2){
                    flag=5;
                    }
                }
                m_data[i][ii] = flag;
                m_hit[i][ii]  = flag-5; //壁の時１、壁以外の時0を入れる。
            }
        }
 
        //迷路作成
        dx = [1,0,-1,0];
        dy = [0,1,0,-1];
        for(i = 2;i < 18; i+=2){
            for(ii = 2;ii < 18; ii+=2){
                var r=3;
                if(i==2){r=4;}  //一番上のみ上の方向を追加。
                var rand = Math.floor(Math.random()*r);
                m_data[i+dy[rand]][ii+dx[rand]] = 4;
                m_hit[i+dy[rand]][ii+dx[rand]] = 1;
                //指定した方向の通路を壁で埋める。
            }
        }
 
        var map = new Map(16, 16);
        map.image = game.assets['map0.gif'];
        map.loadData(m_data);
        map.collisionData = m_hit;
        game.rootScene.addChild(map);

       //BGMを鳴らす
       bgm = game.assets['bgm08.wav'].clone();
       bgm.play();

    
        //プレイヤーの初期化
        var player = new Sprite(32,32);
        player.scale(0.8,0.8);
        player.image = game.assets['chara5.gif'];
        player.x     = tile*0.3;
        player.y     = 8;
        game.rootScene.addChild(player);

 
        player.direction = 0;
        player.walk=0;
        var p_spd   = 2;            //プレイヤーの移動スピード
        var a_spd   = 3;            //プレイヤーのアニメーションスピード
 
        player.addEventListener('enterframe', function(e) {
            this.xx = this.x;
            this.yy = this.y;
            if (game.input.left){
							this.xx = this.x - p_spd;this.direction = 2;
 							if(!map.hitTest(this.xx+0,this.yy+8)&& !map.hitTest(this.xx+0,this.yy+16)){
          		this.x=this.xx;
							this.y=this.yy;
							}
						} //左
            if (game.input.right){
							this.xx = this.x + p_spd;this.direction = 3;
							if(!map.hitTest(this.xx+16,this.yy+8)&& !map.hitTest(this.xx+16,this.yy+16)){
          		this.x=this.xx;
							this.y=this.yy;
							}
						} //右
            if (game.input.up) {
							this.yy = this.y - p_spd;this.direction = 5;
							if(!map.hitTest(this.xx+0,this.yy+16)&& !map.hitTest(this.xx+8,this.yy+16)&& !map.hitTest(this.xx+16,this.yy+16)){
          		this.x=this.xx;
							this.y=this.yy;
							}
						} //上
            if (game.input.down){
							this.yy = this.y + p_spd;this.direction = 0;
							if(!map.hitTest(this.xx+0,this.yy+16)&& !map.hitTest(this.xx+8,this.yy+16)&&(this.xx+16,this.yy+16)){
          		this.x=this.xx;
							this.y=this.yy;
							}
						} //下
 
            //移動予定地this.xx,this.yyが壁かどうかを調べる。
         
          		//this.x=this.xx;
							//this.y=this.yy;
 
            if (!(game.frame % a_spd)){this.walk++;}
            if(this.walk == 3){this.walk = 0;}
            this.frame = this.direction*6 + this.walk;
        });

       //鍵アイテム作成
        var key = new Sprite(16,16);
        key.image = game.assets["icon.gif"];
        key.frame = 33;
        key.x = tile * 0.5;
        key.y = 8;
         
        //Lifeアイテム作成関数
        var create_point = function(e){
            var point = new Sprite(16, 16);
            point.image = game.assets['icon.gif'];
            point.frame  = 65;
            var check = 1;
            while(check){
                point.x = Math.floor(Math.random()*17+1) * 16;  //Ｘ座標を乱数で入力
                point.y = Math.floor(Math.random()*17+1) * 16;  //Ｙ座標を乱数で入力
                if(!map.hitTest(point.x+8,point.y+8)){check=0;} //指定した座標が壁だったらやりなおす。
            }
 
            //プレイヤーが接触したときの処理
            point.addEventListener('enterframe', function(e) {
                if(this.intersect(player)){
                    score += 100;
                    var check = 1;
                    while(check){
                        this.x = Math.floor(Math.random()*17+1) * 16;   //Ｘ座標を乱数で入力
                        this.y = Math.floor(Math.random()*17+1) * 16;   //Ｙ座標を乱数で入力
                        if(!map.hitTest(this.x+8,this.y+8)){check=0;}   //指定した座標が壁だったらやりなおす。
                    }
                 se1.assets = ['se2.wav']
                  game.se2.play();
                }
            });
            return point;
        } 

 
        //エネミー作成
        var create_enemy = function(e){
            var enemy = new Sprite(32, 32);
            enemy.image = game.assets['chara7.gif'];
            enemy.frame  = 11
            enemy.direction = Math.floor(Math.random()*4);      //初期の移動方向を指定
            var check = 1;
            while(check){
                enemy.x = Math.floor(Math.random()*17+1) * 16;  //Ｘ座標を乱数で入力
                enemy.y = Math.floor(Math.random()*17+1) * 16;  //Ｙ座標を乱数で入力
                if(!map.hitTest(enemy.x+8,enemy.y+8)){check=0;} //指定した座標が壁だったらやりなおす。
            }
 
            //エネミーの行動
            enemy.addEventListener('enterframe', function(e) {
                if(this.intersect(player)){
                    score += -10;
                }
                this.xx = this.x;
                this.yy = this.y;
                if(this.direction == 0){this.yy = this.y+enemy_spd;}
                if(this.direction == 1){this.xx = this.x-enemy_spd;}
                if(this.direction == 2){this.xx = this.x+enemy_spd;}
                if(this.direction == 3){this.yy = this.y-enemy_spd;}
                if(!map.hitTest(this.xx+1,this.yy+1)&&!map.hitTest(this.xx+14,this.yy+14)){
                    this.x = this.xx;
                    this.y = this.yy;
                }else{
                    this.direction = (this.direction + Math.floor(Math.random()*3))%4;
                }
            });
            return enemy;
        }
 
         for (var i = 0; i < point_num; i++) {
         //得点アイテム表示準備。
            var point = create_point();
            game.rootScene.addChild(point);
        }

 
        for (var i = 0; i < enemy_num; i++) {
         //エネミー表示準備。
            var enemy = create_enemy();
            game.rootScene.addChild(enemy);
        }
          
         game.rootScene.addChild(key);

 
        //難易度調整 一定時間毎に敵の速度を上げる。
        game.addEventListener('enterframe', function(e) {
            if(this.frame == 900){enemy_spd++;}
            if(this.frame == 1800){enemy_spd++;}
            if(this.frame == 5400){enemy_spd++;}
        });
    }
    game.start();
}
