var Grey = Grey || {};

Grey.lastDuration = 0;

Grey.chainedDuration = 0;

Grey.tween = (object, targetProperties, durationInFrames, easingFunction, delay, onComplete, onProgress, resetChain) => {
	if (delay === undefined) delay = 0;
	if (typeof resetChain !== 'boolean') resetChain = true;
	if (!onComplete) onComplete = () => {};
	if (!onProgress) onProgress = () => {};

	let count = -delay-1,
		starts = {},
		changes = {};

	const _update = () => {
		count++;

		if (count === 0) {
			for (const key in targetProperties) {
				starts[key] = object[key];
				changes[key] = targetProperties[key] - starts[key];
			}
		}

		if (count < durationInFrames) {
			window.requestAnimationFrame(_update);
		}
		else {
			count = durationInFrames;
		}

		if (count >= 0) {
			for (const key in targetProperties) {
				if (changes[key]) {
					object[key] = easingFunction(count/durationInFrames, starts[key], changes[key]);
				}
			}
		}

		if (count < durationInFrames) {
			onProgress();
		}
		else {
			onComplete();
		}
	};

	_update();

	Grey.lastDuration = durationInFrames;
	if (resetChain) Grey.chainedDuration = 0;

	return Grey;
};

Grey.chain = (object, targetProperties, durationInFrames, easingFunction, delay, onComplete, onProgress) => {
	if (delay === undefined) delay = 0;
	Grey.chainedDuration += Grey.lastDuration;
	Grey.tween(
		object,
		targetProperties,
		durationInFrames,
		easingFunction,
		delay + Grey.chainedDuration,
		onComplete,
		onProgress,
		false
	);
	return Grey;
};

Grey.easeInQuad = (t, b, c) => c*t*t+b;
Grey.easeOutQuad = (t, b, c) => -c*t*(t-2)+b;
Grey.easeInOutQuad = (t, b, c) => (t*=2)<1?c*0.5*t*t+b:-c*0.5*(--t*(t-2)-1)+b;
Grey.easeInCubic = (t, b, c) => c*t*t*t+b;
Grey.easeOutCubic = (t, b, c) => c*(--t*t*t+1)+b;
Grey.easeInOutCubic = (t, b, c) => (t*=2)<1?c*0.5*t*t*t+b:c*0.5*((t-=2)*t*t+2)+b;
Grey.easeInQuart = (t, b, c) => c*t*t*t*t+b;
Grey.easeOutQuart = (t, b, c) => -c*(--t*t*t*t-1)+b;
Grey.easeInOutQuart = (t, b, c) => (t*=2)<1?c*0.5*t*t*t*t+b:-c*0.5*((t-=2)*t*t*t-2)+b;
Grey.easeInQuint = (t, b, c) => c*t*t*t*t*t+b;
Grey.easeOutQuint = (t, b, c) => c*(--t*t*t*t*t+1)+b;
Grey.easeInOutQuint = (t, b, c) => (t*=2)<1?c*0.5*t*t*t*t*t+b:c*0.5*((t-=2)*t*t*t*t+2)+b;
Grey.easeInSine = (t, b, c) => -c*Math.cos(t*Math.PI*0.5)+c+b;
Grey.easeOutSine = (t, b, c) => c*Math.sin(t*Math.PI*0.5)+b;
Grey.easeInOutSine = (t, b, c) => -c*0.5*(Math.cos(t*Math.PI)-1)+b;
Grey.easeInExpo = (t, b, c) => t===0?b:c*Math.pow(2,10*(t-1))+b;
Grey.easeOutExpo = (t, b, c) => t===1?b+c:c*(-Math.pow(2,-10*t)+1)+b;
Grey.easeInOutExpo = (t, b, c) => t===0?b:t===1?b+c:(t*=2)<1?c*0.5*Math.pow(2,10*(t-1))+b:c*0.5*(-Math.pow(2,-10*--t)+2)+b;
Grey.easeInCirc = (t, b, c) => -c*(Math.sqrt(1-t*t)-1)+b;
Grey.easeOutCirc = (t, b, c) => c*Math.sqrt(1- --t*t)+b;
Grey.easeInOutCirc = (t, b, c) => (t*=2)<1?-c*0.5*(Math.sqrt(1-t*t)-1)+b:c*0.5*(Math.sqrt(1-(t-=2)*t)+1)+b;
Grey.easeInElastic = (t, b, c) => {s=1.70158,p=0.3,a=c;return t===0?b:t===1?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),-a*Math.pow(2,10*--t)*Math.sin((t-s)*(2*Math.PI)/p)+b)};
Grey.easeOutElastic = (t, b, c) => {s=1.70158,p=0.3,a=c;return t===0?b:t===1?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),a*Math.pow(2,-10*t)*Math.sin((t-s)*(2*Math.PI)/p)+c+b)};
Grey.easeInOutElastic = (t, b, c) => {s=1.70158,p=0.3*1.5,a=c;return t===0?b:(t*=2)===2?b+c:(a<Math.abs(c)?(a=c,s=p*0.25):s=p/(2*Math.PI)*Math.asin(c/a),t<1?-0.5*a*Math.pow(2,10*--t)*Math.sin((t-s)*(2*Math.PI)/p)+b:a*Math.pow(2,-10*--t)*Math.sin((t-s)*(2*Math.PI)/p)*0.5+c+b)};
Grey.easeInBack = (t, b, c, s=1.70158) => c*t*t*((s+1)*t-s)+b;
Grey.easeOutBack = (t, b, c, s=1.70158) => c*(--t*t*((s+1)*t+s)+1)+b;
Grey.easeInOutBack = (t, b, c, s=1.70158) => (t*=2)<1?c*0.5*(t*t*(((s*=1.525)+1)*t-s))+b:c*0.5*((t-=2)*t*(((s*=1.525)+1)*t+s)+2)+b;
Grey.easeInBounce = (t, b, c) => c-Grey.easeOutBounce(1-t,0,c)+b;
Grey.easeOutBounce = (t, b, c) => t<1/2.75?c*(7.5625*t*t)+b:t<2/2.75?c*(7.5625*(t-=1.5/2.75)*t+0.75)+b:t<2.5/2.75?c*(7.5625*(t-=2.25/2.75)*t+0.9375)+b:c*(7.5625*(t-=2.625/2.75)*t+0.984375)+b;
Grey.easeInOutBounce = (t, b, c) => t<0.5?Grey.easeInBounce(t*2,0,c)*0.5+b:Grey.easeOutBounce(t*2-1,0,c)*0.5+c*0.5+b;

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */