require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Dropbox\\root\\Programming\\Javascript\\Presto\\client\\presto\\home\\home.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var _ = require('lodash');

var Home = React.createClass({
	displayName: 'Home',

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'home' },
			'READY'
		);
	}
});

module.exports = Home;

},{"lodash":"lodash","react":"react"}],"C:\\Dropbox\\root\\Programming\\Javascript\\Presto\\client\\presto\\presto.jsx":[function(require,module,exports){
'use strict';

var React = require('react');
var _ = require('lodash');

//pages
var Home = require('./home/home.jsx');

var PrestoRouter = require('pico-router').createRouter({
	'/': React.createElement(Home, null)
});

var Presto = React.createClass({
	displayName: 'Presto',

	getDefaultProps: function getDefaultProps() {
		return {
			cookies: {},
			url: ''
		};
	},

	render: function render() {
		return React.createElement(
			'div',
			{ className: 'presto' },
			'yoyoyoy',
			React.createElement(PrestoRouter, { initialUrl: this.props.url })
		);
	}
});

module.exports = Presto;

},{"./home/home.jsx":"C:\\Dropbox\\root\\Programming\\Javascript\\Presto\\client\\presto\\home\\home.jsx","lodash":"lodash","pico-router":"pico-router","react":"react"}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Ecm9wYm94L3Jvb3QvUHJvZ3JhbW1pbmcvSmF2YXNjcmlwdC9QcmVzdG8vY2xpZW50L3ByZXN0by9ob21lL2hvbWUuanN4IiwiQzovRHJvcGJveC9yb290L1Byb2dyYW1taW5nL0phdmFzY3JpcHQvUHJlc3RvL2NsaWVudC9wcmVzdG8vcHJlc3RvLmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFHMUIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQzVCLE9BQU0sRUFBRyxrQkFBVTtBQUNsQixTQUFPOztLQUFLLFNBQVMsRUFBQyxNQUFNOztHQUV0QixDQUFBO0VBQ047Q0FDRCxDQUFDLENBQUM7O0FBR0gsTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7Ozs7O0FDYnRCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM3QixJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUcxQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFdEMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQztBQUN0RCxJQUFHLEVBQVUsb0JBQUMsSUFBSSxPQUFHO0NBQ3JCLENBQUMsQ0FBQzs7QUFHSCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDOUIsZ0JBQWUsRUFBRSwyQkFBVztBQUMzQixTQUFPO0FBQ04sVUFBTyxFQUFHLEVBQUU7QUFDWixNQUFHLEVBQUcsRUFBRTtHQUNSLENBQUM7RUFDRjs7QUFFRCxPQUFNLEVBQUcsa0JBQVU7QUFDbEIsU0FBTzs7S0FBSyxTQUFTLEVBQUMsUUFBUTs7R0FFN0Isb0JBQUMsWUFBWSxJQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQUFBQyxHQUFHO0dBQ3ZDLENBQUE7RUFDTjtDQUNELENBQUMsQ0FBQzs7QUFHSCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xyXG5cclxuXHJcbnZhciBIb21lID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdHJlbmRlciA6IGZ1bmN0aW9uKCl7XHJcblx0XHRyZXR1cm4gPGRpdiBjbGFzc05hbWU9J2hvbWUnPlxyXG5cdFx0XHRSRUFEWVxyXG5cdFx0PC9kaXY+XHJcblx0fVxyXG59KTtcclxuXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWU7XHJcbiIsInZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XHJcblxyXG4vL3BhZ2VzXHJcbnZhciBIb21lID0gcmVxdWlyZSgnLi9ob21lL2hvbWUuanN4Jyk7XHJcblxyXG52YXIgUHJlc3RvUm91dGVyID0gcmVxdWlyZSgncGljby1yb3V0ZXInKS5jcmVhdGVSb3V0ZXIoe1xyXG5cdCcvJyAgICAgICAgOiA8SG9tZSAvPixcclxufSk7XHJcblxyXG5cclxudmFyIFByZXN0byA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0Y29va2llcyA6IHt9LFxyXG5cdFx0XHR1cmwgOiAnJ1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cclxuXHRyZW5kZXIgOiBmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPSdwcmVzdG8nPlxyXG5cdFx0XHR5b3lveW95XHJcblx0XHRcdDxQcmVzdG9Sb3V0ZXIgaW5pdGlhbFVybD17dGhpcy5wcm9wcy51cmx9IC8+XHJcblx0XHQ8L2Rpdj5cclxuXHR9XHJcbn0pO1xyXG5cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJlc3RvO1xyXG5cclxuIl19
