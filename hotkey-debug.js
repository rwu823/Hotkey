var Hotkey = (function(global){
  'use strict'

  var Throttle = (function(){

    var proto = Throttle.prototype
    function Throttle(){

    }
    Throttle.do = function(func, ms){
      var skip = 0, timer

      return function(){
        var args = arguments

        if(!skip) func.apply(null, args)

        skip = 1

        clearTimeout(timer)
        timer = setTimeout(function(){
          skip = 0
        }, ms)
      }
    }

    Throttle.cycle = function(){

    }

    Throttle.de = function(func, ms){
      var timer
      return function(){
        var args = arguments

        clearTimeout(timer)
        timer = setTimeout(function(){
          func.apply(null, args)
        }, ms)
      }
    }

    return Throttle
  })()

  var map = {
        65: 'a', 66: 'b', 67: 'c', 68: 'd', 69: 'e', 70: 'f', 71: 'g', 72: 'h', 73: 'i', 74: 'j', 75: 'k', 76: 'l', 77: 'm', 78: 'n',  79: 'o', 80: 'p', 81: 'q', 82: 'r', 83: 's', 84: 't', 85: 'u', 86: 'v', 87: 'w', 88: 'x', 89: 'y', 90: 'z',

        48: '0', 49: '1', 50: '2', 51: '3', 52: '4', 53: '5', 54: '6', 55: '7', 56: '8', 57: '9',
        96: '0', 97: '1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9',

        13: 'enter', 27: 'esc', 9: 'tab',

        192: '`', 188: ',', 190: '.', 191: '/', 111: '/', 186: ';', 222: '\'', 219: '[', 221: ']', 107: '+', 109: '-', 189: '-', 187: '=', 106: '*',

        37: 'left', 38: 'up', 39: 'right', 40: 'down',

        16: 'shift', 17: 'ctrl', 18: 'alt', 91: 'meta'
      },

      comboRE = /ctrl|alt|shift|meta/,
      comboReplaceRE = /ctrl|alt|shift|meta|\s|\+/g,
      
      proto = Hotkey.prototype,
      prevKey,

     setPrevKey = Throttle.de(function(){
       prevKey = null
     }, 100)

  function Hotkey(){}

  Hotkey.record = {}
  Hotkey.on = function(shortcut, func){
    var setShortcut = function(sc){
      sc = sc.toLowerCase()
      var combo = sc.match( new RegExp(comboRE.source, 'g') )

      if(combo) {
        combo.sort().push('')
        sc = combo.join('+') + ( sc.replace(comboReplaceRE, '') )
      }
      Hotkey.record[sc] = Throttle.do(func, 100)
    }

    if( !Array.isArray(shortcut) )  shortcut = new Array(shortcut)

    shortcut.forEach(function(sc){
      setShortcut(sc)
    })
    return Hotkey
  }

  Hotkey.off = function(key){
    delete Hotkey.record[key]

    return Hotkey
  }

  global.addEventListener('keydown', function(e){
    var key = map[e.which]

    setPrevKey()

    if(!key || key === prevKey) return

    Hotkey.shortcut = ''

    if(e.altKey) Hotkey.shortcut += 'alt+'
    if(e.ctrlKey) Hotkey.shortcut += 'ctrl+'
    if(e.metaKey) Hotkey.shortcut += 'meta+'
    if(e.shiftKey) Hotkey.shortcut += 'shift+'

    Hotkey.shortcut += key
    prevKey = key

    if(Hotkey.record[Hotkey.shortcut]){
      Hotkey.record[Hotkey.shortcut](e)
    }
  }, false)

  return Hotkey
})(this)