'use strict'

var $ = require('jquery')
var Rx = require('rx')

var fromEvent = Rx.Observable.fromEvent;

var menuContainer = $('.lower-navbar');
var trayContainer = $('.nav-tray-container');
var navItems = $('#nav-tray-links li');
var navTrays = $('.nav-tray');

var mouseEnterMenuItem = fromEvent(navItems, 'mouseenter');
var mouseLeaveMenuItem = fromEvent(navItems, 'mouseleave');
var mouseEnterTray = fromEvent(navTrays, 'mouseenter');
var mouseLeaveTray = fromEvent(navTrays, 'mouseleave');

var inMenu = mouseEnterMenuItem.map(getMenuItem).merge(mouseLeaveMenuItem.map( () => { return false }))

var inTray = mouseEnterTray.map( () => { return true } ).merge(mouseLeaveTray.map( () => {return false })).startWith(false)

let eventStream = Rx.Observable.combineLatest(inMenu, inTray)
  .debounce(200)
  // .throttle(400)
  // .distinctUntilChanged()

eventStream.filter( (args) => { return args[0] })
  .map( (args) => {return args[0] })
  .subscribe(openTray)

eventStream.filter( (args) => { return !args[0] && !args[1] })
  .do(removeOverlay)
  .subscribe(closeTray)

function addOverlay() {
  let overlay = $('.nav-page-overlay');
  if (overlay.length == 0) {
    overlay = $('<div class="nav-page-overlay"></div>');
    $('body').append(overlay);
  }
  setTimeout( () => {
    overlay.addClass('active');
  }, 10);
}

function removeOverlay() {
  var overlay = $('.nav-page-overlay');
  overlay.removeClass('active');
  overlay.remove();
}

function resetItems() {
  navItems.removeClass('active');
  navTrays.removeClass('active');
}

function openTray(menuItem) {
  resetItems()

  menuItem.addClass('active');

  let trayId = menuItem.data('link')
  let tray = $(trayId)

  trayContainer.addClass('active');

  $(tray).addClass('active');
  addOverlay()
}

function closeTray() {
  navItems.removeClass('active');
  trayContainer.removeClass('active');
  menuContainer.removeClass('active');
}

function getMenuItem(event){
  let $target = $(event.target)
  return $target.is('li') ? $target : $target.parents('li')
}
