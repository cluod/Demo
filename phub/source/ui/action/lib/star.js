{
    const $ = Core.$;
    const path = require('path');
    const path_star = path.join(__dirname, '../../img/index/star');
    const START_ONE = {
        img: (v => {
            let img = new Image();
            img.src = path.join(path_star, 'star1.png');
            return img;
        })(),
        width: 160,
        height: 120
    };
    const START_TWO = {
        img: (v => {
            let img = new Image();
            img.src = path.join(path_star, 'star2.png');
            return img;
        })(),
        width: 160,
        height: 120
    };
    const START_THREE = {
        img: (v => {
            let img = new Image();
            img.src = path.join(path_star, 'liuxing.png');
            return img;
        })(),
        width: 200/5,
        height: 213/5
    };

    class StarOne {
        constructor(width, height) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.scale = Math.random() * 0.2;
            this.scaleStep = Math.random()/100;
        }

        draw(ctx) {
            let _this = this;
            let width = START_ONE.width * _this.scale;
            let height = START_ONE.height * _this.scale;
            ctx.drawImage(START_ONE.img, _this.x - width/2, _this.y - height/2, width, height);
            _this.scale += _this.scaleStep;
            if (_this.scale > 0.5 || _this.scale < 0.001) {
                _this.scaleStep = -_this.scaleStep;
            }
        }
    }

    class StarTwo {
        constructor(width, height) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.scale = Math.random() * 0.2;
            this.scaleStep = Math.random()/100;
        }

        draw(ctx) {
            let _this = this;
            let width = START_TWO.width * _this.scale;
            let height = START_TWO.height * _this.scale;
            ctx.drawImage(START_TWO.img, _this.x - width/2, _this.y - height/2, width, height);
            _this.scale += _this.scaleStep;
            if (_this.scale > 0.4 || _this.scale < 0.001) {
                _this.scaleStep = -_this.scaleStep;
            }
        }
    }
    class StarThree {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            let step = Math.max(...[Math.random() * 6, 4]);
            this.xStep = step;
            this.yStep = step * 2;
        }

        draw(ctx) {
            let _this = this;
            let img = START_THREE;
            let x = _this.x + _this.xStep;
            let y = _this.y + _this.yStep;
            if (x > _this.width*1.5) {
                x = Math.random() * -100;
            }
            if (y > _this.height*1.5) {
                y = Math.random() * -100;
            }
            ctx.drawImage(img.img, x, y, img.width, img.height);
            _this.x = x;
            _this.y = y;
        }
    }
    function Star($wrap) {
        let width = $wrap.width();
        let height = $wrap.height();

        let $canvas = $('<canvas>');
        $canvas.css({
            width: width,
            height: height
        }).attr({
            width: width,
            height: height
        }).appendTo($wrap);

        let canvas = $canvas.get(0);
        let stars = [];
        for (var i = 0; i<30; i++) {
            stars.push(new StarOne(width, height));
        }
        for (var i = 0; i<30; i++) {
            stars.push(new StarTwo(width, height));
        }
        for (var i = 0; i<1; i++) {
            stars.push(new StarThree(width, height));
        }
        let ctx = canvas.getContext('2d');
        function _run() {
            ctx.clearRect(0, 0, width, height);
            stars.forEach(star => {
                star.draw(ctx);
            })

            requestAnimationFrame(_run);
        }
        _run();
    }

    module.exports = Star;
}