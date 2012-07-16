enchant();
window.onload = function() {
  var game = new Game(320, 400);
  var tile = 32;//�^�C���T�C�Y
  var point_num = 3;//���_�A�C�e���̐�
  var life_num = 3;//�c�@�A�C�e���̐�
  var enemy_num = 3;   //�G�̐�
  var enemy_spd = 1;   //�G�̏����X�s�[�h
  game.preload('map0.gif', 'chara5.gif','chara7.gif','pad.png','icon.gif','bgm08.wav','se2.wav');
    game.onload = function() {
        var m_data  = new Array();  //�\���p�}�b�v�̈�
        var m_hit   = new Array();  //�Փ˔���p�}�b�v�̈�
        //�}�b�v�̏�����
        for (i = 0; i < 19; i++){
            m_data[i] = new Array();
            m_hit[i] = new Array();
            for (ii = 0; ii < 19; ii++){
                var flag=4;  //�ǂ̃^�C��
                if(i>0 && i<18 && ii>0 && ii<18){
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
        for(i = 2;i < 18; i+=2){
            for(ii = 2;ii < 18; ii+=2){
                var r=3;
                if(i==2){r=4;}  //��ԏ�̂ݏ�̕�����ǉ��B
                var rand = Math.floor(Math.random()*r);
                m_data[i+dy[rand]][ii+dx[rand]] = 4;
                m_hit[i+dy[rand]][ii+dx[rand]] = 1;
                //�w�肵�������̒ʘH��ǂŖ��߂�B
            }
        }
 
        var map = new Map(16, 16);
        map.image = game.assets['map0.gif'];
        map.loadData(m_data);
        map.collisionData = m_hit;
        game.rootScene.addChild(map);

       //BGM��炷
       bgm = game.assets['bgm08.wav'].clone();
       bgm.play();
 
        //�o�����ݒ�
        var pad = new Pad(); // Pad��ǉ�
        pad.x = 0; // x���W
        pad.y = 305; // y���W
        game.rootScene.addChild(pad); // �V�[���ɒǉ�
 
        //�v���C���[�̏�����
        var player = new Sprite(16,24);
        player.image = game.assets['chara5.gif'];
        player.x     = tile*0.5;
        player.y     = 8;
        game.rootScene.addChild(player);

 
        player.direction = 0;
        player.walk=0;
        var p_spd   = 2;            //�v���C���[�̈ړ��X�s�[�h
        var a_spd   = 3;            //�v���C���[�̃A�j���[�V�����X�s�[�h
 
        player.addEventListener('enterframe', function(e) {
            this.xx = this.x;
            this.yy = this.y;
            if (game.input.left){this.xx = this.x - p_spd;this.direction = 1;}
            if (game.input.right){this.xx = this.x + p_spd;this.direction = 2;}
            if (game.input.up) {this.yy = this.y - p_spd;this.direction = 3;}
            if (game.input.down){ this.yy = this.y + p_spd;this.direction = 0;}
 
            //�ړ��\��nthis.xx,this.yy���ǂ��ǂ����𒲂ׂ�B
            var asobi = 4;  //�V�ѕ�
           if(!map.hitTest(this.xx+asobi,this.yy+8+asobi)&&!map.hitTest(this.xx+15-asobi,this.yy+8+asobi)&&!map.hitTest(this.xx+asobi,this.yy+23-asobi)&&!map.hitTest(this.xx+15-asobi,this.yy+23-asobi)){this.x=this.xx;this.y=this.yy;}
 
            if (!(game.frame % a_spd)){this.walk++;}
            if(this.walk == 3){this.walk = 0;}
            this.frame = this.direction*6 + this.walk;
        });
 
        var score = 0;      //�_���̏�����
        var state = new Label();
        state.text = "Score:0";
        state.color = "#000000";
        state.x = 200;
        state.y = 310;
        game.rootScene.addChild(state);
 
        state.addEventListener('enterframe', function(e) {
            state.text = "Score:" + score;
        });
 
        //���_�A�C�e���쐬�֐�
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
                        if(!map.hitTest(this.x+8,this.y+8)){check=0;}   //�w�肵�����W���ǂ���������Ȃ����B
                    }
                 se1.assets = ['se2.wav']
                  game.se2.play();
                }
            });
            return point;
        }

         //���C�t�\��
          

         //�c�@�A�C�e���쐬�֐�
        var create_life = function(e){
            var life = new Sprite(16, 16);
            life.image = game.assets['icon.gif'];
            life.frame  = 10;
            var check1 = 1;
            while(check1){
                life.x = Math.floor(Math.random()*17+1) * 16;  //�w���W�𗐐��œ���
                life.y = Math.floor(Math.random()*17+1) * 16;  //�x���W�𗐐��œ���
                if(!map.hitTest(life.x+8,life.y+8)){check1=0;} //�w�肵�����W���ǂ���������Ȃ����B
            }
 
            //�v���C���[���ڐG�����Ƃ��̏���
            life.addEventListener('enterframe', function(e) {
                if(this.intersect(player)){
                    score += 10;
                    var check1 = 1;
                    while(check){
                        this.x = Math.floor(Math.random()*17+1) * 16;   //�w���W�𗐐��œ���
                        this.y = Math.floor(Math.random()*17+1) * 16;   //�x���W�𗐐��œ���
                        if(!map.hitTest(this.x+8,this.y+8)){check1=0;}   //�w�肵�����W���ǂ���������Ȃ����B
                    }
                }
            });
            return life;
        }

 
        //�G�l�~�[�쐬
        var create_enemy = function(e){
            var enemy = new Sprite(16, 16);
            enemy.image = game.assets['chara7.gif'];
            enemy.frame  = 11
            enemy.direction = Math.floor(Math.random()*4);      //�����̈ړ��������w��
            var check = 1;
            while(check){
                enemy.x = Math.floor(Math.random()*17+1) * 16;  //�w���W�𗐐��œ���
                enemy.y = Math.floor(Math.random()*17+1) * 16;  //�x���W�𗐐��œ���
                if(!map.hitTest(enemy.x+8,enemy.y+8)){check=0;} //�w�肵�����W���ǂ���������Ȃ����B
            }
 
            //�G�l�~�[�̍s��
            enemy.addEventListener('enterframe', function(e) {
                if(this.intersect(player)){
                    score = 0;
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
         //���_�A�C�e���\�������B
            var point = create_point();
            game.rootScene.addChild(point);
        }
 
        for (var i = 0; i < enemy_num; i++) {
         //�G�l�~�[�\�������B
            var enemy = create_enemy();
            game.rootScene.addChild(enemy);
        }
 
        //��Փx���� ��莞�Ԗ��ɓG�̑��x���グ��B
        game.addEventListener('enterframe', function(e) {
            if(this.frame == 900){enemy_spd++;}
            if(this.frame == 1800){enemy_spd++;}
            if(this.frame == 5400){enemy_spd++;}
        });
    }
    game.start();
}
