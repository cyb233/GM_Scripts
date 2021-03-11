// ==UserScript==
// @name         Fast_Reply
// @namespace    https://blog.chrxw.com/
// @version      1.0
// @description  贴吧快速回帖
// @author       Chr_
// @include      https://tieba.baidu.com/p/*
// @license      AGPL-3.0
// @icon         https://blog.chrxw.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

// 快速回帖内容
let VReplys = [];
// 最后选择的项目
let VLast = -1;
// 
(() => {
    'use strict';
    setTimeout(() => {
        addBtns();
        initSelect()
    }, 1000);
    loadCFG();
})();
// 添加工具栏
function addBtns() {
    function genSelect(id, foo) {
        let s = document.createElement('select');
        s.id = id;
        s.style.cssText = 'width:250px;';
        s.addEventListener('change', foo);
        return s;
    }
    function genButton(id, name, foo) {
        let b = document.createElement('button');
        b.id = id;
        b.textContent = name;
        b.addEventListener('click', foo);
        return b;
    }
    let btnArea = document.querySelector('.poster_component.editor_bottom_panel.clearfix');
    let panel = document.createElement('div');
    let selReply = genSelect('selReply', fastReply);
    let btnAdd = genButton('btnAdd', '【添加】', addFastReply);
    let btnDel = genButton('btnDel', '【删除】', delFastReply);
    panel.appendChild(selReply);
    panel.appendChild(btnAdd);
    panel.appendChild(btnDel);
    btnArea.appendChild(panel);
}
// 初始化选择框
function initSelect() {
    let selReply = document.getElementById('selReply');
    selReply.innerHTML = '';
    for (let i = 0; i < VReplys.length; i++) {
        let t = VReplys[i].replace(/<\/?p>/g, ' ').trim().slice(0, 20);
        let o = document.createElement('option');
        o.value = i;
        o.textContent = t;
        if (i == VLast) {
            o.selected = true;
        }
        selReply.appendChild(o);
    }
}
// 快速回复
function fastReply() {
    let selReply = document.getElementById('selReply');
    let editBox = document.getElementById('ueditor_replace');
    if (selReply.selectedOptions.length > 0) {
        let value = selReply.selectedOptions[0].value;
        let id = Number(value);
        VLast = id;
        editBox.innerHTML = VReplys[id];
        saveCFG();
    } else {
        alert('未设置快速回复内容！');
    }
}
// 添加快速回复
function addFastReply() {
    let editBox = document.getElementById('ueditor_replace');
    let msg = editBox.innerHTML;
    for (let i = 0; i < VReplys.length; i++) {
        if (msg == VReplys[i]) {
            alert('快速回复已存在!');
            return;
        }
    }
    VReplys.push(msg);
    initSelect();
    saveCFG();
}
// 删除快速回复
function delFastReply() {
    let selReply = document.getElementById('selReply');
    if (selReply.selectedOptions.length > 0) {
        let value = selReply.selectedOptions[0].value;
        let id = Number(value);
        VReplys.pop(id);
        initSelect();
        saveCFG();
    } else {
        alert('未设置快速回复内容！');
    }
}
// 保存设置
function saveCFG() {
    GM_setValue('VLast', VLast);
    GM_setValue('VReplys', VReplys);
}
// 读取设置
function loadCFG() {
    VReplys = GM_getValue('VLast') || -1;
    VReplys = GM_getValue('VReplys') || [];
}
