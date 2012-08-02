enchant();
window.onload = function() {
  var game = new Game(320, 320);
  game.fps = 32;
  var tile = 32;//�^�C���T�C�Y
  var point_num = 3;//���_�A�C�e���̐�
  var enemy_num = 5;   //�G�̐�
  var enemy_spd = 1;   //�G�̏����X�s�[�h
  game.preload('map0.gif', 'chara5.gif','chara7.gif','pad.png','icon.gif','bgm08.wav','se2.wav');
    game.onload = function() {

     var score = 5000;      //�_���̏�����
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

        var m_data  = new Array();  //�\���p�}�b�v�̈�
        var m_hit   = new Array();  //�Փ˔���p�}�b�v�̈�
        //�}�b�v�̏�����
        for (i = 0; i < 9; i++){
            m_data[i] = new Array();
            m_hit[i] = new Array();
            for (ii = 0; ii < 9; ii++){
                var flag=4;  //�ǂ̃^�C��
                if(i>0 && i<8 && ii>0 && ii<8){
                    if(i%2 || ii%2){
                    flag=5;
                    }
                }
                m_data[i][ii] = flag;
                m_hit[i][ii]  = flag-5; //�ǂ̎��P�A�ǈȊO�̎�0������B
            }
        }
 
        //���H�쐬
        dx = [1,0,-1,0];
        dy = [0,1,0,-1];
        for(var i = 2;i < 8; i+=2){
            for(var ii = 2;ii < 8; ii+=2){
                var r=3;
                if(i==2){r=4;}  //��ԏ�̂ݏ�̕�����ǉ��B
                var rand = Math.floor(Math.random()*r);
                m_data[i+dy[rand]][ii+dx[rand]] = 4;
                m_hit[i+dy[rand]][ii+dx[rand]] = 1;
                //�w�肵�������̒ʘH��ǂŖ��߂�B
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

       //BGM��炷
       bgm = game.assets['bgm08.wav'].clone();
       bgm.play();

    
        //�v���C���[�̏�����
        var player = new Sprite(32,32);
        
        player.image = game.assets['chara5.gif'];
        player.x     = tile;
        player.y     = tile;
        game.rootScene.addChild(player);

 
        player.direction = 0;
        player.walk=0;
        var p_spd   = 2;            //�v���C���[�̈ړ��X�s�[�h
        var a_spd   = 3;            //�v���C���[�̃A�j���[�V�����X�s�[�h

 
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
						} //��
            if (game.input.right){

							this.direction = 3;
							if(!map.hitTest(this.xx+20,this.yy+16)&& !map.hitTest(this.xx+20,this.yy+20)){
								this.xx = this.x + p_spd;
							}
						} //�E
            if (game.input.up) {

							this.direction = 5;
							if(!map.hitTest(this.xx+11,this.yy+16)&& !map.hitTest(this.xx+16,this.yy+16)&& !map.hitTest(this.xx+20,this.yy+16)){
								this.yy = this.y - p_spd;
							}
						} //��
            if (game.input.down){

							this.direction = 0;
							if(!map.hitTest(this.xx+11,this.yy+20)&& !map.hitTest(this.xx+16,this.yy+28)&& !map.hitTest(this.xx+20,this.yy+28)){
								this.yy = this.y + p_spd;
							}
						} //��

            this.frame = this.direction*6 + this.walk;
            this.moveTo(this.xx, this.yy);
        });

       //���A�C�e���쐬
        var key = new Sprite(16,16);
        key.image = game.assets["icon.gif"];
        key.frame = 33;
        key.x = tile * 0.5;
        key.y = 8;
         
        //Life�A�C�e���쐬�֐�
        var create_point = function(e){
            var point = new Sprite(16, 16);
            point.image = game.assets['icon.gif'];
            point.frame  = 65;
            var check = 1;
            while(check){
                point.x = Math.floor(Math.random()*17+1) * 16;  //�w���W�𗐐��œ���
                point.y = Math.floor(Math.random()*17+1) * 16;  //�x���W�𗐐��œ���
                if(!map.hitTest(point.x+8,point.y+8)){check=0;} //�w�肵�����W���ǂ���������Ȃ����B
            }
 
            //�v���C���[���ڐG�����Ƃ��̏���
            point.addEventListener('enterframe', function(e) {
                if(this.intersect(player)){
                    score += 100;
                    var check = 1;
                    while(check){
                        this.x = Math.floor(Math.random()*17+1) * 16;   //�w���W�𗐐��œ���
                        this.y = Math.floor(Math.random()*17+1) * 16;   //�x���W�𗐐��œ���
                        if(!map.hitTest(this.x+16,this.y+16) && !map.hitTest(this.x+0,this.y+0) && !map.hitTest(this.x+32,this.y+32)){
													check=0;
													}   //�w�肵�����W���ǂ���������Ȃ����B
                    }
                 se1.assets = ['se2.wav']
                  game.se2.play();
                }
            });
            return point;
        } 

        //�G�l�~�[�쐬
        var create_enemy = function(e){
            var enemy = new Sprite(32, 32);
            enemy.image = game.assets['chara7.gif'];
            
            enemy.direction = Math.floor(Math.random()*4);      //�����̈ړ��������w��
            var check = 1;
            while(check){
                enemy.x = Math.floor(Math.random()*17+1) * 16;  //�w���W�𗐐��œ���
                enemy.y = Math.floor(Math.random()*17+1) * 16;  //�x���W�𗐐��œ���
                if(!map.hitTest(enemy.x+16,enemy.y+16) && !map.hitTest(enemy.x+0,enemy.y+0) && !map.hitTest(enemy.x+32,enemy.y+32)){
								check=0;
								} //�w�肵�����W���ǂ���������Ȃ����B
            }
 
            //�G�l�~�[�̍s��
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
         //���_�A�C�e���\�������B
            var point = create_point();
            game.rootScene.addChild(point);
        }

 
        for (var i = 0; i < enemy_num; i++) {
         //�G�l�~�[�\�������B
            var enemy = create_enemy();
            game.rootScene.addChild(enemy);
        }
          
         game.rootScene.addChild(key);

 
        //��Փx���� ��莞�Ԗ��ɓG�̑��x���グ��B
        game.addEventListener('enterframe', function(e) {
            if(this.frame == 900){enemy_spd++;}
            if(this.frame == 1800){enemy_spd++;}
            if(this.frame == 5400){enemy_spd++;}
        });
    }
    game.start();
}
