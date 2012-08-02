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
         if(score===0){
          game.end();
         }
          
        });

        var m_data  = new Array();  //表示用マップ領域
        var m_hit   = new Array();  //衝突判定用マップ領域
        //マップの初期化
        for (i = 0; i < 9; i++){
            m_data[i] = new Array();
            m_hit[i] = new Array();
            for (ii = 0; ii < 9; ii++){
                var flag=4;  //壁のタイル
                if(i>0 && i<8 && ii>0 && ii<8){
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
        for(var i = 2;i < 8; i+=2){
            for(var ii = 2;ii < 8; ii+=2){
                var r=3;
                if(i==2){r=4;}  //一番上のみ上の方向を追加。
                var rand = Math.floor(Math.random()*r);
                m_data[i+dy[rand]][ii+dx[rand]] = 4;
                m_hit[i+dy[rand]][ii+dx[rand]] = 1;
                //指定した方向の通路を壁で埋める。
            }
        }
 				var m_data2 = new Array();
				var m_hit2 = new Array();

        for(var i = 0;i < 18; i++){
						m_data2[i] = new Array();
						m_hit2[i] = new Array();
            for(var ii = 0;ii < 18; ii++){
							var half_i = Math.floor(i/2);
							var half_ii = Math.floor(ii/2);
							m_data2[i][ii] = m_data[half_i][half_ii];
							m_hit2[i][ii] = m_hit[half_i][half_ii];
					}
				}

        var map = new Map(16, 16);
        map.image = game.assets['map0.gif'];
        map.loadData(m_data2);
        map.collisionData = m_hit2;
        game.rootScene.addChild(map);

       //BGMを鳴らす
       bgm = game.assets['bgm08.wav'].clone();
       bgm.play();

    
        //プレイヤーの初期化
        var player = new Sprite(32,32);
        
        player.image = game.assets['chara5.gif'];
        player.x     = tile;
        player.y     = tile;
        game.rootScene.addChild(player);

 
        player.direction = 0;
        player.walk=0;
        var p_spd   = 2;            //プレイヤーの移動スピード
        var a_spd   = 3;            //プレイヤーのアニメーションスピード

 
        player.addEventListener('enterframe', function(e) {
           if (!(game.frame % a_spd)){this.walk++;}
            if(this.walk == 3){this.walk = 0;}
            this.xx = this.x;
            this.yy = this.y;
            if (game.input.left){
							this.direction = 2;
 							if(!map.hitTest(this.xx+11,this.yy+16)&&!map.hitTest(this.xx+11,this.yy+20)){
          			this.xx = this.x - p_spd;
							}
						} //左
            if (game.input.right){

							this.direction = 3;
							if(!map.hitTest(this.xx+20,this.yy+16)&& !map.hitTest(this.xx+20,this.yy+20)){
								this.xx = this.x + p_spd;
							}
						} //右
            if (game.input.up) {

							this.direction = 5;
							if(!map.hitTest(this.xx+11,this.yy+16)&& !map.hitTest(this.xx+16,this.yy+16)&& !map.hitTest(this.xx+20,this.yy+16)){
								this.yy = this.y - p_spd;
							}
						} //上
            if (game.input.down){

							this.direction = 0;
							if(!map.hitTest(this.xx+11,this.yy+20)&& !map.hitTest(this.xx+16,this.yy+28)&& !map.hitTest(this.xx+20,this.yy+28)){
								this.yy = this.y + p_spd;
							}
						} //下

            this.frame = this.direction*6 + this.walk;
            this.moveTo(this.xx, this.yy);
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
                        if(!map.hitTest(this.x+16,this.y+16) && !map.hitTest(this.x+0,this.y+0) && !map.hitTest(this.x+32,this.y+32)){
													check=0;
													}   //指定した座標が壁だったらやりなおす。
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
            
            enemy.direction = Math.floor(Math.random()*4);      //初期の移動方向を指定
            var check = 1;
            while(check){
                enemy.x = Math.floor(Math.random()*17+1) * 16;  //Ｘ座標を乱数で入力
                enemy.y = Math.floor(Math.random()*17+1) * 16;  //Ｙ座標を乱数で入力
                if(!map.hitTest(enemy.x+16,enemy.y+16) && !map.hitTest(enemy.x+0,enemy.y+0) && !map.hitTest(enemy.x+32,enemy.y+32)){
								check=0;
								} //指定した座標が壁だったらやりなおす。
            }
 
            //エネミーの行動
            enemy.addEventListener('enterframe', function(e) {
                if(this.intersect(player)){
                    score += -10;
                }
                this.xx = this.x;
                this.yy = this.y;
                if(this.direction == 0){
									this.yy = this.y+enemy_spd;
									}
                if(this.direction == 1){
									this.xx = this.x-enemy_spd;
									}
                if(this.direction == 2){
									this.xx = this.x+enemy_spd;
									}
                if(this.direction == 3){
									this.yy = this.y-enemy_spd;
									}
                if(!map.hitTest(this.xx+2,this.yy+2)&&!map.hitTest(this.xx+28,this.yy+28)){
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
