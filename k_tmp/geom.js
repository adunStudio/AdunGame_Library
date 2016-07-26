
// #Geometry
// #adun.Geom
/**
 * 기하학과 기하학적 도형의 충돌을 다루는 클래스다.
 *
 * @module Adun
 * @submodule Geom
 */
(function(adun) {
    'use strict';

    var Geom = adun.Geom = {};
})(adun || (adun = {}));

// #AABB
/**
 * AABB(Axis Aligned Bounding Box)
 * 축 정렬 경계 박스
 * 2D 기준으로 x, y축에 평행한 경계를 만들어 낸다.
 * 장점: 충돌처리에 연산속도가 빠르며 직관적이다.
 * 단점: 회전하는 물체에 적합 하지않다.
 *
 * @Class AABB
 * @namespace Adun.Geom
 * @constructor
 * @param [cx=0] {Number} 박스 x축의 중앙 위치
 * @param [cy=0] {Number} 박스 y축의 중앙 위치
 * @param [width=0] {number} 박스의 넓이
 * @param [height=0] {number} 박스의 높이
 * @return {adun.Geom.AABB} AABB object
 */
(function(adun) {
    'use strict';

    var AABB = adun.Geom.AABB = adun.Class({
        TYPE: 'AABB',

        init: function(cx, cy, width, height) {

            /**
             * 박스 x축의 중앙 위치
             *
             * @property cx
             * @type {Number}
             * @default 0
             * @public
             */
            this.cx = 0;

            /**
             * 박스 y축의 중앙 위치
             *
             * @property cy
             * @type {Number}
             * @default 0
             * @public
             */
            this.cy = 0;

            /**
             * 박스 넓이의 절반
             *
             * @property halfWidth
             * @type {Number}
             * @default 0
             * @public
             */
            this.halfWidth = 0;

            /**
             * 박스 높이의 절반
             *
             * @property halfHeight
             * @type {Number}
             * @default 0
             * @public
             */
            this.halfHeight = 0;


            this.cx = cx || 0;
            this.cy = cy || 0;
            this.halfWidth = width / 2 || 0;
            this.halfHeight = height / 2 || 0;
        },

        height: {
            /**
             * 박스의 높이
             *
             * @property height
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return this.halfWidth * 2;
            }
        },

        width: {
            /**
             * 박스의 넓이
             *
             * @property height
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return this.width * 2;
            }
        },

        /**
         * 캔버스에 객체를 그린다.
         *
         * @method draw
         * @para ctx {CanvasRenderingContext2D} 그리고 싶은 캔버스의 컨텍스트
         * @return {adun.Geom.AABB}
         * @public
         */
        draw: function(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.cx - this.halfWidth, this.cy);
            ctx.lineTo(this.cx + this.halfWidth, this.cy);
            ctx.moveTo(this.cx, this.cy - this.halfHeight);
            ctx.lineTo(this.cx, this.cy + this.halfHeight);
            ctx.stroke();
            return this;
        },

        /**
         * 객체의 새로운 위치를 설정한다.
         *
         * @method setPosition
         * @param cx {Number} 박스 x축의 새로운 중앙 위치
         * @param cy {Number} 박스 y축의 새로운 중앙 위치
         * @return {adun.Geom.AABB}
         * @public
         */
        setPosition: function(cx, cy) {
            this.cx = cx || 0;
            this.cy = cy || 0;

            return this;
        },

        /**
         * 객체의 새로운 위치를 포인트 객체로부터 설정한다.
         *
         * @method setPositionPoint
         * @param pos {adun.Geom.Point}
         * @return {adun.Geom.AABB}
         * @public
         */
        setPositionPoint: function(pos) {
            this.cx = pos.x;
            this.cy = pos.y;

            return this;
        },

        /**
         * Rectangle 객체로 반환한다.
         *
         * @method toRect
         * @return {adun.Geom.Rectangle}
         * @public
         */
        toRect: function() {
            return new adun.Geom.Rectangle(this.cx - this.halfWidth, this.cy - this.halfHeight, this.halfWidth * 2, this.halfHeight * 2);
        },

        /**
         * Rectangle으로부터 AABB의 치수를 받는다.
         *
         * @method setPositionPoint
         * @param rect {adun.Geom.Rectangle}
         * @return {adun.Geom.AABB}
         * @public
         */
        fromRect: function(rect) {
            this.halfWidth = rect.width / 2;
            this.halfHeight = rect.height / 2;
            this.cx = rect.x + this.halfWidth;
            this.cy = rect.y + this.halfHeight;

            return this;
        }
    });

})(adun || (adun = {}));

// #Circle
/**
 * Circle
 * 원
 * Circle 객체는 position에 의해 정의된 중심점(x, y)과 지름을 가진다.
 *
 * @Class Circle
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} 원의 중앙 x좌표
 * @param [y=0] {Number} 원의 중앙 y좌표
 * @param [diameter=0]{Number} 원의 지름
 * @return {adun.Geom.Circle} Circle object
 */
(function() {
    'use strict';

    var Circle = adun.Geom.Circle = adun.Class({
        TYPE: 'Circle',

        init: function(x, y, diameter) {

            /**
             * 원의 지름
             *
             * @property _diameter
             * @type {Number}
             * @default 0
             * @private
             */
            this._diameter = 0;

            /**
             * 원의 반지름
             *
             * @property _radius
             * @type {Number}
             * @default 0
             * @private
             */
            this._radius = 0;

            /**
             * 원의 중앙 x좌표
             *
             * @property x
             * @type {Number}
             * @default 0
             * @public 0
             */
            this.x = 0;

            /**
             * 원의 중앙 y좌표
             *
             * @property y
             * @type {Number}
             * @default 0
             * @public 0
             */
            this.y = 0;

            this.setTo(x, y, diameter);
        },

        diameter: {
            get: function() {
                return this._diameter;
            },
            /**
             * 원의 지름(diameter)
             * 원안의 어떤 두점 사이의 가장 큰 거리이다.
             * 반지름(radius) * 2와 같다.
             *
             * @property diameter
             * @type {Number}
             * @public
             */
            set: function(valued) {
                if( value > 0 ) {
                    this._daimater = value;
                    this._radius = value * 0.5;
                }
            }
        },

        radius: {
            get: function() {
                return this._radius;
            },
            /**
             * 원의 반지름(radius)
             * 원의 중심으로부터 원의 어떤 선까지의 거리이다.
             *
             * @property radius
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value > 0 ) {
                    this._radius = value;
                    this._daimater = value * 2;
                }
            }
        },

        circumference: {
            /**
             * 원의 둘레(circumference)
             *
             * @property circumference
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return 2 * (Math.PI * this._radius);
            }
        },

        top: {
            get: function() {
                return this.y - this._radius;
            },
            /**
             * top
             * 원의 가장 위 y좌표 값이다.
             * 원의 y좌표 값과 반지름의 '차' 이다.
             * top 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property top
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value > this.y ) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = this.y - value;
                    }
                }
            }
        },

        bottom: {
            get: function() {
                return this.y + this._radius;
            },
            /**
             * bottom
             * 원의 가장 아래 y좌표 값이다.
             * 원의 y좌표 값과 반지름의 '합' 이다.
             * bottom 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property bottom
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value < this.y ) {
                        this._radius = 0;
                        this._diameter = 0;
                    } else {
                        this.radius = value - this.y;
                    }
                }
            }
        },

        left: {
            get: function() {
                return this.x - this._radius;
            },
            /**
             * left
             * 원의 가장 왼쪽 x좌표이다.
             * 원의 x좌표 값과 반지름의 '차' 이다.
             * left 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property left
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value < this.x ) {
                        this.radius = this.x - value;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            }
        },

        right: {
            get: function() {
                return this.x + this._radius;
            },
            /**
             * right
             * 원의 가장 오른쪽 x좌표이다.
             * 원의 x좌표 값과 반지름의 '합' 이다.
             * right 프로퍼티값을 바꾸는것은 원 객체의 지름을 바꾸며, 원 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property right
             * @type {Number}
             * @public
             */
            set: function(value) {
                if ( adun.isNumber(value) ) {
                    if( value > this.x ) {
                        this.radius = value - this.x;
                    } else {
                        this._radius = 0;
                        this._diameter = 0;
                    }
                }
            }
        },

        area: {
            /**
             * 원의 넓이(area)
             *
             * @property area
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                if( this._radius > 0 ) {
                    return Math.PI * this._radius * this._radius;
                }
            }
        },

        isEmpty: {
            /**
             * 원이 빈원인인지 아닌지 반환한다.
             * 원의 지름이 0과 같거나 작으면 true, 아니면 false
             *
             * @property isEmpty
             * @return {Boolean}
             * @public
             */
            get: function() {
                return this._daimater <= 0;
            }
        },

        /**
         * 원의 중앙 x, y좌표와 지름을 설정한다.
         *
         * @method setTo
         * @param x
         * @param y
         * @param diameter
         * @return {adun.Geom.Circle}
         * @public
         */
        setTo: function(x, y, diameter) {
            this.x = x || 0;
            this.y = y || 0;
            this._diameter = diameter || 0;
            this._radius = diameter * 0.5 || 0;

            return this;
        },

        /**
         * 같은 프로퍼티 x, y, 지름, 반지름 값을 가진 새로운 Circle 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Circle] {adun.Geom.Circle}
         * @return {adun.Geom.Circle}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Circle(); }

            return output.setTo(this.x, this.y, this._daimater);
        },

        /**
         * 다른 Circle 객체로부터 프로퍼티 x, y, 지름, 반지름 값을 이 Circle 객체로 복사한다.
         *
         * @param source {adun.Geom.Circle}
         * @return {adun.Geom.Circle}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x, source.y, source.diameter);
        },

        /**
         * 이 Circle 객체의 프로퍼티 값을 파라미터로 받은 Circle 객체에 복사하여 파라미터로 받은 Circle 객체를 반환한다.
         *
         * @param target {adun.Geom.Circle} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Circle}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 이 Circle 객체의 중심과 파리미터로 받은 객체의 중심사이의 거리를 반환한다.
         * 파라미터로 받은 객체는 Circle, Point등 x, y값이 있으면 어느것도 가능하다.
         *
         * @param target {Any} Circle, Point등 x, y값이 있으면 어느것도 가능하다.
         * @param [round= false] {Boolean} 가장 가까운 정수로 반올림한다. (default false)
         * @return {Number}
         * @public
         */
        distanceTo: function(target, round) {
            if( adun.isUndefined(round) ) { round = false }

            var dx = this.x - target.x;
            var dy = this.y - target.y;

            if( round ) {
                return Math.round(Math.sqrt(dx * dx + dy * dy));
            } else {
                return Math.sqrt(dx * dx + dy * dy);
            }
        },

        /**
         * 파라미터로 받은 Circle 객체와 프로퍼티 x, y, diameter(지름) 값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Circle}
         * @return {Boolean}
         * @public
         */
        equals: function(toCompare) {
            return this.x === toCompare.x && this.x === toCompare.y && this.diameter === toCompare.diameter;
        },

        /**
         * 두개의 Circle 객체가 충돌햇는지 검사한다.
         *
         * @method intersects
         * @param toIntersect {adun.Geom.Circle}
         * @return {Boolean}
         * @public
         */
        intersects: function(toIntersect) {
            return this.distanceTo(toIntersect, false) < (this._radius + toIntersect._radius);
        },

        /**
         * 주어진 각도에 기반하여 이 CIrcle 객체의 둘레에서 하나의 점 좌표를 반환한다..
         *
         * @method circumferencePoint
         * @param angle {Number} 다윈가 라디안 또는 도
         * @param [asDegrees=false] 주어진 angle의 단위가 도이면 true, 라디안이면 false (dafault=false)
         * @param [output=adun.Geom.Point]
         * @return {adun.Geom.Point}
         * @public
         */
        circumferencePoint: function(angle, asDegrees, output) {
            if( adun.isUndefined(asDegrees) ) { asDegrees = false }
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point; }

            if( asDegrees ) {
                angle = angle * (Math.PI / 180);  // Radians -> Degree
            }

            output.x = this.x + this._radius * Math.cos(angle);
            output.y = this.x + this._radius * Math.sin(angle);

            return output;
        },

        /**
         * Circle 객체의 중심좌표(x, y)의 위치를 주어진 값만큼 조정한다.
         *
         * @method offset
         * @param dx {Number} Circle 객체의 x값을 이동한다.
         * @param dy {Number} Circle 객체의 y값을 이동한다.
         * @return {adun.Geom.Circle}
         * @public
         */
        offset: function(dx, dy) {
            if( adun.isNumber(dx) && adun.isNumber(dy) ) {
                this.x += dx;
                this.y += dy;
            }

            return this;
        },

        /**
         * Point 객체를 이용하여 Circle 객체의 중심좌표(x, y)의 위치를 주어진 값만큼 조정한다.
         *
         * @method offset
         * @param post {adun.Geom.Point}
         * @return {adun.Geom.Circle}
         * @public
         */
        offsetPoint: function(pos) {
            return this.offset(pos.x, pos.y);
        }
    });
})();

// #Line
/**
 * Line
 * 선
 * Line(선) 객체는 두가지 의미가 있는데 필요로 하는 상황에 따라 다르다.
 * 1. 무한한 선
 * 2. 두개의 지정한 위치 사이의 선
 *
 * @Class Line
 * @namespace Adun.Geom
 * @constructor
 * @param [x1=0] {Number} 선의 시작 x 좌표
 * @param [y1=0] {Number} 선의 시작 y 좌표
 * @param [x2=0] {Number} 선의 끝 x 좌표
 * @param [y2=0] {Number} 선의 끝 y 좌표
 * @return {adun.Geom.Line} Line object
 */
(function() {
    'use strict';
    var Line = adun.Geom.Line = adun.Class({
        TYPE: 'Line',

        init: function(x1, y1, x2, y2) {

            /**
             * 선의 시작 x좌표
             *
             * @property x1
             * @type {Number}
             * @default 0
             * @public
             */
            this.x1 = 0;

            /**
             * 선의 시작 y좌표
             *
             * @property y1
             * @type {Number}
             * @default 0
             * @public
             */
            this.y1 = 0;

            /**
             * 선의 끝 x좌표
             *
             * @property x2
             * @type {Number}
             * @default 0
             * @public
             */
            this.x2 = 0;

            /**
             * 선의 끝 y좌표
             *
             * @property y2
             * @type {Number}
             * @default 0
             * @public
             */
            this.y2 = 0;

            this.setTo(x1, y1, x2, y2);
        },

        length: {
            /**
             * 선의 길이
             *
             * @property length
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                Math.sqrt((this.x2 - this.x1) * (this.x2 - this.x1) + (this.y2 - this.y1) *(this.y2 - this.y1));
            }
        },

        angle: {
            /**
             * 선의 각도(라디안)
             * Math.atan2(y, x)
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return Math.atan2(this.y2 - this.y1, this.x2 - this.x1);
            }
        },

        slope: {
            /**
             * 선의 기울기
             * y의 증가량 / x의 증갈야 (y/x)
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return (this.y2 - this.y1) / (this.x2 - this.x1);
            }
        },

        perpSlope: {
            /**
             * 선의 90도로 교차하는 기울기
             *
             * @property angle
             * @type {Number}
             * @readyOnly
             * @public
             */
            get: function() {
                return -((this.x2 - this.x1) / (this.y2 - this.y1));
            }
        },

        yIntercept: {
            /**
             * 선의 y 절편
             * y = ax + b 에서 b가 절편
             *
             * @property yIntercept
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return (this.y1 - this.slope * this.x1);
            }
        },

        /**
         * Line 객체의 좌표를 설정한다.
         *
         * @method setTo
         * @param x1 시작 x좌표
         * @param y1 시작 y좌표
         * @param x2 끝 x 좌표
         * @param y2 끝 y 좌표
         * @return {adun.Geom.Line}
         * @public
         */
        setTo: function(x1, y1, x2, y2) {
            this.x1 = x1 || 0;
            this.y1 = y1 || 0;
            this.x2 = x2 || 0;
            this.y2 = y2 || 0;

            return this;
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Line 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Line] {adun.Geom.Line}
         * @return {adun.Geom.LIne}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Line(); }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        /**
         * 다른 Line 객체의 프로퍼티 값을 이 Line 객체로 복사한다.
         *
         * @param source {adun.Geom.Line}
         * @return {adun.Geom.Line}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x1, source.y1, source.x2, source.y2);
        },

        /**
         * 이 Line 객체의 프로퍼티 값을 파라미터로 받은 Line 객체에 복사하여 반환한다.
         *
         * @param target {adun.Geom.Line} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Line}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 한 점이 무한한 선 위에있는지 체크한다.
         *
         * @method isPointOnLine
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnLine: function(x, y) {
            // Gradient
            // 참고: http://www.teacherschoice.com.au/Maths_Library/Gradient/gradient_-_two_fixed_points.htm
            // (this.y2 - this.y1) / (this.x2 - this.x1) === (y - this.y1) / (x - this.x1); 에 대한 곱셈표현과 동치. (x,y) 에 대해서 대상 직선의 증분값이 적용되는지 비교하는 식
            // 나눗셈으로 할경우  precision로 인해 truncation 오류 발생 가능성
            return (x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1);
        },

        /**
         * 한 점이 두개의 지정한 위치 사이의 선 위에있는지 체크한다.
         *
         * @method isPointOnLineSegment
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnLineSegment: function(x, y) {
            var xMin = Math.min(this.x1, this.x2);
            var xMax = Math.max(this.x1, this.x2);
            var yMin = Math.min(this.y1, this.y2);
            var yMax = Math.max(this.y1, this.y2);

            return this.isPointOnLine(x, y) && (x >= xMin && x <= xMax) && (y >= yMin && y <= yMax);
        },

        /**
         * 무한한 두 선이 충돌하는지 검사한다.
         *
         * @method intersectLineLine
         * @param line {adun.Geom.Line}
         * @return {adun.Geom.IntersectResult} IntersectResult는 충돌 정보를 포함한다.
         * @public
         */
        intersectLineLine: function(line) {
            return adun.Geom.Intersect.lineToLine(this, line);
        },

        /**
         * 선에서 주어진 한 지점을 통과하는 직선(perpendicular)을 반환한다.
         *
         * @param x
         * @param y
         * @param output
         * @returns {*}
         */
        perp: function(x, y, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Line(); }

            // 만약 현재 선이 수평선이라면 수직선을 반환한다.
            if( this.y1 === this.y2 ) {
                output.setTo(x, y, x, this.y1);
                return output;
            }

            // 만약 현재 선이 수직선이라며 수평선을 반환한다.
            if( this.x1 === this.x2 ) {
                output.setTo(x, y, this.x1, y);
                return output;
            }

            var pt, yInt = (y - this.perpSlope * x);       // y절편: y = ax + b -> b = y - ax

            if( x !== 0 ) {
                pt = this.intersectLineLine({x1: x, y1: y, x2: 0, y2: yInt});
            } else {
                pt = this.intersectLineLine({x1: x, y1: y, x2: 1, y2: yInt + this.perpSlope});
            }

            output.setTo(x, y, pt.x, pt.y);

            return output;
        },

        draw: function(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
            return this;
        },
    });
})();

// #Ray
/**
 * Ray
 * 광선
 * Ray(광선) 객체는 시작지점으로부터 한 방향으로 무한히 뻗어나간다.
 *
 * @Class Ray
 * @namespace Adun.Geom
 * @constructor
 * @param [x1=0] {Number} 광선의 시작 x 좌표
 * @param [y1=0] {Number} 광선의 시작 y 좌표
 * @param [x2=0] {Number} 광선의 끝 x 좌표 -> 방향계산에 사용되므로, 진짜 끝을 의미하지는 않는다.
 * @param [y2=0] {Number} 광선의 끝 y 좌표 -> 방향계산에 사용되므로, 진짜 끝을 의미하지는 않는다.
 * @return {adun.Geom.Ray} Ray object
 */
(function() {
    'use strict';
    var Ray = adun.Geom.Ray = adun.Class({
        extend: adun.Geom.Line,
        TYPE: 'Ray',

        init: function(x1, y1, x2, y2) {
            this.super(x1, y1, x2, y2);
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Ray 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Ray] {adun.Geom.Ray}
         * @return {adun.Geom.Ray}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new Ray(); }

            return output.setTo(this.x1, this.y1, this.x2, this.y2);
        },

        /**
         * 한 점이 광선 위에있는지 체크한다.
         *
         * @method isPointOnRay
         * @param x {Number}
         * @param y {Number}
         * @return {Boolean}
         * @public
         */
        isPointOnRay: function(x, y) {
            // Gradient
            // 참고: http://www.teacherschoice.com.au/Maths_Library/Gradient/gradient_-_two_fixed_points.htm
            // (this.y2 - this.y1) / (this.x2 - this.x1) === (y - this.y1) / (x - this.x1); 에 대한 곱셈표현과 동치. (x,y) 에 대해서 대상 직선의 증분값이 적용되는지 비교하는 식
            // 나눗셈으로 할경우  precision로 인해 truncation 오류 발생 가능성
            if( (x - this.x1) * (this.y2 - this.y1) === (this.x2 - this.x1) * (y - this.y1) ) {
                // 각도를 비교한다.
                if( Math.atan2(y - this.y1, x - this.x1) == Math.atan2(this.y2 - this.y1, this.x2 - this.x1)) {
                    return true;
                }
            }

            return false;
        }
    });
})();

// #Rectangle
/**
 * Rectangle
 * 사각형
 * Rectangle 객체는 top-left 위치(x, y)와 넓이, 높이를 가진다.
 *
 * @Class Rectangle
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} top-left의 x 좌표
 * @param [y=0] {Number} top-left의 y 좌표
 * @param [width=0]{Number} 사각형의 넓이
 * @param [height=0]{Number} 사각형의 높이
 * @return {adun.Geom.Rectangle} Rectangle object
 */
(function() {
    'use strict';

    var Rectangle = adun.Geom.Rectangle = adun.Class({
        TYPE: 'Rectangle',

        init: function(x, y, width, height) {

            /**
             * top-left의 x 좌표
             *
             * @property x
             * @type {Number}
             * @default 0
             * @public
             */
            this.x = 0;

            /**
             * top-left의 y 좌표
             *
             * @property y
             * @type {Number}
             * @default 0
             * @public
             */
            this.y = 0;

            /**
             * 사각형의 넓이
             *
             * @property width
             * @type {Number}
             * @default 0
             * @public
             */
            this.width = 0;

            /**
             * 사각형의 높이
             *
             * @property height
             * @type {Number}
             * @default 0
             * @public
             */
            this.height = 0;

            this.setTo(x, y, width, height);
        },

        bottom: {
            get: function() {
                return this.y + this.height;
            },
            /**
             * bottom
             * 사각형의 y좌표 값과 넓이의 '합' 이다.
             * bottom 프로퍼티값을 바꾸는것은 사각형 객체의 높이를 바꾸며, 사각형 객체의 x,y 좌표값에는 아무런 영향을 끼치지 않는다.
             *
             * @property bottom
             * @type {Number}
             * @public
             */
            set: function(height) {
                if( value ) {
                    if( value < this.y) {
                        this.height = 0
                    } else {
                        this.height = value;
                    }
                }
            }
        },

        bottomRight: {
            get: function() {
                var output = new adun.Geom.Point();
                return output.setTo(this.right, this.bottom);
            },
            /**
             * bottomRight
             * 사각형의 bottom-right 좌표
             * 매개변수의 x, y값에 의해 설정된다.
             *
             * @property bottomRIght
             * @type {adun.Geom.Point}
             * @public
             */
            set: function(value) {
                if( value ) {
                    this.right = value.x;
                    this.bottom = value.y;
                }
            }

        },

        center: {
            /**
             * center
             * 사각형의 중심 좌표값이다.
             *
             * @property center
             * @type {adun.Geom.Point}
             * @readOnly
             * @public
             */
            get: function() {
                var output = new adun.Geom.Point();
                return ouput.setTo(Math.round(this.width / 2), Math.round(this.height / 2));
            }
        },

        left: {
            get: function() {
                return this.x;
            },
            /**
             * left
             * 사각형의 top-left의 x 좌표
             * left값을 바꾸는 것은 y와 높이의 값는 영향을 끼치지 않으며,
             * 넓이에는 영향을 준다
             * 그러나 x좌표 값을 바꾸는 넓이에 영향을 끼치지 않는다.
             *
             * @property left
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value ) {
                    var diff = this.x - value;
                    if( this.width + diff < 0 ) {
                        this.width = 0;
                        this.x = value;
                    } else {
                        this.width += diff;
                        this.x = value;
                    }
                }
            }
        },

        right: {
            get: function() {
                return this.x + this.width;
            },
            /**
             * right
             * x좌표값와 넓이의 '합'
             * right값을 바꾸는 것은 x,y와 높이의 값는 영향을 끼치지 않으며,
             * 넓이에는 영향을 준다
             * 그러나 x좌표 값을 바꾸는 넓이에 영향을 끼치지 않는다.
             *
             * @property right
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value ) {
                    if( value < this.x ) {
                        this.width = 0;
                    } else {
                        this.width = value - this.x;
                    }
                }
            }
        },

        size: {
            /**
             * size
             * 사각형 객체의 사이즈다
             * 넓이와 높이를 가진 포인트 객체가 반환된다.
             *
             * @property size
             * @type {adun.Geom.Point}
             * @public
             */
            get: function() {
                var output = new adun.Geom.Point();
                return output.setTo(this.width, this.height);
            }
        },

        volume: {
            /**
             * volume
             * 사각형 객체의 부피
             * width * height
             *
             * @property volume
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return this.width * this.height;
            }
        },

        perimeter: {
            /**
             * perimeter
             * 사각형의 둘레
             * 4변 길이의 합
             *
             * @property volume
             * @type {Number}
             * @readOnly
             * @public
             */
            get: function() {
                return (this.width * 2) + (this.height * 2);
            }
        },

        top: {
            get: function() {
                return this.y;
            },
            /**
             * top
             * 사각형의 top-left의 y 좌표
             * top값을 바꾸는 것은 x와 넓이의 값는 영향을 끼치지 않으며,
             * 높이에는 영향을 준다
             * 그러나 y좌표 값을 바꾸는 것은 높이에 영향을 끼치지 않는다.
             *
             * @property top
             * @type {Number}
             * @public
             */
            set: function(value) {
                if( value ) {
                    var diff = this.y - value;
                    if( this.height + diff < 0 ) {
                        this.height = 0;
                        this.y = value;
                    } else {
                        this.height += diff;
                        this.y = value;
                    }
                }
            }
        },

        topLeft: {
            get: function() {
                var output = new adun.Geom.Point();
                return ouput.setTo(this.x, this.y);
            },
            /**
             * top
             * 사각형의 top-left의 x,y 좌표
             *
             * @property topLeft
             * @type {adun.Geom.Point}
             * @public
             */
            set: function(value) {
                if( value ) {
                    this.x = value.x;
                    this.y = value.y;
                }
            }
        },

        /**
         * Rectangle 객체의 좌표를 설정한다.
         *
         * @method setTo
         * @param [x=0] {Number} top-left의 x 좌표
         * @param [y=0] {Number} top-left의 y 좌표
         * @param [width=0]{Number} 사각형의 넓이
         * @param [height=0]{Number} 사각형의 높이
         * @return {adun.Geom.Rectangle}
         * @public
         */
        setTo: function(x, y, width, height) {
            if( !isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height) ) {
                this.x = x;
                this.y = y;
                if( width >= 0 ) {
                    this.width = width;
                }
                if( height >= 0 ) {
                    this.height = height;
                }
            }

            return this;
        },

        /**
         * 같은 프로퍼티 x, y, width, height 값을 가진 새로운 Rectangle 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Rectangle] {adun.Geom.Rectangle}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Rectangle(); }

            return output.setTo(this.x, this.y, this._daimater);
        },

        /**
         * 이 Rectangle 객체의 프로퍼티 값을 파라미터로 받은 Rectangle 객체로부터 복사한다.
         *
         * @mthod copyFrom
         * @param source
         * @returns {*|adun.Geom.Rectangle}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source,x, source.y, source.width, source.height);
        },

        /**
         * 이 Rectangle 객체의 프로퍼티 값을 파라미터로 받은 Rectangle 객체에 복사하여 파라미터로 받은 Rectangle 객체를 반환한다.
         *
         * @method copyTo
         * @param target {adun.Geom.Rectangle} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Circle}
         * @public
         */
        copyTo: function(target) {
            if( adun.isUndefined(target) ) { target = new adun.Geom.Rectangle(); }
            return target.copyFrom(this);
        },

        /**
         * 지정한 좌표가 이 Rectangle 객체의 내에 포함되어 있는지 여부를 확인한다.
         *
         * @method contains
         * @param x {Number} 검사할 x좌표
         * @param y {Number} 검사할 y좌표
         * @reutn {Boolean}
         * @public
         */
        contains: function(x, y) {
            return x >= this.x && x <= this.right && y >= this.y && y<= this.bottom;
        },

        /**
         * 지정한 포인트가 이 Rectangle 객체의 내에 포함되어 있는지 여부를 확인한다.
         *
         * @method containsPoint
         * @param {adun.Geom.Point} 검사할 x좌표
         * @reutn {Boolean}
         * @public
         */
        containsPoint: function(point) {
            return this.contains(point.x, point.y);
        },

        /**
         * 지정한 한 Rectangle 객체가 이 Rectangle 객체의 내에 포함되어 잇는지 여부를 확인한다.
         *
         * @method containsRect
         * @param rect {adun.Geom.Rectangle}
         * @returns {boolean}
         * @publice
         */
        containsRect: function(rect) {
            if( rect.volume > this.volume ) {
                return false;
            }

            return rect.x >= this.x && rect.y >= this.y && rect.right <= this.right && rect.bottom <= this.bottom;
        },

        /**
         * 두 Rectanlge 객체의 프로퍼티 값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Rectangle}
         * @returns {boolean}
         * @public
         */
        equals: function(toCompare) {
            return this.x == toCompare.x && this.y == toCompare.y && this.width == toCompare.width && this.height == toCompare.height;
        },

        /**
         * infalte(=부풀리다)
         * Rectangle 객체의 크기를 지정된 크기만큼 증감시킨다.
         *
         * Rectangle 객체의 center point는 변함없다.
         * dx값에 의해 left와 right 크기가 증감한다.
         * dy값에 의해 top과 bottom 크기가 증감한다.
         *
         * @method inflate
         * @param dx {Number}
         * @param dy {Number}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        inflate: function(dx, dy) {
            if( !isNaN(dx) && !isNaN(dy) ) {
                this.x -= dx;
                this.width += 2 * dx;
                this.y -= dy;
                this.height += 2 * dy;
            }

            return this;
        },

        /**
         * inflte() 메서드에서 파라미터로 Point를 받는다.
         *
         * @method inflatePoint
         * @param point {adun.Geom.Point}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        inflatePoint: function(point) {
            return this.inflate(point.x, point.y);
        },

        /**
         * 매개변수로 받은 toIntersect가이 Rectangle 객체와 교차(충돌)하는지 검사한다.
         * 이 메서드는 지정된 Rectangle 객체와 이 Rectangle 객체와 교차하는지 x, y, 너비, 높이 프로퍼티값을 비교한다.
         *
         * @method intersects
         * @param toIntersect {adun.Geom.Rectangle}
         * @return {Boolean{
         * @public
         */
        intersects: function(toIntersect) {
            if( toIntersect.x > this.right - 1 ) {
                return false;
            }
            if( toIntersect.right -1 < this.x ) {
                return false;
            }
            if( toIntersect.bottom - 1 < this.y ) {
                return false;
            }
            if( toIntersect.y > this.bottom - 1 ) {
                return false;
            }

            return true;
        },

        /**
         * 만약 매개변수로 받은 Rectangle 객체가 이 Rectangle 객체와 교차(충돌)한다면
         * 교차하는 영역의 새로운 Rectangle 객체를 반환한다.
         * 만약 교차하지 않는다면 프로퍼티값을 0으로 가진 빈 Rectangle 객체를 반환한다.
         *
         * @method intersection
         * @param toIntersect {adun.Geom.Rectangle}
         * @param [output] {adun.Geom.Rectangle}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        intersection: function(toIntersect, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Rectangle(); }

            if( this.intersects(toIntersect) == true ) {
                output.x = Math.max(toIntersect.x, this.x);
                output.y = Math.max(toIntersect.y, this.y);
                output.width = Math.min(toIntersect.right, this.right) - output.x;
                output.height = Math.min(toIntersect.bottom, this.bottom) - output.y;
            }

            return output;
        },

        /**
         * 이 Rectangle 객체가 empty(비어있는지)인지 반환한다.
         *
         * @method isEmpty
         * @returns {Boolean}
         * @public
         */
        isEmpty: function() {
            return this.width < 1 || this.height < 1;
        },

        /**
         * 이 Rectangle 객체와 매개변수로 받은 Rectangle 사이의 중복을 검사하여 각각의 프로퍼티에 부울값을 가진 객체를 반환합니다.
         *
         * @method overlap
         * @param rect {adun.Geom.Recangle}
         * @return {{top: boolean, bottom: boolean, left: boolean, right: boolean, contains: boolean, contained: boolean}}
         * @public
         */
        overlap: function(rect) {
            var result = { top: false, bottom: false, left: false, right: false, contains: false, contained: false };
            var interRect = this.intersection(rect);

            if( interRect.isEmpty() ) {
                return result;
            }

            if( interRect.containsRect(rect) ) {
                result.contains = true;
            }

            if( rect.containsRect(this) ) {
                result.contained = true;
            }

            if( this.top < rect.top ) {
                result.top = true;
            }

            if( this.bottom < rect.bottom ) {
                result.bottom = true;
            }

            if( this.left < rect.left ) {
                result.left = true;
            }

            if( this.right > rect.right ) {
                result.right = true;
            }

            return result;
        },

        /**
         * 지정된 크기만큼 Rectangle 객체의 위치를 조정합니다.
         *
         * @method offset
         * @param dx {Number} Moves the x value of the Rectangle object by this amount
         * @param dy {Number} Moves the y value of the Rectangle object by this amount
         * @return {adun.Geom.Rectangle}
         * @public
         */
        offset: function(dx, dy) {
            if( !isNaN(dx) && !isNaN(dy) ) {
                this.x += dx;
                this.y += dy;
            }

            return this;
        },

        /**
         * 지정된 포인트의 크기만큼 Rectangle 객체의 위치를 조정합니다.
         *
         * @method offsetPoint
         * @param point {adun.Geom.Point}
         * @return {adun.Geom.Rectangle}
         * @public
         */
        offsetPoint: function(point) {
            return this.offset(point.x, point.y);
        },

        /**
         * Rencatngle 객체의 모든 프로퍼티 값을 0으로 설정합니다.
         *
         * @method setEmpty
         * @return {adun.Geom.Rectangle}
         * @public
         */
        setEmpty: function() {
            return this.setTo(0, 0, 0, 0);
        },

        /**
         * 매개변수로 받은 Rectangle 객체와 합집합으로 하여 새로운 Rectangle 객체를 반환합니다.
         * 두개의 사각형 사이의 수직 수평공간을 채움으로써 새로운 사각형 객체를 반환합니다.
         *
         * @param toUnion
         * @param output
         * @returns {*|adun.Geom.Circle|adun.Geom.Line|adun.Geom.Rectangle|Kiwi.Geom.Circle|Kiwi.Geom.Line}
         */
        union: function(toUnion, output) {
            if( adune.isUndefined(output) ) { output = new adun.Geom.Rectangle(); }

            return output.setTo(Math.min(toUnion.x, this.x), Math.min(toUnion.y, this.y), Math.max(toUnion.right, this.right), Math.max(toUnion.bottom, this.bottom));
        },

        scale: function() {
            // 트랜스폼
        }




    });
})();

// #Point
/**
 * Point
 * 포인트(요점)
 *
 * 수평축을 나타내는 x, 수직 축을 나타내는 y등 2차원 좌표계에서 위치를 나타낸다.
 *
 * @Class Point
 * @namespace Adun.Geom
 * @constructor
 * @param [x=0] {Number} x 좌표
 * @param [y=0] {Number} y 좌표
 * @return {adun.Geom.Point}
 */
(function() {
    'use strict';
    var Point = adun.Geom.Point = adun.Class({
        'TYPE': 'Point',

        init: function(x, y) {

            this.setTo(x, y);

        },

        /**
         * x값과 y값을 설정한다.
         *
         * @method setTo
         * @param x {Number}
         * @param y {Number}
         * @returns {adun.Geom.Point}
         */
        setTo: function(x, y) {
            this.x = x || 0;
            this.y = y || 0;

            return this;
        },

        /**
         * 극좌표의 한쌍을 데카르트 포인트 좌표계로 전환시킨다음 포인스인스턴스에 설정한다.
         * 극좌표: 평면상의 점을 원점으로부터의 거리 r과 시작선과의 이루는 각 θ로 나타내는 방법
         * 데크르트 좌표: 세 개의 축(일반적으로 X, Y, Z축)을 이용한 좌표계에서 공간상의 한 지점의 위치를 나타내는 좌표
         *
         * @mehtod polar
         * @param distance {Number}
         * @param angle {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        polar: function(distance, angle) {
            this.x = distance * Math.cos(angle);
            this.y = distance * Math.sin(angle);

            return this;
        },

        /**
         * 매개변수로 받은 포인트 객체와 이 포인트 갭체를 '합'한 새로운 포인트 객체를 반환한다.
         *
         * @method add
         * @param toAdd {adun.Geom.Point}
         * @param output {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        add: function(toAdd, output) {
            if( adun.isUndefined(ouput) ) { output = new adun.Geom.Point(); }

            return output.setTo(this.x + toAdd.x, this.y + toAdd.y);
        },

        /**
         * 주어진 좌표를 더한다.
         *
         * @method addTo
         * @param x {Number}
         * @param y {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        addTo: function(x, y) {
            if( adun.isUndefined(x) ) { x = 0; }
            if( adun.isUndefined(y) ) { y = 0; }

            return this.setTo(this.x + x, this.y + y);
        },

        /**
         * 매개변수로 받은 포인트 객체와 이 포인트 갭체를 '차'한 새로운 포인트 객체를 반환한다.
         *
         * @method subtract
         * @param point {adun.Geom.Point}
         * @param output {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        subtract: function(point, output) {
            if( adun.isUndefined(ouput) ) { output = new adun.Geom.Point(); }

            return output.setTo(this.x + point.x, this.y + point.y);
        },

        /**
         * 주어진 좌표를 뺀다.
         *
         * @method subtractFrom
         * @param x {Number}
         * @param y {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        subtractFrom: function(x, y) {
            if( adun.isUndefined(x) ) { x = 0; }
            if( adun.isUndefined(y) ) { y = 0; }

            return this.setTo(this.x - x, this.y - y);
        },

        /**
         * invert(뒤집다)
         * x, y값을 뒤집는다.
         *
         * @mthod invert
         * @return {adun.Geom.Point}
         * @public
         */
        invert: function() {
            return this.setTo(this.y, this.x);
        },

        /**
         * 매개변수로 받은 min, max사이의 값으로 x,y 값을 고정시킨다.
         *
         * @method clamp
         * @param min {Number}
         * @param max {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        clamp: function(min, max) {
            this.clampX(min, max);
            this.clampY(min, max);

            return this;
        },

        /**
         * 매개변수로 받은 min, max사이의 값으로 x값을 고정시킨다.
         *
         * @method clampX
         * @param min {Number}
         * @param max {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        clampX: function(min, max) {
            this.x = Math.max(Math.min(this.x, max), min);

            return this;
        },

        /**
         * 매개변수로 받은 min, max사이의 값으로 y값을 고정시킨다.
         *
         * @method clampX
         * @param min {Number}
         * @param max {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        clampY: function(min, max) {
            this.y = Math.max(Math.min(this.y, max), min);

            return this;
        },

        /**
         * 같은 프로퍼티 값을 가진 새로운 Point 객체를 반환한다.
         *
         * @method clone
         * @param [output=adun.Geom.Point] {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        clone: function(output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.Point(); }

            return output.setTo(this.x, this.y);
        },

        /**
         * 다른 Point 객체로부터 프로퍼티 x, y값을 이 Point 객체로 복사한다.
         *
         * @method copyFrom
         * @param source {adun.Geom.Point}
         * @return {adun.Geom.Point}
         * @public
         */
        copyFrom: function(source) {
            return this.setTo(source.x, source.y);
        },

        /**
         * 이 Point 객체의 프로퍼티 값을 파라미터로 받은 Point 객체에 복사하여 파라미터로 받은 Point 객체를 반환한다.
         *
         * @param target {adun.Geom.Point} this 객체를 복사하여 반환할 객체
         * @return {adun.Geom.Point}
         * @public
         */
        copyTo: function(target) {
            return target.copyFrom(this);
        },

        /**
         * 현재 Point 객체로부터 주어진 Point 객체의 각도를 반환한다.
         *
         * @method angleTo
         * @param target {adun.Geom.Point}
         * @return {number} angle to point
         */
        angleTo: function(target) {
            return Math.atan2(target.y - this.y, target.x - this.x);
        },

        /**
         * 현재 Point 객체로부터 주어진 X,Y좌표의 각도를 반환한다.
         *
         * @method angleTo
         * @param x {Number}
         * @param y {Number}
         * @return {number} angle to point
         */
        angleToXY: function(x, y) {
            return Math.atan2(y - this.y, x - this.x);
        },

        /**
         * 현재 Point 객체로부터 주어진 Point 객체 까지의 거리를 반환한다.
         *
         * @method distanceTo
         * @param target {adun.Geom.Point}
         * @param [round=false] {boolean} Round the distance to the nearest integer (default false)
         * @return {number} angle to point
         */
        distanceTo: function(target, round) {
            if( adun.isUndefined(round) ) { round = false; }

            var dx = this.x - target.x;
            var dy = this.y - target.y;

            if( round ) {
                return Math.round(Math.sqrt(dx * dx, dy * dy));
            }

            return Math.sqrt(dx * dx, dy * dy);
        },

        /**
         * 현재 Point 객체로부터 주어진 XY좌표 까지의 거리를 반환한다.
         *
         * @method distanceTo
         * @param x {Number}
         * @param y {Number}
         * @param [round=false] {boolean} Round the distance to the nearest integer (default false)
         * @return {number} angle to point
         */
        distanceToXY: function(x, y, round) {
            if( adun.isUndefined(round) ) { round = false; }

            var dx = this.x - x;
            var dy = this.y - y;

            if( round ) {
                return Math.round(Math.sqrt(dx * dx, dy * dy));
            }

            return Math.sqrt(dx * dx, dy * dy);
        },

        /**
         * 두 Point 객체사이의 거리가 두 번째 매개변수의 값보다 같거나 큰지 반환한다.
         *
         * @method distanceCompare
         * @param target {adun.Geom.Point}
         * @param distance {Number}
         * @return {Boolean}
         */
        distanceCompare: function(target, distance) {
            return this.distanceTo(target) >= distance;
        },

        /**
         * 파라미터로 받은 Point 객체와 프로퍼티 x, y값이 같은지 비교한다.
         *
         * @method equals
         * @param toCompare {adun.Geom.Point}
         * @return {Boolean}
         * @public
         */
        equals: function(toCompare) {
            return this.x === toCompare.x && this.y === toCompare.y;
        },

        /**
         * 주어진 값만큼 좌표를 조정한다.
         *
         * @method offset
         * @param dx {Number}
         * @param dy {Number}
         * @return {adun.Geom.Point}
         * @public
         */
        offset: function(dx, dy) {
            this.x += dx;
            this.y += dy;

            return this;
        },

        getCSS: function() {
            return this.x + 'px ' + this.y + 'px';
        }
    });

    /**
     * 두 Point 객체간의 거리를 반환한다.
     *
     * @method distanceBetween
     * @param pointA {adun.Geom.Point} The first Point object.
     * @param pointB {adun.Geom.Point} The second Point object.
     * @param [round=false] {boolean} Round the distance to the nearest integer (default false)
     * @return {Number} The distance between the two Point objects.
     * @static
     */
    Point.distanceBetween = function(pointA, pointB, round) {
        if( adun.isUndefined(round) ) { round = false; }

        var dx = pointA.x - pointB.x;
        var dy = pointA.y - pointB.y;

        if( round ) {
            return Math.round(Math.sqrt(dx * dx, dy * dy));
        }

        return Math.sqrt(dx * dx, dy * dy);
    };


    /**
     * 극좌표의 한쌍을 데카르트 포인트 좌표계로 전환시킨다음 t새로운 포인트 인스턴스에 설정한다음 반환한다.
     * 극좌표: 평면상의 점을 원점으로부터의 거리 r과 시작선과의 이루는 각 θ로 나타내는 방법
     * 데크르트 좌표: 세 개의 축(일반적으로 X, Y, Z축)을 이용한 좌표계에서 공간상의 한 지점의 위치를 나타내는 좌표
     *
     * @mehtod polar
     * @param distance {Number}
     * @param angle {Number}
     * @return {adun.Geom.Point}
     * @static
     */
    Point.polar = function(length, angle) {
        return new Point(length * Math.cos(angle), length * Math.sin(angle));
    };

    /**
     * interpolation(보간): 두 점을 연결하는 방법을 의미한다.
     * 선형 보간법(線形補間法, linear interpolation)은 끝점의 값이 주어졌을 때 그 사이에 위치한 값을 추정하기 위하여 직선 거리에 따라 선형적으로 계산하는 방법이다.
     * 선형 보간법은 1차원 직선상에서 이루어지는 보간법이다.
     *
     * 지정한 두 Point 객체 사이의 부분을 반환한다..
     * 매개변수 f는 pointA와 pointB로 지정된 위치에 상대적으로 어디에 위치잘히를 결정한다.
     *
     * 매개변수 f값은 0 ~ 1 이다.
     * 1에 가까울수록 pointA에 가깝다.
     * 0에 가까울수록 pointB에 가깝다.
     *
     *
     * @method interpolate
     * @param pointA {adun.Geom.Point}
     * @param pointB {adun.Geom.Point}
     * @param f {Number} 두점 사이의 보간 수준이다. 새로운지점과, pt1, pt2, 사이의 선을 따를것이다 만약 f=1이면 pointA가 반환되고 f=0이며 fointB가 반환된다.
     * @return {adun.Geom.Point}
     * @static
     */
    Point.interpolate = function(pointA, pointB, f) {
        var xDiff = pointB.x - pointA.x;
        var yDiff = pointB.y - pointA.y;

        return new adun.Geom.Point(pointB.x - xDiff * f, pointB.y - yDiff * f);
    }

})();
// #Intersect
/**
 * Intersect
 * 교차하다: 충돌
 * 기하학 객체사이의 교차(충돌)를 판정하는 스태틱 메서드 컬레션들을 포함한다.
 *
 * @Class Intersect
 * @namespace adun.Geom
 * @static
 */
(function() {
    'use strict';

    var Intersect = adun.Class({
        'TYPE': 'Intersect',


        /**
         * -------------------------------------------------------------------------------------------------------------
         * Distance (길이)
         * -------------------------------------------------------------------------------------------------------------
         */

        /**
         * 지정한 두 좌표 사이 거리를 반환한다.
         *
         * @method distance
         * @param x1 첫번째 좌표의 x 위치
         * @param y1 첫번째 좌표의 y 위치
         * @param x2 두번째 좌표의 x 위치
         * @param y2 두번째 좌표의 y 위치
         * @return {number}
         * @public
         * @static
         */
        distance: function(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
        },

        /**
         * 지정한 두 좌표 사이 거리의 제곱을 반환한다.
         *
         * @method distance
         * @param x1 첫번째 좌표의 x 위치
         * @param y1 첫번째 좌표의 y 위치
         * @param x2 두번째 좌표의 x 위치
         * @param y2 두번째 좌표의 y 위치
         * @return {number}
         * @public
         * @static
         */
        distanceSquared: function(x1, y1, x2, y2) {
            return (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
        },


        /**
         * -------------------------------------------------------------------------------------------------------------
         * Lines (선)
         * -------------------------------------------------------------------------------------------------------------
         */

        /**
         * 어떠한 두 직선이 한 지점에서 교차(충돌)했는지 검사한다.
         * 두선 모두 무한히 뻗어나가는 선이라 가정한다.
         *
         * @method lineToLine
         * @param line1 {adun.Geom.Line} 첫번째 직선
         * @param line2 {adun.Geom.Line] 두번째 직선
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToLine: function(line1, line2, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            /*
             http://blog.naver.com/PostView.nhn?blogId=tobsysco&logNo=90189606643&beginTime=0&jumpingVid=&from=search&redirect=Log&widgetTypeCall=true
             */

            // 직선 A는 서로 다른 두 점 (line1.x1, line1.y1)(line1.x2, line1.y2)을 지나고, 직선 B는 서로 다른 두 점(line2.x1, line2.y1)(line2.x2, line2.y2)를 지날 때,
            // (line1.y2 - line1.y1) / (line1.x2 - line1.x1) === (line2.y2 - line2.y1) / (line2.x2 - line2.x1) 이면 '기울기'가 같으므로 '평행' 또는 '일치'이다.
            // 위는 (line2.x2 - line2.x1) * (line1.y2 - line1.y1) === (line1.x2 - line1.x1) *(line2.y2 - line2.y1) 로 표현할 수 있다.
            // => (line2.x2 - line2.x1) * (line1.y2 - line1.y1) - (line1.x2 - line1.x1) *(line2.y2 - line2.y1) == 0
            // => denominator(분모) = (line2.x2 - line2.x1) * (line1.y2 - line1.y1) - (line1.x2 - line1.x1) *(line2.y2 - line2.y1)

            // => 다음 사이트의 공식으로 교차점을 구할 수 있다. http://zetawiki.com/wiki/%EB%91%90_%EC%A7%81%EC%84%A0%EC%9D%98_%EA%B5%90%EC%B0%A8%EC%A0%90#cite_note-same_m-1

            //
            // 분모
            var denom = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);

            // den == 0 일 경우 평행선이므로 교차하지 않는다.
            if( denom !== 0 ) {
                output.result = true;
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.x1 - line2.x2) - (line1.x1 - line1.x2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 * line2.y2 - line2.y1 * line2.x2)) / denom;
            }

            return output;
        },

        /**
         * 직선과 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineToSegment
         * @param line1 {adun.Geom.Line} 첫번째 선(직선)
         * @param seg {adun.Geom.Line] 두번째 선(선분)
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToSegment: function(line1, seg, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            var denom = (line1.x1 - line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 - seg.x2);

            if( denom !== 0 ) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.x1 - seg.x2) - (line1.x1 - line1.x2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (seg.y1 - seg.y2) - (line1.y1 - line1.y2) * (seg.x1 * seg.y2 - seg.y1 * seg.x2)) / denom;

                var maxX = Math.max(seg.x1, seg.x2);
                var minX = Math.min(seg.x1, seg.x2);
                var maxY = Math.max(seg.y1, seg.y2);
                var minY = Math.min(seg.y1, seg.y2);

                if( output.x <= maxX && output.x >= minX && output.y <= maxY && output.y >= minY ) {
                    output.result = true;
                }
            }

            return output;
        },

        /**
         * 직선과 지정한 좌표의 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineToRawSegment
         * @param line {adun.Geom.Line} 첫번째 선(직선)
         * @param x1 {adun.Geom.Line] 선분의 시작 x좌표
         * @param y1 {adun.Geom.Line] 선분의 시작 y좌표
         * @param x2 {adun.Geom.Line] 선분의 끝 x좌표
         * @param y2 {adun.Geom.Line] 선분의 끝 y좌표
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToRawSegment: function(line1, x1, y1, x2, y2, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            var denom = (line1.x1 - line1.x2) * (y1 - y2) - (line1.y1 - line1.y2) * (x1 - x2);

            if( denom !== 0 ) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (x1 - x2) - (line1.x1 - line1.x2) * (x1 * y2 - y1 * x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (y1 - y2) - (line1.y1 - line1.y2) * (x1 * y2 - y1 * x2)) / denom;

                var maxX = Math.max(x1, x2);
                var minX = Math.min(x1, x2);
                var maxY = Math.max(y1, y2);
                var minY = Math.min(y1, y2);

                if( output.x <= maxX && output.x >= minX && output.y <= maxY && output.y >= minY ) {
                    output.result = true;
                }
            }

            return output;
        },

        /**
         * 선분과 지정한 좌표의 선분이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToRawSegment
         * @param line {adun.Geom.Line} 첫번째 선(선분)
         * @param x1 {adun.Geom.Line] 선분의 시작 x좌표
         * @param y1 {adun.Geom.Line] 선분의 시작 y좌표
         * @param x2 {adun.Geom.Line] 선분의 끝 x좌표
         * @param y2 {adun.Geom.Line] 선분의 끝 y좌표
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineSegmentToRawSegment: function(line, x1, y1, x2, y2, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output = adun.Geom.Intersect.lineToRawSegment(line, x1, y1, x2, y2, output);

            var maxX = Math.max(line.x1, line.x2);
            var minX = Math.min(line.x1, line.x2);
            var maxY = Math.max(line.y1, line.y2);
            var minY = Math.min(line.y1, line.y2);

            if( output.x <= maxX && output.x >= minX && output.y <= maxY && output.y >= minY ) {
                output.result = true;
                return output;
            }

            ouput.result = false;
            return output;
        },

        /**
         * 직선과 광선이 한 지점에서 교차(충돌)했는지 검사한다.
         *
         * @method lineSegmentToRawSegment
         * @param line {adun.Geom.Line} 직선
         * @param ray {adun.Geom.Ray] 광선
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToRay: function(line1, ray, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            var denom = (line1.x1 - line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 - ray.x2);

            if (denom !== 0) {
                output.x = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.x1 - ray.x2) - (line1.x1 - line1.x2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.y = ((line1.x1 * line1.y2 - line1.y1 * line1.x2) * (ray.y1 - ray.y2) - (line1.y1 - line1.y2) * (ray.x1 * ray.y2 - ray.y1 * ray.x2)) / denom;
                output.result = true; // true unless either of the 2 following conditions are met

                if (!(ray.x1 >= ray.x2) && output.x < ray.x1) {
                    // 교차지점 x가 광선의 시작 x보다 작다면
                    output.result = false;
                }
                if (!(ray.y1 >= ray.y2) && output.y < ray.y1) {
                    // 교차지점 x가 광선의 시작 y보다 작다면
                    output.result = false;
                }
            }
            return output;
        },

        /**
         * 직선과 원이 교차(충돌)했는지 검사한다.
         *
         * @method lineToCircle
         * @param line {adun.Geom.Line} 직선
         * @param circle {adun.Geom.Circle] 원
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToCircle: function(line, circle, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            if( line.perp(circle.x, circle.y).length <= circle.radius ) {
                output.result = true;
            }

            return output;
        },

        /**
         * 직선과 사각형이 교차(충돌)했는지 검사한다.
         *
         * @method lineToRctangle
         * @param line {adun.Geom.Line} 직선
         * @param rectangle {adun.Geom.Rectangle] 사각형
         * @param [output] {adun.Geom.IntersectResult} 교차점에 대한 정보를 저장한다. [옵션]
         * @return {adun.Geom.IntersectResult}
         * @public
         * @static
         */
        lineToRectangle: function(line, rect, output) {
            if( adun.isUndefined(output) ) { output = new adun.Geom.IntersectResult(); }

            output.result = false;

            adun.Geom.Intersect.lineToRawSegment(line, rect.x, rect.y, rect.right, rect.y, output);

            if( output.result == true ) {
                return output;
            }


        }
    });

    adun.Geom.Intersect = new Intersect();
})();

// #IntersectResult
/**
 * IntersectResult
 * 교차점(충돌 결과)를 저장할 간단한 클래스다.
 * Intersect 클래스의 STATIC 메서드와 함께 사용된다.
 *
 *
 * @Class IntersectResult
 * @namespace Adun.Geom
 * @constructor
 *
 */
(function() {
    'use strict';

    var IntersectResult = adun.Geom.IntersectResult = adun.Class({
        TYPE: 'IntersectResult',

        init: function() {
            this.result = false;
        },

        /**
         * 매개변수에 근거하여 좌표를 설정한다.
         *
         * @method setTo
         * @param [x1=0]
         * @param [y1=0]
         * @param [x2=0]
         * @param [y2=0]
         * @param [width=0]
         * @param [height=0]
         * @public
         */
        setTo: function(x1, y1, x2, y2, width, height) {

            this.x1 = x1 || 0;
            this.y1 = y1 || 0;
            this.x2 = x2 || 0;
            this.y2 = y2 || 0;
            this.width = width || 0;
            this.height = height || 0;
        }

    });


})();




